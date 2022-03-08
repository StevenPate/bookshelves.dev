// adds a consolidated function call for easier use in multiple places.

const Cache = require("@11ty/eleventy-cache-assets");
const cacheImage = require("./cacheImage");

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

const getGoogle = async (ISBN) => {

  try {
    let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`;
    let googleData = await Cache(url, {
      type: "json",
      duration: "10d",
    });

    const {
      title,
      subtitle,
      authors,
      publisher,
      description,
      categories,
      publishedDate,
    } = googleData.items[0].volumeInfo;

    return {
      title,
      subtitle,
      authors,
      publisher,
      description,
      categories,
      publishedDate,
    }

  } catch (error) {
    console.error(error);
  }
}

const getOpenLibrary = async (ISBN) => {
  try {
    let url = `https://openlibrary.org/isbn/${ISBN}.json`;
    let openLibraryData = await Cache(url, {
      type: "json",
      duration: "10d",
    });

    const {
      subjects,
      identifiers,
      classifications,
      translated_from,
      contributors,
      translation_of,
      lc_classifications,
      first_sentence,
      pagination,
      copyright_date,
      publish_places
    } = openLibraryData;

    return {
      subjects,
      identifiers,
      classifications,
      translated_from,
      contributors,
      translation_of,
      lc_classifications,
      first_sentence,
      pagination,
      copyright_date,
      publish_places
    }

  } catch (error) {
    console.error(error);
  }
}

const getBookshopOrg = async (ISBN) => {
  // console.log(`we're going to get the bookshop.org data for ${ISBN} now.`)
  let cover = `https://images-us.bookshop.org/ingram/${ISBN}.jpg?height=1000&`;
  let cachedCover = await cacheImage(cover, "book-cover", ISBN);
  return { cover, cachedCover }
}

const getAllData = async (books) => {
  for (let i = 0; i < books.length; i++) {  // use promise.all or something better here
    identifiers = await getIdentifiers(books[i].ISBN)
    .then(value => books[i].identifiers = value)
    google = await getGoogle(books[i].ISBN)
    .then(value => books[i].google = value)
    openlibrary = await getOpenLibrary(books[i].ISBN)
    .then(value => books[i].openlibrary = value)
    bookshopOrg = await getBookshopOrg(books[i].ISBN)
    .then(value => books[i].bookshopOrg = value)
  }
  return books;
}

module.exports.getIdentifiers = getIdentifiers;
module.exports.getGoogle = getGoogle;
module.exports.getOpenLibrary = getOpenLibrary;
module.exports.getBookshopOrg = getBookshopOrg;
module.exports.getAllData = getAllData;