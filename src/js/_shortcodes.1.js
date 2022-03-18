const { buildBook, buildLink, buildShelf } = require("./_buildBookshelves");
const { layoutBook } = require("./_layouts")
const { getAllData } = require("./_getData");
// const { logMissing } = require("./_missingISBNs")
const booksOnShelves = require("../_data/booksOnShelves.json");

book = async (
  ISBN, 
  bookDisplayFormat,
  bookLink = "external",
  thisShelf
  ) => {

  let {id, details, contexts} = buildBook(ISBN, thisShelf);
  
  if (!details) {
    const missingISBN = await getAllData([{ISBN:id,shelves:[]}]);
    let missingBook = buildBook(ISBN, null, missingISBN[0]);
    details = missingBook.details
    // logMissingISBN({ id, details});
  }

  let {link, linkText} = buildLink(id, bookLink, details.conversionPath, details.isbn10);
  details.link = bookLink == "local" ? `/${id}` : link;
  details.linkText = bookLink == "local" ? `View book page→` : linkText;
  
  return layoutBook(id, bookDisplayFormat, details, contexts);

}

shelf = async (
  shelfID, 
  bookDisplayFormat,
  bookLink = "external",
  shelfBooks = [],
  ) => {
    const {shelfItems, ...shelfData } = booksOnShelves.shelves.find((element) => element.shelfID == shelfID)
    // console.log(otherShelfData);
    // const {shelfItems, shelfDisplayInfo, newBookLinkTemp}  = buildShelf(shelfID, bookDisplayFormat, bookLink)
    // const { shelfItems, shelfDisplayInfo, bookDisplayFormat, newBookLinkTemp } = buildShelf(shelfID, shelfDisplayFormat, bookLink)
    // console.log(shelfDisplayInfo);

    for (let shelf in shelfItems) { 
      await book(shelfItems[shelf], bookDisplayFormat, bookLink, shelfID).then(value => shelfBooks.push(value))
    }
    // const test = buildShelf(shelfID, shelfBooks, shelfData, bookDisplayFormat, bookLink);
    const test = layoutShelf(shelfID, shelfBooks, shelfData, bookDisplayFormat, bookLink);
    
    console.log(test);

    // console.log(shelfBooks); 
    // console.log(`now we need to wrap this up in some containing element format`);
    // console.log(shelfDisplayInfo, newBookLinkTemp);
  
    // return completeShelf.join();











  
  // const shelfData = booksOnShelves.shelves.find((element) => element.shelfID == shelfID)
  // if (!shelfData) {
  //   return { error: `Bad input: didn't find any data for ${id}`};
  // }
  // const { shelfItems, conversionPath } = shelfData; // we can get a lot more from here
  // bookLink = conversionPath ? conversionPath : bookLink

  // let completeShelf = []
  //   for (let i = 0; i < shelfItems.length; i++) { 
  //     shelfEntries = await book(shelfItems[i], bookDisplayFormat, bookLink, shelfID)
  //     .then(value => shelfItem= value)
  //     completeShelf.push(shelfItem);
  //   }
  // console.log(completeShelf); 
  // console.log(`now we need to wrap this up in some containing element format`);


  // return completeShelf.join();
}

module.exports.book = book; 
module.exports.shelf = shelf; 