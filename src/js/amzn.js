const EleventyFetch = require("@11ty/eleventy-fetch");
const cacheImage = require("./cacheImage");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({
  html: true,
});
const { Isbn } = require("library-lib");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

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
  console.log(cachedCoverUrl);
  return { coverUrl, cachedCoverUrl };
};

let ISBN = "9780295990620";

amazonImage = getAmazon(ISBN);

  