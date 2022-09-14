const { Isbn } = require("library-lib");

const checkISBN = (ISBN) => {
    try {
        const isbnToParse = ISBN.replace(/[^0-9]/g, "");
        const { isbn } = Isbn.parse(isbnToParse);
        return isbn;
    } catch (err) {
        console.log(`${ISBN} looks like a bad isbn.`);
        return { error: "Bad request" };
    }
};


module.exports.checkISBN = checkISBN;