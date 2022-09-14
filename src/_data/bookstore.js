const bookshelves = require("../../bookshelves.config"); //
const fs = require("fs");
const path = require("path");
const ccd = require("cached-commit-date");
const yaml = require("js-yaml");
const { checkISBN } = require("../js/_checkISBN");
const { getAllPlaceholderData } = require("../js/getPlaceholderData");
const { getInventoryData } = require("../js/getInventoryData");

const bookFiles = [bookshelves.bookFolders, bookshelves.shelfFolders].flat();
const allShelves = [];
const allShelfEntries = [];
const allBooks = [];

// package up shelf-specific book info
const createShelfEntry = (fileInfo, fileData) => {
  const thisISBN = checkISBN(fileData.ISBN);
  if (thisISBN.error) {
    return;
  }
  const shelfEntry = {
    shelfID: fileInfo.originFileName,
    ...fileData,
    ...fileInfo,
  };
  allShelfEntries.push(shelfEntry);
};

// create the shelf object (and shelfEntries for any books found)
const createShelf = (fileInfo, fileData) => {
  const {
    title,
    format,
    categories,
    attribution,
    conversionPath,
    visible,
    dateCreated,
    dateModified,
    books,
    originFileLongDescription,
  } = fileData;
  const {
    originFileName,
    originFileType,
    originFileBirthtime,
    originFileMtime,
    originFileCommitDate,
  } = fileInfo;
  if (originFileType != "shelf") {
    return;
  }
  if (!fileData.books) {
    console.log(`${originFileName} has no books`);
    return;
  }

  // for each book, add fileInfo to the book object and add the book to the allBooks array
  books.forEach((book) => {
    createShelfEntry(fileInfo, book);
  });

  // 
  const shelfItems = books.map((book) => book.ISBN);

  const shelf = {
    shelfID: originFileName,
    title,
    description: originFileLongDescription,
    attribution: attribution || bookshelves.default.attribution,
    categories: categories || [],
    format,
    visible,
    conversionPath,
    books: shelfItems,
    originFileType,
    dateCreated: dateCreated || originFileBirthtime,
    dateModified: dateModified || originFileCommitDate || originFileMtime,
  };

  allShelves.push(shelf);
};

// get data from each shelf and book file, then create shelves and shelf entries
const formatBooksAndShelves = (folders) => {
  folders.forEach((folder) => {
    const folderContents = fs.readdirSync(folder);
    for (let file in folderContents) {
      const originFilePath = folder + folderContents[file];
      const originFileType =
        folder == bookshelves.bookFolders ? "book" : "shelf";
      const fileContents = fs.readFileSync(originFilePath, "utf8");
      const { birthtime, mtime } = fs.statSync(originFilePath);
      const { name, ext } = path.parse(originFilePath);
      const originFileCommitDate = ccd.commitDate(originFilePath);

      const fileInfo = {
        originFileType, // the type of file (book or shelf)
        originFileName: name, // the name of the file
        originFilePath, // the path to the file
        originFileBirthtime: birthtime, // the time the file was created
        originFileMtime: mtime, // the time the file was last modified
        originFileCommitDate, // the time the file was last committed to git
      };

      let fileData;

      // check to see if file is a markdown file and get the data from it; add json next...
      if (ext == ".md") {
        const data = yaml.loadAll(fileContents);
        fileData = { ...data[0], originFileLongDescription: data[1] };
      } else if (ext == ".json") {
        console = console.log(`${originFilePath} is a json file!`);
        fileData = JSON.parse(fileContents);
        // TODO add json file data to the book object
      } else {
        console.log(`${originFilePath} is not a markdown file or a json file!`);
        return;
      }

      originFileType == "shelf"
        ? createShelf(fileInfo, fileData)
        : createShelfEntry(fileInfo, fileData);
    }
  });
};

// add all books, with all shelfEntries, to the allBooks array
const collectBooksWithShelves = (shelfEntries) => {
  shelfEntries.forEach((shelfEntryData) => {
    const { ISBN, originFileName, ...details } = shelfEntryData;
    let shelfID = originFileName;
    shelfEntry = { shelfID, ...details }; // what we would insert into shelves array for a book
    let bookEntry = { ISBN, shelves: [shelfEntry] }; // what we would insert into allBooks array

    // check to see if ISBN is in the allBooks array
    const bookEntryFound = allBooks.find(
      (item) => item.ISBN === shelfEntryData.ISBN
    );

    const addShelfEntry = (shelfEntry) => {
      bookEntryFound.shelves.push(shelfEntry);
      if (shelfEntry.visible == true && bookEntryFound.visible != true) {
        bookEntryFound.visible = true;
      }
    };

    // if we find a book, just add another shelfEntry for that book. If we don't, add the book.
    bookEntryFound ? addShelfEntry(shelfEntry) : allBooks.push(bookEntry);

  });
};
// write the data to json file(s)
const bookshelvesToJSON = (itemsForJSON, outputFile) => {
  const JSONdata = JSON.stringify(itemsForJSON);
  fs.writeFile(outputFile, JSONdata, "utf8", (err) => {
    if (err) {
      console.log(`Error writing ${outputFile}: ${err}`);
    } else {
      console.log(`[][][][] ${outputFile} is written successfully!`);
    }
  });
};

// add API data to the books, get inventory info, and write to json file
const booksWithDataToJSON = async (books, outputFile) => {
  const booksWithPlaceholderData = await getAllPlaceholderData(books);
  const booksWithInventoryData = getInventoryData(booksWithPlaceholderData);
  bookshelvesToJSON(booksWithInventoryData, outputFile);
  // bookshelvesToJSON(booksWithInventoryData, outputFile);
};

// TODO allow JSON format for bookFiles
// TODO add inventory data to the books

formatBooksAndShelves(bookFiles);
collectBooksWithShelves(allShelfEntries);
bookshelvesToJSON(allShelves, bookshelves.shelvesDataFile);
booksWithDataToJSON(allBooks, bookshelves.booksDataFile);

module.exports.books = allBooks;
module.exports.shelves = allShelves;