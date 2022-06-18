---
title: What this site does
subtitle: How should I handle dates on this site?
tags:
  - about
dateCreated: 2022-06-17
dateModified: 2022-06-17
---

This is a site meant to be a working demo of my ideas about facilitating the curation of books online to create a website where it is enjoyable to encounter new books.

I want this system to be easy to use. Add a text file with an ISBN in it, you've got a book. Add a group of ISBNS? You've got a shelf. Add descriptions to individual books or to shelves. As long or short as you like. If you don't have an image ready, a cover image will be automatically pulled from data available on the web. Same goes for title, author name, a publisher's description, and other basic data. The idea is that those are just placeholders. To read some more about all of this, you might read the [No Books but on Shelves](/no-books-but-on-shelves) post.

The site uses a powerful but simple static site generator called [11ty](https://11ty.dev), which I very much love, to generate HTML pages using templates. 

Basically the idea is to take a collection of markdown files, a .json file, or the data from an API. Any ISBN found will result in individual book pages, and (where grouped by json or markdown) "shelf" pages in a pleasing way. It turns text or json into a website. 

The long-term goal is to start seeing books which appear on multiple shelves, and those other shelf links being jumping off points to other books you might be interested in. An example that is already on the site is this {% book "9780295745336", "text::this book", "local" %}, which I have included on two shelves. If this system had all my books and all the shelves I could imagine, there would be an interesting set of connections discoverable here. To say nothing if the staff picks or other showcases of a good indie bookstore's curatorial prowess were stocking the shelves.

It's designed to optionally display a link to find the book (via a purchase path, library link, etc.), which is configurable globally or for individual books and shelves. It can also optionally check for an ISBN in an on-hand inventory file and then use that information to display different inventory statuses and/or conversion paths based on that inventory information.

Finally, in addition to building the site, it also compiles ALL the ISBNs it finds in the various inputs (JSON data, markdown files, API data), and creates a master library.json for all the books. This can be shared via a community of readers and book enthusiasts, compared with individuals' TBR lists, etc. I would love for this standard to take-off, and help to build a decentralized indieweb version of goodreads.
