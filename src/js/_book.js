const booksOnShelves = require("../_data/booksOnShelves.json");

class Book {

  constructor(id) {
    //TODO make sure ID is ISBN or spit out an ISBN
    this.id = id
  }

  details() {

    const bookData = booksOnShelves.books.find((element) => element.ISBN == this.id);
    const masterShelf = bookData.shelves.find((element) => element.shelf == "masterShelf");

    const details = (masterShelf) 
      ? {...bookData.google, ...bookData.bookshopOrg, ...masterShelf.details} 
      : {...bookData.google, ...bookData.bookshopOrg} 

    this.details = details;

  }

  context(thisShelf) {

    const bookData = booksOnShelves.books.find((element) => element.ISBN == this.id);

    if (thisShelf) {
      const shelfInfo = booksOnShelves.shelves.find((element) => element.shelfID == thisShelf);
      const shelfData = bookData.shelves.find((element) => element.shelf == thisShelf);
      if (shelfData) {
        this.details = {...this.details, ...shelfInfo, ...shelfData.details}
      }
    }

    const defineContext = shelfEntry => {
      const shelfInfo = booksOnShelves.shelves.find((element) => element.shelfID == shelfEntry.shelf);
      const shelfData = bookData.shelves.find((element) => element.shelf == shelfEntry.shelf);
      if (shelfData.shelf == "masterShelf") { return }
      // const shelfContext = {...shelfInfo, ...shelfData.details}
      const {title, shelfLabel, attribution, shelfTitle} = {...shelfInfo, ...shelfData.details}

      let byAttribution = (attribution) 
        ? ` by ${attribution}` 
        : ``
      let label = (shelfLabel) 
        ? `was named ${shelfLabel}${byAttribution} on the ${shelfTitle} shelf.` 
        : `was added to the ${shelfTitle} shelf${byAttribution}.`

      const contextDescription = `${this.details.title} ${label}`;

      console.log(contextDescription);
    }


    bookData.shelves.forEach(shelfEntry => defineContext(shelfEntry));

    // let contexts = bookData.shelves;
    // for (let shelf in bookData.shelves) {
    //   if (shelf.shelf == "masterShelf") { continue; }
    //   console.log(shelf);
    // }
    // console.log(contexts);



    

    // create contextObject
    //   if no thisShelf, then just do all the shelves it's on
    //   if there is a thisShelf, then write all the other shelves (This book is also on...)
  }

  cover(type ="raw") {
    //   raw is preferred URL
    //   google is google
    //   cached is cached
    //   etc 
  }

  link(type ="purchase") {
    //   
  }
}

function getBook(ISBN, shelf) {
  // TODO verify that it's a proper ISBN. If not, Detect other formats and search in identifiers/
  let book = new Book(ISBN)
    book.details() // if we're going to fetch data for missing ISBNs, containing function will need to be async
    book.context(shelf)
    // book.context(shelf) 
  // book.cover();
  // book.link();
  // console.log(book);
  return book
}

// let book = new Book("9780062954794", 'the-landmarks-of-landmarks');
// let testBook = getBook("9780062954794", 'the-landmarks-of-landmarks');
let testBook = getBook("9780062954794", 'books-i-have-finished-in-2022');
// let testBook = getBook("9780062954794");
// console.log(testBook);

// module.exports = getBook("9780399231094");
// module.exports = getBook(ISBN);