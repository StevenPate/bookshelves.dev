const Cache = require("@11ty/eleventy-cache-assets");
const cacheImage = require("../js/cacheImage");

const ISBNtoBookData = async (ISBN) => {
  let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`; //*
  let data = await Cache(url, {
    type: "json",
    duration: "10d",
  });
  if (data == null || data.items < 1) return;
  if (data.items == undefined) {
    console.log(
      `>>>>>>>Google API request for ${ISBN} returned no data (undefined).`
    );
    return;
  }
  // this is all specific only to the Google Books API
  const fetchedBookData = {
    ISBN: ISBN,
    title: data.items[0].volumeInfo.title || null,
    subtitle: data.items[0].volumeInfo.subtitle || null,
    author: data.items[0].volumeInfo.authors || null,
    publisher: data.items[0].volumeInfo.publisher || null,
    description: data.items[0].volumeInfo.description || null,
    descriptionCredit: "Publisher's Copy",
    categories: data.items[0].volumeInfo.categories || null,
    publishedDate: data.items[0].volumeInfo.publishedDate || null,
    coverImage:  null, //data.items[0].volumeInfo.imageLinks.thumbnail ||
    fullData: [{ GoogleBooks: data }],
  };

  let bookshopCoverImageURL = `https://images-us.bookshop.org/ingram/${ISBN}.jpg?height=1000&`;
  let cachedImage = await cacheImage(bookshopCoverImageURL, "book-cover", ISBN);
  fetchedBookData.bookshopCoverImage = cachedImage;
  return fetchedBookData;
};

module.exports = async function (ISBNs) {
  if (Array.isArray(ISBNs)) {
    let bookDataArray = [];
    for (const ISBN of ISBNs) {
      let bookDataObject = await ISBNtoBookData(ISBN);
      // let bookDataObject = tempData(ISBN);
      bookDataArray.push(bookDataObject);
    }
    return bookDataArray;
  } else {
    let bookData = await ISBNtoBookData(ISBNs);
    // let bookDataObject = tempData(ISBNs);
    return bookData;
  }
};
