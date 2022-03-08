const {get} = require("./_book");
const {layout} = require("./_layouts")
const {getAllData} = require("./_getData");

book = async (
  ISBN, 
  display,
  displayText,
  linkType = "purchase",
  context,
  thisShelf
  ) => {

  let {id, details, contexts, otherContexts} = get(ISBN);


  if (!details) {
    const unshelvedISBN = await getAllData([{ISBN:id,shelves:[]}]);
    let missingBook = get(ISBN, null, unshelvedISBN[0]);
    details = missingBook.details
  }
  
  return layout(id, details, contexts, display, linkType);

}

module.exports = book;