const ISBNsOnShelves = require("../_data/ISBNsOnShelves.json");
const identifiers = require("./identifiers")

class Book {
  constructor(identifiers) {
    //TODO make sure ID is ISBN or spit out an ISBN
    this.id = identifiers.isbn13;
    this.identifiers = identifiers
  }
  details() {

    // find the ISBN in ISBNonShelves, return the details object
    let details = ISBNsOnShelves.find( //working
      (element) => element.ISBN == this.id
    );

    // if the ISBN is not found, we'll want to go fetch some details for it
    if (details == null) { //working
      console.log(`No details found for ${this.id}. Should go fetch that now... `)
      details = {fetchedData: {title : "TBD",author:"TBD"}};
    }

    // use the details objecxt to set the properties of the this book
    this.title = details.fetchedData.title;
    this.description = details.fetchedData.description;
    // this.title = details.fetchedData.title
    // this.author = details.fetchedData.author
    // console.log(details.shelfData);

    this.shelves = [];
    for (let shelf of details.shelfData) {
      // console.log(shelf.shelfID);
      this.shelves.push(shelf.shelfID);
    }
    // this.shelves = 
  }
  context(shelves, location = "everywhere!") {
    console.log(`The ${this.id} book has a context based on this input: ${location}!`);
  }
}

async function getBook(id) {
  const allIdentifiers = await identifiers(id);
  let book = new Book(allIdentifiers)
  book.details()
  book.context()
  // console.log(book);
  return book
}

// let book = new Book("9780062954794", 'the-landmarks-of-landmarks');
// getBook("9780062954794") // run the async function at the top-level, since top-level await is not currently supported in Node

module.exports = getBook("9780399231094");
// module.exports = getBook(input);







// book.getIdentifiers();
// book.details();
// book.context();
// console.log(book);