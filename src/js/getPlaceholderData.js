const EleventyFetch = require("@11ty/eleventy-fetch");
const cacheImage = require("./cacheImage");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({
  html: true,
});
const { Isbn } = require("library-lib");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

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
    return { narrator, publisher, image: { coverUrl, cachedCoverUrl } };
  } catch (error) {
    console.error(error);
  }
};

const getAmazon = async (ISBN) => {
  let coverUrl;
  try {
    let amznURL = `https://www.amazon.com/gp/search/ref=sr_adv_b/?search-alias=stripbooks&unfiltered=1&field-isbn=${ISBN}&sort=relevanceexprank`;

    const amznData = await EleventyFetch(amznURL, {
      type: "text",
      duration: "10d",
      directory: "_cache",
    });
    const amznHTML = cheerio.load(amznData);
    const amznImages = amznHTML(".s-image").attr("srcset");
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
    console.log(`getAmazon has a problem with ${ISBN}.`);
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

// const getInventoryInfo = (ISBN) => {
//   // TODO add inventory info
//   let inventoryInfo = {
//     onHand: 0,
//   };
//   console.log(inventoryInfo);
//   return inventoryInfo;
// }

const getAllPlaceholderData = async (books) => {
  for (let i = 0; i < books.length; i++) {
    books[i].placeholderData = {};
    google = await getGoogle(books[i].ISBN).then(
      (value) => (books[i].placeholderData.google = value)
    );
    for (let j = 0; j < books[i].shelves.length; j++) {
      if (books[i].shelves[j].audioISBN) {
        libro = await getLibro(books[i].shelves[j].audioISBN).then(
          (value) => (books[i].placeholderData.libro = value)
        );
      }
    }
    amazonImage = await getAmazon(books[i].ISBN).then(
      (value) => (books[i].placeholderData.amazonImage = value)
    );
    openlibrary = await getOpenLibrary(books[i].ISBN).then(
        (value) => (books[i].placeholderData.openlibrary = value)
    );
    // books[i].inventoryInfo =  getInventoryInfo(books[i].ISBN);
  }

  return books;
};

module.exports.getGoogle = getGoogle;
module.exports.getAllPlaceholderData = getAllPlaceholderData;
