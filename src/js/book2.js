const {
  usePlaceholderData,
  placeholderDataSource,
  placeHolderImageSource,
} = require("../../bookshelves.config"); //
const { books, shelves } = require("../_data/bookstore"); //
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({
  html: true,
});

book2 = (book2) => {
  ISBN = book2.ISBN.trim();

  const { placeholderData, shelves } = books.find((item) => item.ISBN === ISBN);

  const removeUndefined = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    });
    return obj;
  };

  // if we are using placeholder data, collect the data from the placeholder data sources
  let placeHolderEntry =
    usePlaceholderData === true
      ? removeUndefined(placeholderData[placeholderDataSource])
      : null;
  let cover =
    usePlaceholderData === true
      ? placeholderData[placeHolderImageSource]
      : null;
  placeHolderEntry = {
    ...placeHolderEntry,
    image: cover.coverUrl,
    cachedImage: cover.cachedCoverUrl,
  };

  // if we were passed a shelf, see if there is a shelfEntry for that shelfID attached to this ISBN and use that data
  let currentShelfEntry = (book2.shelf == null || book2.shelf == undefined) 
    ? null
    : shelves.find((item) => item.shelfID == book2.shelf);
  currentShelfEntry = currentShelfEntry == null ? null : removeUndefined(currentShelfEntry);

  // grab any defaultShelf info for the ISBN
  let defaultShelfEntry = shelves.find((item) => item.shelfID == ISBN);
  //   defaultShelfEntry = removeUndefined(defaultShelfEntry);

  const thisShelfEntry = {
    ...placeHolderEntry,
    ...defaultShelfEntry,
    ...currentShelfEntry,
  };

  //put what we need of the book into a new object
  const { title, authors, description, image, cachedImage } = thisShelfEntry;
  // console.log(thisShelfEntry);

  //TODO add the shelf information to the book object as context
  //TODO ensure that important shelf information (conversionPath, etc.) is cascading down to shelfEntry
  //TODO add the link information to the book object

  const bookEntry = {
    ISBN: ISBN,
    shelf: book2.shelf,
    layout: book2.layout || "default",
    title,
    authors,
    description: description ? md.render(description) : "",
    image,
    cachedImage,
  };

  // put book info into a layout
  return displayBook(bookEntry);
};

const displayBook = (bookEntry) => {
  const { ISBN, title, layout, authors, description, cachedImage, shelf } = bookEntry;
  const optionalShelfInfo = !shelf ? "" : ` on the "${shelf}" shelf`;
  switch (layout) {
    case "title":
      return `<div><em><strong>${title}</strong></em>.</div>`;
    case "title-full":
      return `<div><em><strong>${title}</strong></em> by ${authors}.</div>`;
    case "description":
      return `<div>${description} (<em><strong>${title}</strong></em> by ${authors})</div>`
    case "image":
      return `<div>${cachedImage}</div>`;
    default:
      return `<div><em><strong>${title}</strong></em> (${ISBN}) with layout <strong>${layout}</strong>${optionalShelfInfo}.</div>`;
  }
};

module.exports.book2 = book2;
