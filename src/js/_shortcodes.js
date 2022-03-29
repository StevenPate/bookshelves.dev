const { buildBook, buildLink, buildShelf } = require("./_buildBookshelves");
const { layoutBook, layoutShelf } = require("./_layouts");
const { checkISBN, getAllData } = require("./_getData");
// const { logMissing } = require("./_missingISBNs")
const booksOnShelves = require("../_data/booksOnShelves.json");

book = async (
  inputISBN,
  bookDisplayFormat,
  bookLink = "external",
  thisShelf
) => {
  const ISBN = checkISBN(inputISBN);
  if (ISBN.error) {
    return;
  }

  let { id, details, contexts } = buildBook(ISBN, thisShelf);
  if (!details) {
    console.log(`${ISBN} was missing details. Getting some now.`);
    const missingISBN = await getAllData([{ ISBN: id, shelves: [] }]);
    let missingBook = buildBook(ISBN, null, missingISBN[0]);
    details = missingBook.details;
    // logMissingISBN({ id, details});
  }

  bookLink = ((details.inventoryInfo != null) && (details.inventoryInfo.useLocalInventory != "false"))
    ? 'purchase::inventory'
    : bookLink

  let { link, linkText } = buildLink(
    id,
    bookLink,
    details.conversionPath,
    details.isbn10,
  );

  details.link = bookLink == "local" ? `/${id}` : link;
  details.linkText = bookLink == "local" ? `View book page→` : linkText;

  return layoutBook(id, bookDisplayFormat, details, contexts);
};

shelf = async (
  shelfID,
  shelfDisplayFormat = "cover", //probly change the default here
  bookLink = "external"
) => {
  const { shelfItems, ...shelfData } = booksOnShelves.shelves.find(
    (element) => element.shelfID == shelfID
  );
  let bookDisplayFormat = shelfDisplayFormat; // elaborate
  const promises = shelfItems.map(async (shelfItem) => {
    // TODO: not if displayType is shelfCard
    const shelfBook = await book(
      shelfItem,
      bookDisplayFormat,
      bookLink,
      shelfID
    );
    return shelfBook;
  });

  const shelfBooks = await Promise.all(promises);
  const renderedShelf = layoutShelf(
    shelfID,
    shelfBooks,
    shelfData,
    bookDisplayFormat,
    bookLink
  );

  return renderedShelf;
  // return shelfBooks.join('');
};

module.exports.book = book;
module.exports.shelf = shelf;
