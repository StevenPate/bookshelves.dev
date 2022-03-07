const Cache = require("@11ty/eleventy-cache-assets");

const getIdentifiers = async (ISBN) => {
  try {
    let url = `https://api.bookish.tech/search?type=isbn&id=${ISBN}`; //*
    let bookishData = await Cache(url, {
      type: "json",
      duration: "10d",
    });

    const {
      isbn,
      lccn,
      oclc,
      openlibrary,
      goodreads,
      isbn13
    } = bookishData['results'];

    return {
      isbn,
      isbn13,
      lccn,
      oclc,
      openlibrary,
      goodreads
    }

  } catch (error) {
    console.error(error);
  }
}

// test("9780375868009");

module.exports = async function (ISBN) {
    const identifiers = await getIdentifiers(ISBN);
    // console.log(identifiers);
    return identifiers
    // return identifiers;
};