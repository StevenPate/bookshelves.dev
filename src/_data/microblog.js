
// this is where we will pull data from the micro.blog
// https://stevenpate.micro.blog/feed.json

const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  let url = "https://stevenpate.micro.blog/feed.json";

  /* This returns a promise */
  return EleventyFetch(url, {
    duration: "1s", // save for 1 second lol
    type: "json"    // we’ll parse JSON for you
  });
};