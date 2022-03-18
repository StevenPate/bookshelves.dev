const { buildBook, buildLink } = require("./_buildBook");
const { layoutBook } = require("./_layouts")
const { getAllData } = require("./_getData");
// const { logMissingISBN } = require("./_missingISBNs")

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

module.exports = book; 