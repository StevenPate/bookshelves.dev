
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  
  // shelves
  eleventyConfig.addCollection("shelves", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/content/shelves/*.md")
  });
  

  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(directoryOutputPlugin);

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
