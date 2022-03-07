
const createISBNLink = require("../js/createISBNLink");
const formatISBNContext = require("../js/formatISBNContext");
const MarkdownIt = require("markdown-it");
let md = new MarkdownIt();
const lf = new Intl.ListFormat('en');
const slugify = require("slugify");

const thisBook = (ISBNObject, thisShelf, linkType="purchase") => {

  let authorString = (Array.isArray(ISBNObject.fetchedData.author))
    ? lf.format(ISBNObject.fetchedData.author)
    : ISBNObject.fetchedData.author

  let thisBook = {
    ISBN: ISBNObject.ISBN,
    slug: slugify(ISBNObject.fetchedData.title, { lower: true, strict: true }),
    title: ISBNObject.fetchedData.title,
    subtitle: ISBNObject.fetchedData.subtitle,
    author: authorString,
    description: ISBNObject.fetchedData.description,
    descriptionCredit: null,
    categories: ISBNObject.fetchedData.categories,
    coverImage: ISBNObject.fetchedData.bookshopCoverImage,
  };

  // ISBNObject

  let contexts = [];

  if (ISBNObject.shelfData != (null || undefined)) {
    ISBNObject.shelfData.forEach((shelfObject) => {
      let shelfLink = `<a href="/${shelfObject.shelfID}/">${shelfObject.shelfTitle}</a>`;

      let shelfAttrribution = (shelfObject.bookData.descriptionCredit != null) 
        ? shelfObject.bookData.descriptionCredit
        : shelfObject.shelfAttribution
      //////// will add link at some point!

      let shelfLabel =
        shelfObject.bookData.shelfLabel != null
          ? shelfObject.bookData.shelfLabel
          : null;

      let context = {
        shelfLink: shelfLink,
        shelfLabel: shelfLabel,
        shelfAttribution: shelfAttrribution,
      };
      if (shelfObject.shelfID != thisBook.ISBN) {
        contexts.push(context);
      }

      thisBook.contexts = contexts;
    });

    let addAnyData = (entry) => {
      if (entry[1] != null) {
        let prop = entry[0];
        thisBook = {
          ...thisBook,
          [prop]: entry[1],
        };
      }
    };

    if (ISBNObject.masterShelf != null) {
      let priorityData = ISBNObject.shelfData.find(
        (item) => item.shelfPath === ISBNObject.masterShelf
      );
      Object.entries(priorityData.bookData).forEach((entry) => {
        addAnyData(entry);
      });
    }
    if (thisShelf != null) {
      let priorityData = ISBNObject.shelfData.find(
        (item) => item.shelfPath === thisShelf
      );
      Object.entries(priorityData.bookData).forEach((entry) => {
        addAnyData(entry);
      });
    }
  }
  if (thisBook.descriptionCredit == null) {
    if (thisBook.description == ISBNObject.fetchedData.description) {
      thisBook.descriptionCredit = "Publisher's Copy" 
    }
  }
  if (thisBook.descriptionCredit != null) {
    thisBook.description += ` (${thisBook.descriptionCredit})`;
  } 
  thisBook.description = md.render(thisBook.description);

  let ISBNLink = createISBNLink(thisBook, linkType);
  thisBook.link = ISBNLink;
  // console.log(thisBook);

  thisBook.formattedContext = formatISBNContext(thisBook, thisShelf);
  
  return thisBook;
};

module.exports = thisBook;