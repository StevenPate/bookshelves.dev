---
title: Building websites with JavaScript
subtitle: Building and deploying this site, where I both talk about things and test them out
tags: web development
---

This site is a work-in-progress, and this page is about the messiness of me learning modern Javascript after a few years away from the scripting part of Web development.

In thinking about how to build a site to encounter books [based on "shelf-like" arrangements](/no-books-but-on-shelves), I am realy captivated by the idea of starting with text, putting something *underneath* the abstraction of an application layer which, even in the [repository]({{ site.github }}), can be understood by a non-technical person. Semantically clear frontmatter and markdown files and a version history of what's changed seems cool. So I started from the premise of not fencing the content off in a database exactly. At the beginning, the only thing I knew like this was Jekyll.

But one day, I was poking around [Craig Mod's site](https://craigmod.com/). The source code revealed it was built with Hugo. Then I went down a deep rabbit-hole o exploring static site Generators and becoming excited about building something that was interesting but also something that people smarter than me could potentially improve. I had tried React. It seemed like a useful thing to learn for other applications but was honestly, as my Dad would say, "a lot of sugar for a dime."

When I found [11ty](https://11ty.dev), something clicked. I could stay very close to HTML and Markdown and Javascript. I can learn all kinds of other things and build in all kinds of other langauges.

Somewhere along the way I thought it would be a good idea to make this a time for me to learn Tailwind CSS. I thought if I just powered through a few iterations and projects then the speed advantage of a framework would obtain. I have always become absorbed in finicky stuff, especially with typography, and so I'm regretting this right now, as I feel hamstrung at times. So much has happened with CSS in the past ten years that I'm intimidated and excited at the same time by the options and what is happening right now. What I'm telling myself right now is that there are things happening right now which will make mastering new CSS paradigms at a deep level very productive in the near future.

So this site is built with love using [11ty](https://11ty.dev) and [Netlify]([11ty](https://netlify.com)) and will hopefully be changing and growing a lot. I am making it publi now even though I want to rewrite **all** of the code. I'm happy of what I've started, but it's written in  a way to get it functioning rather than making a maintainable source. I was learning a lot. 

Priorities for me as of now are 
* bringing accessibility up to a much higher standard
* cleaning up the API/scraping interactions
* applying a truly well-designed experience as I move on from Tailwind.