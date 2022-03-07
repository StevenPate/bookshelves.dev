const contexts = ISBNObject => {

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
      if (shelfObject.shelfID != ISBNObject.ISBN) {
        contexts.push(context);
      }

      return contexts;
    });
  }

}

module.exports = contexts;