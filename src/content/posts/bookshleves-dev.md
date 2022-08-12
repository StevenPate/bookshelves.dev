---
title: What this site does
subtitle: Here's where I try and boil down how this site is meant to work
tags:
  - about
dateCreated: 2022-06-17
dateModified: 2022-08-12
---

This is a site meant to be a playground and working demo for some ideas about facilitating the curation of books online to create a website where it is enjoyable to encounter new books. One could use it to showcase a book collection, keep track of reading, share books and lists and reviews with others, or write about books one wants to promote or sel.

The system is simple. Add a text file with an ISBN, and you have a book. Add a list of books (multiple ISBNs) and you have a shelf. If you don't enter details (title, author, description, image, etc.), it will grab that from the web. Then it will spit out a website for those books and shelves.

## How it works
Bookshelves.dev takes either markdown files that have ISBNs in the front matter, JSON data of book lists in the json format, or API data, and turn those into collections of books that are nice to look through using a static site generator which I love called [11ty](https://11ty.dev). If placeholder content is turned on, it will scrape google API (and elsewhere) for book data, all of which can be superseded by entered content. If you want a conversion button, you can set that up globally, per collection/shelf, or per title. The conversion path can be configured to whatever. If you have a record of books on hand (a local inventory) in a json or csv format, you can display that on-hand inventory status or use it to modify the conversion path.


## What makes it interesting to me
The long-term goal is to start seeing books which appear on multiple shelves, and those other shelf links being jumping off points to other books you might be interested in. An example that is already on the site is this {% book "9780295745336", "text::this book", "local" %}, which I have included on two shelves. If this system had all my books and all the shelves I could imagine, there would be an interesting set of connections discoverable here. To say nothing if the staff picks or other showcases of a good indie bookstore's curatorial prowess were stocking the shelves. To read some more about all of this, you might read the [No Books but on Shelves](/no-books-but-on-shelves) post.

Finally, in addition to building the site, it also compiles ALL the ISBNs it finds in the various inputs (JSON data, markdown files, API data), and creates a master library.json for all the books.  [Tom Critchlow and others](https://tomcritchlow.com/2020/04/15/library-json/) have laid a lot of groundwork for this idea: such a format can be shared via a community of readers and book enthusiasts, compared with individuals' TBR lists, etc. I would love for this standard to take-off, and help in some way to build a decentralized indieweb version of goodreads.