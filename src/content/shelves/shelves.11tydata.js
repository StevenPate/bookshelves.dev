const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
  html: true
});
// function doStuff(bookObject){
//   console.log(bookObject.ISBN);

//   // let {id, details, contexts, otherContexts} = buildBook(ISBN, thisShelf);
// }

module.exports = {
  eleventyComputed: {
    // title: (data) => md.render(data.title),
    // someBooks: (data) => data.books.map(book => doStuff(book)),
    // thisShelf: (data) => console.log(data.page.fileSlug)
    // bookObjects: (data) => refineBookObject(getISBNObjects(data.books), data.page.inputPath),
  }
}