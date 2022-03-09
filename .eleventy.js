
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const book = require("./src/js/_book");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {

  // book shortcode
  eleventyConfig.addNunjucksAsyncShortcode("book", book);

  // shelves collection
  eleventyConfig.addCollection("shelves", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/content/shelves/*.md")
  });

  // readableDate andhtmlDateString via the eleventy-blog-starter
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
  });
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });
  
  eleventyConfig.setQuietMode(true);
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
