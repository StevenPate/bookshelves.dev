const findDataForISBN = require("../js/findDataForISBN");

async function ISBNObject(ISBN){
  let fetchedDataForISBN = await findDataForISBN(ISBN);
  const ISBNObject = {
    ISBN: ISBN,
    shelfData: null,
    fetchedData: fetchedDataForISBN,
  };
  return ISBNObject;
};

module.exports = ISBNObject;