const MarkdownIt = require('markdown-it');
const booksOnShelves = require("../../_data/booksOnShelves.json");

const md = new MarkdownIt({
  html: true
});
// function doStuff(bookObject){
//   console.log(bookObject.ISBN);

//   // let {id, details, contexts, otherContexts} = buildBook(ISBN, thisShelf);
// }
function getShelfData(shelfID) {
  // const { shelfItems, ...shelfData } = booksOnShelves.shelves.find(
  //   (element) => element.shelfID == shelfID
  // );
  const { dateCreated } = booksOnShelves.shelves.find(
    (element) => element.shelfID == shelfID
  );
  return dateCreated;
  
  // console.log(shelfData);
}

function getCommitDate(shelfID) {
  // const { shelfItems, ...shelfData } = booksOnShelves.shelves.find(
  //   (element) => element.shelfID == shelfID
  // );
  const { commitDate } = booksOnShelves.shelves.find(
    (element) => element.shelfID == shelfID
  );
  return commitDate;
  
  // console.log(shelfData);
}

module.exports = {
  eleventyComputed: {
    shelfID: (data) => data.page.fileSlug,
    dateCreated: (data) => getShelfData(data.page.fileSlug),
    commitDate: (data) => getCommitDate(data.page.fileSlug),
    // dateCreated: shelfData.dateCreated
    // title: (data) => md.render(data.title),
    // title: "{{ title | safe }}",
    // someBooks: (data) => data.books.map(book => doStuff(book)),
    // thisShelf: (data) => console.log(data.page.fileSlug)
    // bookObjects: (data) => refineBookObject(getISBNObjects(data.books), data.page.inputPath),
  }
}