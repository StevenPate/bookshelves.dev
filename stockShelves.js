const fs = require("fs");
const yaml = require("js-yaml");
const bookcovers = require("bookcovers");
const Cache = require("@11ty/eleventy-cache-assets");
const cacheImage = require("./src/js/cacheImage");
const slugify = require("slugify");

let shelvesFile = "./src/_data/ISBNsOnShelves.json";
let ISBNsOnShelves = [];

const processShelves = (folderPath) => {
  let folderContents = fs.readdirSync(folderPath);
  for (let i = 0; i < folderContents.length; i++) {
    let filePath = folderPath + folderContents[i];
    if (filePath.slice(-3) == ".md") {
      try {
        let fileContents = fs.readFileSync(filePath, "utf8");
        let data = yaml.loadAll(fileContents);
        let newShelf = { shelfPath: filePath };
        let isMaster = folderPath == "./content/books/" ? true : false; //*
        let shelfTitle = isMaster ? data[0].ISBN : data[0].title;
        newShelf.shelfTitle = shelfTitle;
        newShelf.shelfID = slugify(shelfTitle, { lower: true, strict: true });
        newShelf.masterShelf = isMaster;
        //////// Add conversionPath if there is one at the shelf level. Then have this cascade to book in book.js
        let booksToAdd = [];
        if (isMaster) {
          //*
          let book = data[0];
          book.content = data[1];
          booksToAdd.push(book);
        } else {
          booksToAdd = data[0].books;
        }
        const addISBN = (book, newShelf) => {
          let bookDataForShelf = {
            title: book.title || null,
            subtitle: book.subtitle || null,
            author: book.author || null,
            description: JSON.stringify(book.description) || null,
            descriptionCredit: book.descriptionCredit || null,
            category: book.category || null,
            coverImage: book.coverImage || null,
            shelfLabel: book.shelfLabel || null,
            conversionPath: book.conversionPath || null,
          };
          let shelf = { ...newShelf };
          shelf.bookData = bookDataForShelf;
          // console.log(shelf);
          let addNewISBN = (shelf) =>
            ISBNsOnShelves.push({
              ISBN: book.ISBN,
              masterShelf: shelf.masterShelf ? shelf.shelfPath : null,
              shelfData: [shelf],
            });

          let existingISBN = ISBNsOnShelves.find(
            (item) => item.ISBN === book.ISBN
          );
          if (existingISBN != (null || undefined)) {
            let addShelfInfo = (shelf) => existingISBN.shelfData.push(shelf);
            let addMasterShelfInfo = (shelf) => {
              existingISBN.masterShelf = shelf.shelfPath;
              existingISBN.shelfData.unshift(shelf);
            };
            if (existingISBN.shelfData) {
              isMaster ? addMasterShelfInfo(shelf) : addShelfInfo(shelf);
            }
          } else {
            addNewISBN(shelf);
          }
        };
        // console.log(booksToAdd);
        (Array.isArray(booksToAdd)) ? 
        booksToAdd
          .filter((book) => book.ISBN)
          .forEach((book) => addISBN(book, newShelf)) :
          addISBN(booksToAdd, newShelf);
      } catch (e) {
        console.log(e);
      }
    }
  }
};

const findDataForISBN = async (ISBN) => {
  let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`; //*
  let data = await Cache(url, {
    type: "json",
    duration: "10d",
  });
  if (data == null) {
    return;
  }

  // this is all specific only to the Google Books API
  const fetchedBookData = {
    ISBN: ISBN,
    title: data.items[0].volumeInfo.title || null,
    subtitle: data.items[0].volumeInfo.subtitle || null,
    author: data.items[0].volumeInfo.authors || null,
    publisher: data.items[0].volumeInfo.publisher || null,
    description: data.items[0].volumeInfo.description || null,
    descriptionCredit: null,
    categories: data.items[0].volumeInfo.categories || null,
    publishedDate: data.items[0].volumeInfo.publishedDate || null,
    coverImage:  null, // data.items[0].volumeInfo.imageLinks.thumbnail
    fullData: [{ GoogleBooks: data }],
  };

  let bookshopCoverImageURL = `https://images-us.bookshop.org/ingram/${ISBN}.jpg?height=1000&`;
  let cachedImage = await cacheImage(bookshopCoverImageURL, "book-cover shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110", ISBN);
  fetchedBookData.bookshopCoverImage = cachedImage;

  // fetchedBookData.fullData.imageData = bookcovers.withIsbn(ISBN).then(results => console.log(results));

  return fetchedBookData;
};

const addFoundData = async (ISBNObjects) => {
  //*
  let fetchedArray = [];
  let fetchActions = [];
  for (let i = 0; i < ISBNObjects.length; i++) {
    const fetchAction = findDataForISBN(ISBNObjects[i].ISBN)
      .then((responseData) => fetchedArray.push(responseData))
      .catch((error) => {
        console.log(error);
      });
    fetchActions.push(fetchAction);
  }
  Promise.all(fetchActions).then(() => {
    let completeISBNs = [];
    fetchedArray.forEach((fetchedItem) => {
      let ISBNObjectsToBuild = ISBNsOnShelves.find(
        (item) => item.ISBN === fetchedItem.ISBN
      );
      ISBNObjectsToBuild.fetchedData = fetchedItem;
      completeISBNs.push(ISBNObjectsToBuild);
      return completeISBNs;
    });
    writeShelvesToJSON(completeISBNs);
  });
};

const writeShelvesToJSON = (itemsForJSON) => {
  const JSONdata = JSON.stringify(itemsForJSON);
  fs.writeFile(shelvesFile, JSONdata, "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File is written successfully!`);
    }
  });
};

processShelves("./src/content/shelves/");

addFoundData(ISBNsOnShelves);

