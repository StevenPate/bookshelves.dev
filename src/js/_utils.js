const booksOnShelves = require("../_data/booksOnShelves.json");

// this code is embarassing. fix it.
const breakoutByParam = (shelfID, shelfDisplayFormatParam) => {
    let param = true;
    if (/^[no-]/.test(shelfDisplayFormatParam)) {
        param = false;
        shelfDisplayFormatParam = shelfDisplayFormatParam.slice(3);
    }
    const { shelfItems } = booksOnShelves.shelves.find(
        (element) => element.shelfID == shelfID
    );

    const itemsForFiltering = [];

    const getThisShelfEntry = (thisISBN, shelfID) => {
        const bookEntry = booksOnShelves.books.find(
            (element) => element.ISBN == thisISBN
        );
        const thisShelf = bookEntry.shelves.find(
            (element) => element.shelf == shelfID
        );
        itemsForFiltering.push({ ISBN: thisISBN, shelfEntry: thisShelf });
    };
    shelfItems.forEach((item) => {
        getThisShelfEntry(item, shelfID);
    });
    const noDescriptions = [];
    const withDescriptions = [];
    itemsForFiltering.forEach((element) => {
        if (
            element.shelfEntry.details.hasOwnProperty(shelfDisplayFormatParam)
        ) {
            // console.log(element);
            withDescriptions.push(element.ISBN);
        } else {
            noDescriptions.push(element.ISBN);
        }
    });

    return param === true ? withDescriptions : noDescriptions;
};

module.exports.breakoutByParam = breakoutByParam;
