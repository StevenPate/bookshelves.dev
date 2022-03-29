const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const slugify = require("slugify");
const bookshelves = require("../../bookshelves.config")
const { checkISBN, getAllData } = require("./_getData");

const processFoldersToShelves = (folderPaths) => {
  let allShelves = [];
  let allBooks = [];

  const createShelves = (folderPath) => {
    const folderContents = fs.readdirSync(folderPath);
    for (let file in folderContents) {
      const fileType = folderPath == masterShelf ? "masterShelf" : "shelf";
      const filePath = folderPath + folderContents[file];
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { birthtime, mtime } = fs.statSync(filePath);
      const { name, ext } = path.parse(filePath);
      let fileData;

      // if ((bookshelves.useLocalInventory != false) && (localinventoryFile != null)) {
      //   console.log(bookshelves.useLocalInventory)
      //   //process localinventoryFile (csv to json)
      // }
     
      const createShelf = (fileData, filePath, fileType) => {
        const {
          title,
          description,
          categories,
          attribution,
          books,
          conversionPath,
        } = fileData[0];
        const shelfItems = books.map((book) => book.ISBN);
        const shelfData = {
          shelfID: path.basename(filePath, ".md"),
          shelfPath: filePath,
          shelfTitle: title,
          shelfDescription: description,
          shelfItems,
          categories: categories || [],
          attribution: attribution,
          conversionPath: conversionPath,
          dateCreated: birthtime || '',
          dateModified: mtime || '',
        };
        allShelves.push(shelfData);

        books.forEach((book) => createShelfEntry(book, filePath, fileType));
      };

      const createShelfEntry = (fileData, filePath, fileType) => {
        if (!fileData.ISBN) {
          return { error: "Bad request" };
        }
        const thisISBN = checkISBN(fileData.ISBN);
        if (thisISBN.error) {
          return;
        }

      // if (bookshelves.useLocalInventory != false) {
      //   console.log(bookshelves.useLocalInventory)
      //   //add local inventory info for ISBN if found
      // }

        Object.keys(fileData).forEach((key) => {
          if (fileData[key] === "" || fileData[key] === []) {
            delete fileData[key];
          }
        });
        delete fileData.details;

        const { ISBN, ...details } = fileData;
        const shelfEntry = {
          ISBN: thisISBN,
          shelves: [
            {
              shelf:
                fileType == "masterShelf"
                  ? fileType
                  : path.basename(filePath, ".md"),
              details,
            },
          ],
        };

        const bookEntryFound = allBooks.find((item) => item.ISBN === thisISBN);

        bookEntryFound
          ? bookEntryFound.shelves.push(shelfEntry.shelves[0])
          : allBooks.push(shelfEntry);
      };

      if (ext == '.md') {
        const data = yaml.loadAll(fileContents);
        if (fileType == "masterShelf") {
          data.longDescription = data[1];
        }
        fileData = fileType == "masterShelf" ? data[0] : data;

        fileType == "shelf"
        ? createShelf(fileData, filePath, fileType)
        : createShelfEntry(fileData, filePath, fileType);
      }

      if ((ext == '.json') && (name == 'test')) {
        const fileData = JSON.parse(fileContents);
        const { lists } = fileData;

        const formatShelfData = shelf => {
          const IDtoISBN = (book) => {
            book.ISBN = (!book.ISBN && book.id) ? book.id : book.ISBN
          }
          shelf.books.forEach((book) => IDtoISBN(book));
          shelf.shelfID = slugify(shelf.title, { lower: true, strict: true });
        }

        lists.map((shelf) => formatShelfData(shelf));
        lists.map((shelf) => createShelf([shelf], shelf.shelfID, 'shelf'))
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

console.log(`/||||| Building ${bookshelves.dataFile} now...`);

const { markdownFiles, masterShelf, jsonFiles, csvFiles} = bookshelves
const booksOnShelves = processFoldersToShelves([ ...masterShelf,...markdownFiles, ...jsonFiles, ...csvFiles]);

addDataToBooks(booksOnShelves);
