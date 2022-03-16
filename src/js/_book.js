const { buildBook, buildLink } = require("./_buildBook");
const { layout } = require("./_layouts")
const { getAllData } = require("./_getData");
const { logMissing } = require("./_missingISBNs")

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

module.exports = book; 