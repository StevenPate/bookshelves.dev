const {get} = require("./_book");

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

  switch (display) {
    case "textlink":
    default:
      let {title, link} = details;
      link = (linkType == "purchase") ? link.purchase : link.local
      const textLink = `<a href="${link}">${title}</a>`
      // ????
        // put this in a getter method on _book.js?
        // then it could just be get(ISBN).textLink 
       // ????
      return textLink;
    case "raw":
      return JSON.stringify(get(ISBN));
  }

}

// TODO figure out what the enabled the old book.js shortcode function's async stuff to work

// TODO build a setter for unfound ISBN??

module.exports = book;