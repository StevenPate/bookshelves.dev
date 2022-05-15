
// const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { book, shelf } = require("./src/js/_shortcodes");
const { category } = require("./src/js/_filters")
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const md = new markdownIt({
    html: true,
  });

module.exports = function (eleventyConfig) {

  // book shortcode
  eleventyConfig.addNunjucksAsyncShortcode("book", book);
  // shelf  shortcode
  eleventyConfig.addNunjucksAsyncShortcode("shelf", shelf);

  // shelves collection
  eleventyConfig.addCollection("shelves", function (collectionApi) {
    // return collectionApi.getFilteredByGlob("./src/content/shelves/*.md")
    const allShelves = collectionApi.getFilteredByGlob("./src/content/shelves/*.md");
    const filteredShelves = allShelves.filter(item => item.data.visible == true)
    return filteredShelves;
  });

  // eleventyConfig.addCollection('customDataCollection', customDataCollection);

// Create collection from _data/customData.js

eleventyConfig.addCollection("booksOnShelf", (collection) => {
  const allItems = collection.getAll()[0].data.booksOnShelves.books;
  return allItems
});

eleventyConfig.addCollection("kidsBooks", (collection) => {
  return category("kids").with
});

eleventyConfig.addCollection("nonKidsBooks", (collection) => {
  return category("kids").without
});

  

  // readableDate andhtmlDateString via the eleventy-blog-starter
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });
  
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  // eleventyConfig.setQuietMode(true);
  // eleventyConfig.addPlugin(directoryOutputPlugin);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPassthroughCopy("./src/images");

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
