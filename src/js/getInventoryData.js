const { useLocalInventory } = require("../../bookshelves.config");

localInventoryFileData = require("../_data/localInventory.json");

const getLocalInventoryInfo = (thisISBN) => {
  if (!useLocalInventory) {
    return;
  }
  // console.log(`let's check local inventory for ${thisISBN}.`);
  const inventoryFound = localInventoryFileData.find(
    (item) => item.ISBN === thisISBN
  );
  if (!inventoryFound) {
    // console.log(`no inventory info for ${thisISBN}.`);
    return;
  }
  const { ISBN, ...inventoryInfo } = inventoryFound;
  return inventoryInfo;
};

// TODO add other inventory sources

const getInventoryData = (books) => {
  for (let i = 0; i < books.length; i++) {
    // console.log(`let's check inventory for ${books[i].ISBN}.`);
    books[i].inventoryInfo = getLocalInventoryInfo(books[i].ISBN);
  }
  return books;
};

module.exports.getInventoryData = getInventoryData;
