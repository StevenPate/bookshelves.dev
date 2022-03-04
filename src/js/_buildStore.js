// _buildStore.js
const fs = require("fs");
const path = require('path');
const yaml = require("js-yaml");
const { getIdentifiers, getGoogle, getOpenLibrary, getBookshopOrg } = require("./_getData");
const masterShelf = "./src/content/books/";
const folders = ["./src/content/shelves/", masterShelf];
const shelvesFile = "./src/_data/booksOnShelves.json";

const processFoldersToShelves = (folderPaths) => {

  let allShelves = [];
  let allBooks = [];

  const createShelves = folderPath => {  
    const folderContents = fs.readdirSync(folderPath);
    for (let file in folderContents) {
      
      const fileType = (folderPath == masterShelf) ?  "masterShelf" : "shelf"
      const filePath = folderPath + folderContents[file];
      const { ext } = path.parse(filePath);
      if (ext != ".md") { continue; }

      const fileContents = fs.readFileSync(filePath, "utf8");
      const data = yaml.loadAll(fileContents); 
      if (fileType == "masterShelf") { 
        data.longDescription = data[1];
      }
      const fileData = (fileType == "masterShelf") ? data[0] : data

      const createShelf = (fileData, filePath, fileType) => {
        const {title, categories, attribution, books, conversionPath} = fileData[0];
        const shelfData = {
          shelfID: path.basename(filePath, '.md'),
          shelfPath: filePath,
          shelfTitle: title,
          categories: categories,
          attribution: attribution,
          conversionPath: conversionPath,
        }
        allShelves.push(shelfData)

        books.forEach((book) => createShelfEntry(book, filePath, fileType)) 
      }
  
      const createShelfEntry = (fileData, filePath, fileType) => {
        if (!fileData.ISBN) {
          return { error: "Bad request" };
        }
        const thisISBN = fileData.ISBN;
        const {ISBN, ...details} = fileData;
        const shelfEntry = {
          ISBN: thisISBN,
          // shelves: [{[fileType]: filePath,  details}]
          shelves: [{
            shelf: (fileType == "masterShelf") ? fileType : path.basename(filePath, '.md'),  
            details}]
        }
   
 
        const bookEntryFound = allBooks.find(
          (item) => item.ISBN === thisISBN
        );

        (bookEntryFound) 
          ? bookEntryFound.shelves.push(shelfEntry.shelves[0])
          : allBooks.push(shelfEntry)


      }

      (fileType == "shelf") ? createShelf(fileData, filePath, fileType) : createShelfEntry(fileData, filePath, fileType);
    }
  }

  folderPaths.forEach(createShelves);

  return {books: allBooks, shelves:allShelves}
}

const addDataToBooks = async (booksOnShelves) => {
  
  const {books,shelves} = booksOnShelves
  // console.log(shelves);

  // let booksForData = booksOnShelves.books
  // console.log(booksOnShelves.shelves)

  for (let i = 0; i < books.length; i++) {  // use promise.all or something better here
    identifiers = await getIdentifiers(books[i].ISBN)
    .then(value => books[i].identifiers = value)
    google = await getGoogle(books[i].ISBN)
    .then(value => books[i].google = value)
    openlibrary = await getOpenLibrary(books[i].ISBN)
    .then(value => books[i].openlibrary = value)
    bookshopOrg = await getBookshopOrg(books[i].ISBN)
    .then(value => books[i].bookshopOrg = value)
  }

  bookshelvesToJSON({books, shelves});
  // bookshelvesToJSON(books);
}

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

const booksOnShelves = processFoldersToShelves(folders);

addDataToBooks(booksOnShelves);
