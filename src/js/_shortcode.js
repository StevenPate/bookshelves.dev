const {get} = require("./_book");
const {layout} = require("./_layouts")

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

  const {id, details, contexts, otherContexts} = get(ISBN);

  if (!details) {
    console.log(`Hey didn't return any details for ${id}. Why don't we go get some now?`)
    return
  }
  
  return layout(id, details, contexts, display);

}

// TODO figure out what the enabled the old book.js shortcode function's async stuff to work

// TODO build a setter for unfound ISBN??

module.exports = book;