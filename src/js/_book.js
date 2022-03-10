const { buildBook, buildLink } = require("./_buildBook");
const { layout } = require("./_layouts")
const { getAllData } = require("./_getData");
const { logMissing } = require("./_missingISBNs")

book = async (
  ISBN, 
  display,
  linkInfo = "purchase",
  thisShelf
  ) => {

  let {id, details, contexts, otherContexts} = buildBook(ISBN, thisShelf);

  if (!details) {
    const unshelvedISBN = await getAllData([{ISBN:id,shelves:[]}]);
    let missingBook = buildBook(ISBN, null, unshelvedISBN[0]);
    details = missingBook.details
    logMissing({ id, details});
  }

 details.link = linkInfo == "local" ? `/${id}` : buildLink(id, linkInfo, details.conversionPath);


  return layout(id, display, details, contexts, otherContexts, linkInfo);

}

module.exports = book;