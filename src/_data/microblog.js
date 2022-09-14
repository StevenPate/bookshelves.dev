const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  // https://developer.github.com/v3/repos/#get
  let json = await EleventyFetch("https://stevenpate.micro.blog/feed.json", {
    duration: "0s", // 1 day
    type: "json" // also supports "text" or "buffer"
  });

  // console.log(json.items);



  // "id": "http://stevenpate.micro.blog/2022/06/20/tonight-i-tweaked.html",
  // "title": "CSS is hard to tackle piecemeal",
  // "content_html": "<p>Tonight I tweaked the markup and fiddled with the tailwind classes  on <a href=\"https://bookshelves.dev\">bookshelves.dev</a> to get the featured items on the homepage to bother me less.</p>\n\n<p>Since they look like cards, I wanted the whole thing to be clickable. But wrapping the existing markup in an anchor tag of course messed with the colors and text-decoration, so I had to track down how to extend the tailwind.config. Then I wanted some subtle hover animation and finally feel better about that. I liked it enough to implement it for the card component layouts of the shelf and book shortcodes across the site. Along the way, I also eliminated a couple of things that were wonky at intermediate breakpoints.</p>\n\n<p>Overall I still feel really unhappy with the clunkiness of the visual design and the haphazard feeling of the markup and the chaos of tailwind classes. But it hurts me a little bit less.</p>\n\n<p>I sure wish I had time to go deep on the css from scratch. But there are other things I really want to be doing on the site right now. Fiddling with these little things is a luxury I don&rsquo;t often afford myself lately.</p>\n",
  // "date_published": "2022-06-20T21:58:54-07:00",
  // "url": "https://stevenpate.micro.blog/2022/06/20/tonight-i-tweaked.html",
  // "tags": ["bookshelves","web development"]

  return {
    // posts: json.items
    blog: json
  };
};
