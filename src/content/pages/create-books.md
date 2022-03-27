---
eleventyComputed:
  title: "{{ book.google.title}}" 
layout: layouts/book.njk
tags: book
pagination:
    data: booksOnShelves.books
    size: 1
    alias: book
    addAllPagesToCollections: true
permalink: "/{{ book.ISBN }}/"
---