const { getGoogle } = require("./src/js/_getData");

module.exports = {
    markdownFiles: ["./src/content/shelves/"],
    masterShelf: ["./src/content/books/"],
    jsonFiles: [],
    csvFiles: [],
    useLocalInventory: "auto", // auto|only|false
    localInventoryFile: './src/inv/test.csv',
    localInventoryFileData: "./src/_data/localInventory.json",
    dataFile: "./src/_data/booksOnShelves.json",
    usePlaceholderData: true,
    placeholderDataSource: "google",
    placeHolderImageSource: "amazonImage",
    bookFolders: ["./src/content/books/"], // files here are for individual books
    shelfFolders: ["./src/content/shelves/"], // files here are for shelves, with a books array in the front matter,
    booksDataFile: "./src/_data/books.json",
    shelvesDataFile: "./src/_data/shelves.json",
    default: {
        attribution: "Steven",
        categories: [],
        visible: true,
    }
};
