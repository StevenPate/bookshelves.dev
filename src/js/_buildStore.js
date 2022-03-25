const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { checkISBN, getAllData } = require("./_getData");
const masterShelf = "./src/content/books/";
const folders = ["./src/content/shelves/", masterShelf];
const shelvesFile = "./src/_data/booksOnShelves.json";

const processFoldersToShelves = (folderPaths) => {
  let allShelves = [];
  let allBooks = [];

  const createShelves = (folderPath) => {
    const folderContents = fs.readdirSync(folderPath);
    for (let file in folderContents) {
      const fileType = folderPath == masterShelf ? "masterShelf" : "shelf";
      const filePath = folderPath + folderContents[file];
      const { ext } = path.parse(filePath);
      if (ext != ".md") {
        continue;
      }

      const fileContents = fs.readFileSync(filePath, "utf8");
      const { birthtime, mtime } = fs.statSync(filePath);

      const data = yaml.loadAll(fileContents);
      if (fileType == "masterShelf") {
        data.longDescription = data[1];
      }
      const fileData = fileType == "masterShelf" ? data[0] : data;

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
          dateCreated: birthtime,
          dateModified: mtime,
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

      fileType == "shelf"
        ? createShelf(fileData, filePath, fileType)
        : createShelfEntry(fileData, filePath, fileType);
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
  fs.writeFile(shelvesFile, JSONdata, "utf8", (err) => {
    if (err) {
      console.log(`Error writing ${shelvesFile}: ${err}`);
    } else {
      console.log(`${shelvesFile} is written successfully!`);
    }
  });
};

console.log(`Building ${shelvesFile} now...`);

const booksOnShelves = processFoldersToShelves(folders);

addDataToBooks(booksOnShelves);
