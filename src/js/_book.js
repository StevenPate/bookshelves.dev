const {get} = require("./_buildBook");
const {layout} = require("./_layouts")
const {getAllData} = require("./_getData");
const {logMissing} = require("./_missingISBNs")

book = async (
  ISBN, 
  display,
  linkInfo = "purchase",
  thisShelf
  ) => {

  let {id, details, contexts, otherContexts} = get(ISBN, thisShelf);

  if (!details) {
    const unshelvedISBN = await getAllData([{ISBN:id,shelves:[]}]);
    let missingBook = get(ISBN, null, unshelvedISBN[0]);
    details = missingBook.details
    logMissing({ id, details});
  }

  return layout(id, display, details, contexts, otherContexts, linkInfo);

}

module.exports = book;