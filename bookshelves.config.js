module.exports = {
  markdownFiles: [
    './src/content/shelves/'
  ],
  masterShelf: [
    './src/content/books/'
  ],
  jsonFiles: [
  ],
  csvFiles: [
  ],
  useLocalInventory: 'auto', // auto|only|false
  // localInventoryFile: './src/content/csv/test.csv',
  localInventoryFileData: './src/_data/localInventory.json', 
  dataFile: './src/_data/booksOnShelves.json'
}