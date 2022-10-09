const EleventyFetch = require("@11ty/eleventy-fetch");
const cacheImage = require("./cacheImage");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({
    html: true,
});
const { Isbn } = require("library-lib");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const getInventory = async (thisISBN) => {
    const bookshelves = require("../../bookshelves.config");
    const localInventory = require("../_data/localInventory.json");
    if (!bookshelves.useLocalInventory) {
        return;
    }
    // console.log(`let's check local inventory for ${ISBN}.`)
    const inventoryFound = localInventory.find(
        (item) => item.ISBN === thisISBN
    );
    // console.log(inventoryFound)
    if (!inventoryFound) {
        return;
    }
    const { ISBN, ...inventoryInfo } = inventoryFound;
    return inventoryInfo;
};

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

// const getIdentifiers = async (ISBN) => {
//     try {
//         let url = `https://api.bookish.tech/search?type=isbn&id=${ISBN}`; //*
//         let bookishData = await EleventyFetch(url, {
//             type: "json",
//             duration: "10d",
//             directory: "_cache",
//         });

//         const { isbn, lccn, oclc, openlibrary, goodreads, isbn13 } =
//             bookishData["results"];

//         return {
//             isbn,
//             isbn13,
//             lccn,
//             oclc,
//             openlibrary,
//             goodreads,
//         };
//     } catch (error) {
//         console.error(error);
//     }
// };

const getGoogle = async (ISBN) => {
    try {
        let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`;
        let googleData = await EleventyFetch(url, {
            type: "json",
            duration: "10d",
            directory: "_cache",
        });

        if (!googleData.items) {
            console.log(`No googleapis data found for ${ISBN}.`);
            return;
        }

        let {
            title,
            subtitle,
            authors,
            publisher,
            description,
            categories,
            publishedDate,
            pageCount,
        } = googleData.items[0].volumeInfo;

        description += ` (Publisher's Description)`;
        description = md.render(description);

        let authorSortName;
        if (authors != undefined && authors.length != 0) {
            let firstAuthorName = authors[0].split(" ");
            let firstAuthorLastName = firstAuthorName.reverse();
            authorSortName = firstAuthorLastName[0];
        }

        return {
            title,
            subtitle,
            authors,
            authorSortName,
            publisher,
            description,
            categories,
            publishedDate,
            pageCount,
        };
    } catch (error) {
        console.error(error);
    }
};

const getOpenLibrary = async (ISBN) => {
    try {
        let url = `https://openlibrary.org/isbn/${ISBN}.json`;
        let openLibraryData = await EleventyFetch(url, {
            type: "json",
            duration: "10d",
            directory: "_cache",
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
            publish_places,
        } = openLibraryData;

        if (!openLibraryData) {
            console.log("no open library data");
            return;
        }

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
            publish_places,
        };
    } catch (error) {
        if (error.name === "AbortError") {
            console.log("OpenLibrary request was aborted");
        }
    }
};

// const getBookshopOrg = async (ISBN) => {
//     try {
//         // let cover = `https://images-us.bookshop.org/ingram/${ISBN}.jpg?height=1000&`;
//         let cover = `https://bookshelves.dev/images/web/RBN00mc_BU-300.webp`;

//         try {
//             // TODO do error handling and fallbacks
//             const response = await fetch(cover);
//             if (response.status == "404") {
                
//                 cover = `404`;
//             }
//         } catch (err) {
//             console.log(`getBookshopOrg has a problem with ${ISBN} .`);
//             console.log(err);
//         }

//         let cachedCover = await cacheImage(
//             // "https://placeimg.com/264/400/nature",
//             cover,
//             "book-cover not-prose my-0 transition duration-300 ease-in-out delay-50 border border-gray-100 hover:bg-white shadow hover:shadow-xl hover:-translate-y-1 hover:scale-110 max-w-96 h-auto",
//             ISBN
//         );
//         return { cover, cachedCover };
//     } catch (error) {
//         console.error(`Couldn't find the ${ISBN} image on bookshop.org (404).`);
//         // console.error(error);
//     }
// };

const getAmazon = async (ISBN) => {
  let coverUrl;
  try {
    let amznURL = `https://www.amazon.com/gp/search/ref=sr_adv_b/?search-alias=stripbooks&unfiltered=1&field-isbn=${ISBN}&sort=relevanceexprank`;

    const amznData = await EleventyFetch(amznURL, {
      type: "text",
      duration: "100d", //lol
      directory: "_cache",
    });
    const amznHTML = cheerio.load(amznData);
    const amznImages = amznHTML("img.s-image").attr("srcset");
    if (amznImages == null) {
      console.log(`No amznImages data found for ${ISBN} at ${amznURL}.`);
      return;
    }

    function parseSrcset(srcset) {
      if (!srcset) return null;
      return srcset
        .split(", ")
        .map((d) => d.split(" "))
        .reduce((p, c) => {
          if (c.length !== 2) {
            // throw new Error("Error parsing srcset.");
            return;
          }
          p[c[1]] = c[0];
          return p;
        }, {});
    }
    const parsedAmznImages = parseSrcset(amznImages);

    if (parsedAmznImages == null) {
      console.log(`No parsedAmznImages data found for ${ISBN} at ${amznURL}.`);
      return;
    }

    let sortedAmznImages = [];
    Object.keys(parsedAmznImages)
      .sort()
      .reverse()
      .forEach((key) => {
        sortedAmznImages.push({
          size: key,
          URL: parsedAmznImages[key],
        });
      });
    coverUrl = sortedAmznImages[0].URL;

  } catch (err) {
    console.log(`getAmazon has a problem with ${ISBN} .`);
    console.log(err);
  }
  let cachedCoverUrl;
  if (coverUrl != null) {
    cachedCoverUrl = await cacheImage(
      coverUrl,
      "book-cover not-prose my-0 transition duration-300 ease-in-out delay-50 border border-gray-100 hover:bg-white shadow hover:shadow-xl hover:-translate-y-1 hover:scale-110",
      ISBN
    );
  }

  return { coverUrl, cachedCoverUrl };
};

const getLibro = async (ISBN) => {
    try {
        let coverUrl = `https://covers.libro.fm/${ISBN}_400.jpg#`;

        try {
            // TODO do error handling and fallbacks
            const response = await fetch(coverUrl);
            if (response.status == "404") {
                console.warn(`Couldn't find the ${ISBN} image on libro.fm`);
                cover = `404`;
            }
        } catch (err) {
            console.log(`getLibro has a problem with ${ISBN} .`);
            console.log(err);
        }
        let cachedCoverUrl = await cacheImage(
            coverUrl,
            "book-cover not-prose my-0 transition duration-300 ease-in-out delay-50 border border-gray-100 hover:bg-white shadow hover:shadow-xl hover:-translate-y-1 hover:scale-110",
            ISBN
        );

        const libroURL = `https://libro.fm/audiobooks/${ISBN}`;
        const libroData = await EleventyFetch(libroURL, {
            type: "text",
            duration: "10d",
            directory: "_cache",
        });
        const libroHTML = cheerio.load(libroData);
        let publisherEl = libroHTML("*[itemprop = 'publisher']").get(0);
        let publisher = libroHTML(publisherEl).text().trim();

        let narratorEl = libroHTML("*[class = 'audiobook-information__section']")
            .children("a")
            .get(0);
        let narrator = libroHTML(narratorEl).text().trim();
        return { narrator, publisher, image:{coverUrl, cachedCoverUrl} };
    } catch (error) {
        console.error(error);
    }
};

const getAllData = async (books) => {
    for (let i = 0; i < books.length; i++) {
        // use promise.all or something better here
        // identifiers = await getIdentifiers(books[i].ISBN).then(
        //     (value) => (books[i].identifiers = value)
        // );
        google = await getGoogle(books[i].ISBN).then(
            (value) => (books[i].google = value)
        );
        openlibrary = await getOpenLibrary(books[i].ISBN).then(
            (value) => (books[i].openlibrary = value)
        );
        if (books[i].audioISBN) {
            librofm = await getLibro(books[i].audioISBN)
            .then((value) => (books[i].librofm = value)
            );
            books[i].image = books[i].librofm.image
        };
        // bookshopOrg = await getBookshopOrg(books[i].ISBN).then(
        //     (value) => (books[i].bookshopOrg = value)
        // );
        coverImage = await getAmazon(books[i].ISBN).then(
            (value) => (books[i].image = value)
        );
    
        inventoryInfo = await getInventory(books[i].ISBN).then(
            (value) => (books[i].inventoryInfo = value)
        );
    }
    return books;
};

module.exports.getInventory = getInventory;
module.exports.checkISBN = checkISBN;
// module.exports.getIdentifiers = getIdentifiers;
module.exports.getGoogle = getGoogle;
module.exports.getOpenLibrary = getOpenLibrary;
// module.exports.getBookshopOrg = getBookshopOrg;
module.exports.getLibro = getLibro;
module.exports.getAllData = getAllData;
