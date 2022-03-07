const {get} = require("./_book");
const {full} = require("./_layouts")

// const ISBN = "9780399231094";
// const shelf = 'the-landmarks-of-landmarks'
// const display = "raw"

book = async (ISBN, display,
  displayText,
  linkType,
  context,
  thisShelf
  
  
  ) => {

  const {id, details, contexts, otherContexts} = get(ISBN);

  if (!details) {
    console.log(id)
    return
  }
  
  switch (display) {
    case "textlink":
    default:
      let {title, link} = details;
      link = (linkType == "purchase") ? link.purchase : link.local
      const textLink = `<a href="${link}">${title}</a>`
      return textLink;
    case "full":
      return full(id, details, contexts);
    case "raw":
      return JSON.stringify(get(ISBN));
  }

}

// TODO figure out what the enabled the old book.js shortcode function's async stuff to work

// TODO build a setter for unfound ISBN??

module.exports = book;