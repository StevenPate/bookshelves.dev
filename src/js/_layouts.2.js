//this prevents an error when there is no context e.g. when using shortcode with an ISBN not on a shelf. 
//  might clean this up further.

const {get} = require("./_book");
const {layout} = require("./_layouts")
const { getAllData } = require("./_getData");

// const ISBN = "9780399231094";
// const shelf = 'the-landmarks-of-landmarks'
// const display = "raw"

book = async (
  ISBN, 
  display,
  displayText,
  linkType,
  context,
  thisShelf
  ) => {

  let {id, details, contexts, otherContexts} = get(ISBN);

  if (!details) {
    console.log(`Hey didn't return any details for ${id}. Why don't we go get some now?`);
    const unfoundBookEntry = await getAllData([{ISBN:id,shelves:[]}]);
    console.log(`are there details now?`);
    let missingBook = get(ISBN, null, unfoundBookEntry[0]);
    details = missingBook.details
  }
  
  return layout(id, details, contexts, display);

}

// TODO figure out what the enabled the old book.js shortcode function's async stuff to work

// TODO build a setter for unfound ISBN??

module.exports = book;