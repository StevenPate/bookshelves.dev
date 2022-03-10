const commerce = require("../_data/commerce.json");
const booksOnShelves = require("../_data/booksOnShelves.json");

class Book {
  constructor(id, shelf, shelfEntry) {
    //TODO make sure ID is ISBN or spit out an ISBN
    this.id = id;
    const bookData = shelfEntry
      ? shelfEntry
      : booksOnShelves.books.find((element) => element.ISBN == this.id);
    if (!bookData) {
      this.error = `Bad input: didn't find any data for ${id}`;
      return;
    }

    this.shelf = shelf || null;
    const masterShelf = bookData.shelves.find(
      (element) => element.shelf == "masterShelf"
    );
    const details = masterShelf
      ? { ...bookData.google, ...bookData.bookshopOrg, ...masterShelf.details }
      : { ...bookData.google, ...bookData.bookshopOrg };
    this.details = details;

    if (this.shelf) {
      const shelfInfo = booksOnShelves.shelves.find(
        (element) => element.shelfID == this.shelf
      );
      const shelfData = bookData.shelves.find(
        (element) => element.shelf == this.shelf
      );
      if (shelfData) {
        this.details = { ...this.details, ...shelfInfo, ...shelfData.details };
      }
    }

    let contexts = [];
    const shelvesForContext = bookData.shelves.filter(
      (shelfEntry) => shelfEntry.shelf != "masterShelf"
    );
    const collectAllContexts = (shelfEntries) => {
      const contextDetails = (shelfEntry) => {
        const shelfInfo = booksOnShelves.shelves.find(
          (element) => element.shelfID == shelfEntry.shelf
        );
        const shelfData = bookData.shelves.find(
          (element) => element.shelf == shelfEntry.shelf
        );
        const {
          shelfLabel,
          attribution,
          shelfTitle,
          shelfID,
          shelfItems,
          shelfDescription,
        } = { ...shelfInfo, ...shelfData.details };
        const title = this.details.title;
        // TODO: expand this placeholder
        const descriptive = `<a href="/${shelfID}">${shelfTitle}</a>`;

        const fullContext = {
          title,
          shelfLabel,
          attribution,
          shelfTitle,
          shelfID,
          shelfItems,
          shelfDescription,
          descriptive,
        };

        return fullContext;
      };

      shelfEntries.forEach((shelfEntry) =>
        contexts.push(contextDetails(shelfEntry))
      );
      return contexts;
    };

    this.contexts = collectAllContexts(shelvesForContext);
    this.otherContexts = this.contexts.filter(
      (context) => context.shelfID != this.shelf
    );
  }
}

const buildBook = (ISBN, shelf, shelfEntry) => {
  let book = new Book(ISBN, shelf, shelfEntry);
  return book;
};

const buildLink = (id, linkInfo, conversionPath) => {
  
  if (/::/.test(linkInfo)) {
    linkComponents = linkInfo.split(new RegExp("[::]"));
    linkType = linkComponents[0];
    linkValue = linkComponents[2];
  } else {
    linkType = linkInfo;
    linkValue = conversionPath ? conversionPath : "default";
  }

  let commercePath = commerce.conversions.find((item) => item.pathName === linkValue);

  link =
    commercePath != undefined
      ? commercePath.pathURL.replace("[ISBN]", id)
      : (/^a\d+$/i.test(linkValue))
        ? `${commerce.bookshoporgLink}${linkValue.substring(1)}/${id}`
        : link

  return link;
};

// let testBook = get("9780062954794", 'the-landmarks-of-landmarks');
// let testBook = getBook("9780062954794", 'books-i-have-finished-in-2022');
// let testBook = getBook("9780062954794");
// console.log(testBook);

module.exports.buildLink = buildLink;
module.exports.buildBook = buildBook;
