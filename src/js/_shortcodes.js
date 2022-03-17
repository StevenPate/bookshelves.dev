const { buildBook, buildLink } = require("./_buildBook");
const { layout } = require("./_layouts")
const { getAllData } = require("./_getData");
const { logMissing } = require("./_missingISBNs")
const booksOnShelves = require("../_data/booksOnShelves.json");

book = async (
  ISBN, 
  display,
  linkInfo = "external",
  thisShelf
  ) => {

  let {id, details, contexts} = buildBook(ISBN, thisShelf);
  
  if (!details) {
    const unshelvedISBN = await getAllData([{ISBN:id,shelves:[]}]);
    let missingBook = buildBook(ISBN, null, unshelvedISBN[0]);
    details = missingBook.details
    logMissing({ id, details});
  }

  let {link, linkText} = buildLink(id, linkInfo, details.conversionPath, details.isbn10);
  details.link = linkInfo == "local" ? `/${id}` : link;
  details.linkText = linkInfo == "local" ? `View book page→` : linkText;
  
  return layout(id, display, details, contexts);

}

shelf = async (
  shelfID, 
  display,
  linkInfo = "external"
  ) => {
    const shelfData = booksOnShelves.shelves.find((element) => element.shelfID == shelfID)
    if (!shelfData) {
      return { error: `Bad input: didn't find any data for ${id}`};
    }
    const { shelfItems, conversionPath } = shelfData; // we can get a lot more from here, including conversionPath (for linkInfo)
    linkInfo = conversionPath
      ? conversionPath
      : linkInfo
    console.log(linkInfo);

    let completeShelf = []
      for (let i = 0; i < shelfItems.length; i++) { 
        shelfEntries = await book(shelfItems[i], display, linkInfo, shelfID)
        .then(value => shelfItem= value)
        completeShelf.push(shelfItem);
      }
    // console.log(completeShelf); 
    console.log(`now we need to wrap this up in some containing element format`);


  return completeShelf.join();
}

module.exports.book = book; 
module.exports.shelf = shelf; 