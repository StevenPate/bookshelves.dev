// now uses consolidated function for data fetching, more encapsulated code to use elsewhere.
const fs = require("fs");
const path = require('path');
const yaml = require("js-yaml");
const { getAllData } = require("./_getData");
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
        const {title, description, categories, attribution, books, conversionPath} = fileData[0];
        const shelfData = {
          shelfID: path.basename(filePath, '.md'),
          shelfPath: filePath,
          shelfTitle: title,
          shelfDescription: description,
          shelfItems: books.length,
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
  const booksWithData = await getAllData(books);
  // console.log(test);

  bookshelvesToJSON({books:booksWithData, shelves});
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
