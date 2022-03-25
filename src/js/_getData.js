const EleventyFetch = require("@11ty/eleventy-fetch");
const cacheImage = require("./cacheImage");
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
  html: true
});
const { Isbn } = require("library-lib");
const fetch = require('node-fetch');
const cheerio = require("cheerio");

const checkISBN = ISBN => {
  try {
    const isbnToParse = ISBN.replace(/[^0-9]/g, '');
    const { isbn } = Isbn.parse(isbnToParse);
    return isbn;
  } catch (err) {
    console.log(
      `${ISBN} looks like a bad isbn.`
    );
    return { error: "Bad request" };
  }
};

const getIdentifiers = async (ISBN) => {

  try {
    let url = `https://api.bookish.tech/search?type=isbn&id=${ISBN}`; //*
    let bookishData = await EleventyFetch(url, {
      type: "json",
      duration: "10d",
      directory: "_cache"
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
    let googleData = await EleventyFetch(url, {
      type: "json",
      duration: "10d",
      directory: "_cache"
    });

    if (!googleData.items) {
      console.log(`No googleData items found for ${ISBN}.`)
      return
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

    description += ` (Publisher's Description)`
    description = md.render(description);

    return {
      title,
      subtitle,
      authors,
      publisher,
      description,
      categories,
      publishedDate,
      pageCount,
    }

  } catch (error) {
    console.error(error);
  }
}

const getOpenLibrary = async (ISBN) => {

  try {
    let url = `https://openlibrary.org/isbn/${ISBN}.json`;
    let openLibraryData = await EleventyFetch(url, {
      type: "json",
      duration: "10d",
      directory: "_cache"
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

    if (!openLibraryData) {
      console.log('no open library data');
      return
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
      publish_places
    }

  } catch (error) {
		if (error.name === 'AbortError') {
			console.log('OpenLibrary request was aborted');
		}
	}
}

const getBookshopOrg = async (ISBN) => {

  try {
    let cover = `https://images-us.bookshop.org/ingram/${ISBN}.jpg?height=1000&`;

    try {
      // TODO do error handling and fallbacks 
      const response = await fetch(cover);
      if (response.status == "404") {
        console.warn(`Couldn't find the ${ISBN} image on bookshop.org`)
        cover = `https://placeimg.com/264/400/nature`
      }
    } catch (err) {
      console.log(`getBookshopOrg has a problem with ${ISBN} .`)
      console.log(err);
    }

    let cachedCover = await cacheImage(cover, "book-cover not-prose my-0 transition duration-300 ease-in-out delay-50 border border-gray-100 hover:bg-white shadow hover:shadow-xl hover:-translate-y-1 hover:scale-110", ISBN);
    return { cover, cachedCover }
  } catch (error) {
    console.error(error);
  }


}

const getAmazon = async (ISBN) => {
  let coverUrl
  try {   
    let amznURL = `https://www.amazon.com/gp/search/ref=sr_adv_b/?search-alias=stripbooks&unfiltered=1&field-isbn=${ISBN}&sort=relevanceexprank`
    // let amznURL = `https://www.amazon.ca/gp/search/ref=sr_adv_b/?search-alias=stripbooks&unfiltered=1&field-isbn=${ISBN}&sort=relevanceexprank`
    // let amznURL = `https://www.amazon.com/s?rh=p_66:${ISBN}`
    // TODO do error handling and fallbacks 


// headers = {
//     'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
//     'referer': 'https://google.com',
//     }
// res = requests.get('https://www.amazon.com/Automate-Boring-Stuff-Python-Programming/dp/1593275994', headers=headers)
// res.raise_for_status()

    // const response = await fetch(amznURL);
    // console.log(ISBN, response.status)
    // if (response.status == "404") {
    //   console.warn(`Couldn't find  ${ISBN} image on amazon`)
    //   coverUrl = `https://placeimg.com/264/400/nature`
    // }

    const amznData = await EleventyFetch(amznURL, {
      type: "text",
      duration: "10d",
      directory: "_cache"
    });
    const amznHTML = cheerio.load(amznData);
    const amznImages = amznHTML('.s-image').attr("srcset");
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
    let sortedAmznImages = []
    Object.keys(parsedAmznImages)
      .sort()
      .reverse()
      .forEach(key => {
        // console.log(key)
        sortedAmznImages.push( {
        'size':key, 
        'URL':parsedAmznImages[key]
        })
      })
    coverUrl = sortedAmznImages[0].URL
  } catch (err) {
    console.log(`getAmazon has a problem with ${ISBN} .`)
    console.log(err);
  }
  let cachedCoverUrl = await cacheImage(coverUrl, "book-cover not-prose my-0 transition duration-300 ease-in-out delay-50 border border-gray-100 hover:bg-white shadow hover:shadow-xl hover:-translate-y-1 hover:scale-110", ISBN);
  return { coverUrl, cachedCoverUrl }
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
    coverImage = await getAmazon(books[i].ISBN)
    .then(value => books[i].image = value)
  }
  return books;
}

module.exports.checkISBN = checkISBN;
module.exports.getIdentifiers = getIdentifiers;
module.exports.getGoogle = getGoogle;
module.exports.getOpenLibrary = getOpenLibrary;
module.exports.getBookshopOrg = getBookshopOrg;
module.exports.getAllData = getAllData;