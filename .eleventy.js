
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const book = require("./src/js/book");

module.exports = function (eleventyConfig) {

  // book shortcode
  eleventyConfig.addNunjucksAsyncShortcode("book", book);

  // shelves collection
  eleventyConfig.addCollection("shelves", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/content/shelves/*.md")
  });
  
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(directoryOutputPlugin);

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
