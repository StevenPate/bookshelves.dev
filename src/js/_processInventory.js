const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const csv = require("csv-parser");
const slugify = require("slugify");
const bookshelves = require("../../bookshelves.config");
const { checkISBN, getAllData } = require("./_getData");
const ccd = require("cached-commit-date");

const { markdownFiles, masterShelf, jsonFiles, csvFiles } = bookshelves;

const processFoldersToShelves = (folderPaths) => {
  console.log(`/||||| Building ${bookshelves.dataFile} now...`);

  // If there' is a problem writing to the datafile location, log an error
  fs.writeFile(bookshelves.dataFile, "", "utf8", (err) => {
    if (err) {
      console.log(`Error writing empty ${bookshelves.dataFile}: ${err}`);
    }
  });
  // Build the shelves and books arrays
  const allShelves = [];
  const allBooks = [];

  // If there is a local inventory file, create a JSON file for sharing and also to use when building the master shelf for a book
  const localInventory = [];
  const writeInventoryFile = (inventoryJSON) => {
    fs.writeFile(
      bookshelves.localInventoryFileData,
      inventoryJSON,
      "utf8",
      (err) => {
        if (err) {
          console.log(
            `Error writing ${bookshelves.localInventoryFileData}: ${err}`
          );
        } else {
          console.log(
            `${bookshelves.localInventoryFileData} is written successfully!`
          );
        }
      }
    );
  };
  if (
    bookshelves.useLocalInventory != "false" &&
    bookshelves.localInventoryFile != null
  ) {
    // todo: if localInventoryFile is undefined, if fs.existsSync is false, or if it doesn't look like a CSV throw an error.
    // 'you said to use local Inventory but did not provide a file
    const useLocalInventory = bookshelves.useLocalInventory;
    fs.createReadStream(bookshelves.localInventoryFile)
      .pipe(csv())
      .on("data", (data) => localInventory.push({ ...data, useLocalInventory }))
      .on("end", () => {
        writeInventoryFile(JSON.stringify(localInventory));
      });
  } else {
    writeInventoryFile(JSON.stringify([{}]));
  }

  // Process each folder where shelf documents are expected to be found
  const createShelves = (folderPath) => {
    // Get the shelf files in the folder
    const folderContents = fs.readdirSync(folderPath);
    // If the file is in the designated "mastershelf" folder, then process it as a master shelf,
    // otherwise process it as a shelf
    for (let file in folderContents) {
      const fileType = folderPath == masterShelf ? "masterShelf" : "shelf";
      const filePath = folderPath + folderContents[file];
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { birthtime, mtime } = fs.statSync(filePath);
      const { name, ext } = path.parse(filePath);
      const commitDate = ccd.commitDate(filePath);

      let fileData;

      const createShelf = (fileData, filePath, fileType) => {
        // get shelf attributes from the front matter
        const {
          title,
          description,
          categories,
          attribution,
          books,
          conversionPath,
          dateCreated,
          dateModified,
          visible = true,
        } = fileData[0];
        //  add ISBNs on in the books array as shelfItems
        const shelfItems = books.map((book) => book.ISBN);
        // create the shelf object
        const shelfData = {
          shelfID: path.basename(filePath, ".md"),
          visible: visible,
          shelfPath: filePath,
          shelfTitle: title,
          shelfDescription: description,
          shelfItems,
          categories: categories || [],
          tags: categories || [],
          attribution: attribution,
          conversionPath: conversionPath,
          commitDate,
        };
        allShelves.push(shelfData);

        
        books.forEach((book) =>
          createShelfEntry(book, filePath, fileType, visible, dateCreated, dateModified)
        );
      };

      const createShelfEntry = (fileData, filePath, fileType, visible, dateCreated, dateModified) => {
        if (!fileData.ISBN) {
          return { error: "Bad request" };
        }

        const thisISBN = checkISBN(fileData.ISBN);
        if (thisISBN.error) {
          return;
        }

        const format = fileData.audiobook ? "audiobook" : "book";

        // if (bookshelves.useLocalInventory != false) {
        //   //add local inventory info for ISBN if found
        // }

        Object.keys(fileData).forEach((key) => {
          if (fileData[key] === "" || fileData[key] === []) {
            delete fileData[key];
          }
        });
        delete fileData.details;

        const { ISBN, audiobook, ...details } = fileData;
        const shelfEntry = {
          ISBN: thisISBN,
          format: format,
          visible:  visible,
          shelves: [
            {
              shelf:
                fileType == "masterShelf"
                  ? fileType
                  : path.basename(filePath, ".md"),
              details,
              dateCreated: details.dateCreated || dateCreated || birthtime || "whaddup!",
              dateModified: details.dateModified || dateModified || mtime || "",
              visible:  details.visible,
            },
          ],
          dateCreated: details.dateCreated || dateCreated || birthtime || "whaddup!",
          dateModified: details.dateModified || dateModified || mtime || "",
        };

        const bookEntryFound = allBooks.find((item) => item.ISBN === thisISBN);

        const addShelfEntry = (shelfEntry) => {
          bookEntryFound.shelves.push(shelfEntry.shelves[0])
          if ((shelfEntry.visible == true) && (bookEntryFound.visible != true)) {
            bookEntryFound.visible = true;
          }
        }

        bookEntryFound
          ? addShelfEntry(shelfEntry)
          : allBooks.push(shelfEntry);
      };

      if (ext == ".md") {
        const data = yaml.loadAll(fileContents);
        if (fileType == "masterShelf") {
          data.longDescription = data[1];
        }
        fileData = fileType == "masterShelf" ? data[0] : data;

        fileType == "shelf"
          ? createShelf(fileData, filePath, fileType)
          : createShelfEntry(fileData, filePath, fileType);
      }

      if (ext == ".json" && name == "test") {
        const fileData = JSON.parse(fileContents);
        const { lists } = fileData;

        const formatShelfData = (shelf) => {
          const IDtoISBN = (book) => {
            book.ISBN = !book.ISBN && book.id ? book.id : book.ISBN;
          };
          shelf.books.forEach((book) => IDtoISBN(book));
          shelf.shelfID = slugify(shelf.title, {
            lower: true,
            strict: true,
          });
        };

        lists.map((shelf) => formatShelfData(shelf));
        lists.map((shelf) => createShelf([shelf], shelf.shelfID, "shelf"));
      }
      // if (ext == '.csv') {
      // get fileData, filePath, fileType and shelfItems
      // }
      else {
        continue;
      }
    }
  };

  folderPaths.forEach(createShelves);

  return { books: allBooks, shelves: allShelves };
};

const addDataToBooks = async (booksOnShelves) => {
  const { books, shelves } = booksOnShelves;
  const booksWithData = await getAllData(books);

  bookshelvesToJSON({ books: booksWithData, shelves });
};

const bookshelvesToJSON = (itemsForJSON) => {
  const JSONdata = JSON.stringify(itemsForJSON);
  fs.writeFile(bookshelves.dataFile, JSONdata, "utf8", (err) => {
    if (err) {
      console.log(`Error writing ${bookshelves.dataFile}: ${err}`);
    } else {
      console.log(`/||||| ${bookshelves.dataFile} is written successfully!`);
    }
  });
};

const booksOnShelves = processFoldersToShelves([
  ...masterShelf,
  ...markdownFiles,
  ...jsonFiles,
  ...csvFiles,
]);

addDataToBooks(booksOnShelves);
