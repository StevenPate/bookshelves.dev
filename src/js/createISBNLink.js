const site = require("../_data/site.json");
const commerce = require("../_data/commerce.json");
const ISBNLink = (thisBook, linkType) => {
  let linkForBook;
  if (linkType == "local") {
    linkType =
      thisBook.contexts == (null || "") ||
      typeof thisBook.contexts == "undefined"
        ? "purchase"
        : "local";
    if (linkType == "local") {
      linkForBook = `/${thisBook.ISBN}`;
    }
  }
  if (linkType == "purchase") {
    linkType = commerce.bookshoporgAffiliateID;
  }
  thisBook.conversionPath
    ? (linkType = thisBook.conversionPath)
    : (linkType =
        linkType == (null || "") || typeof linkType == "undefined"
          ? "local"
          : linkType);
  if (/^a\d+$/i.test(linkType)) {
    linkForBook = `${commerce.bookshoporgLink}${linkType.substring(1)}/${
      thisBook.ISBN
    }`;
  } else {
    if (
      linkType != ("local" || "purchase" || null || "") ||
      typeof linkType != "undefined"
    ) {
      let commercePath = commerce.conversions.find(
        (item) => item.pathName === linkType
      );
      if (commercePath != undefined) {
        const commercePathURLwithISBN = commercePath.pathURL.replace(
          "[ISBN]",
          thisBook.ISBN
        );
        linkForBook = commercePathURLwithISBN;
      }
    }
  }

  return linkForBook;
};

module.exports = ISBNLink;