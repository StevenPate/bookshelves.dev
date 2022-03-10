---
eleventyComputed:
  title: "{{ book.title}}" 
layout: layouts/book.njk
tags: book
pagination:
    data: booksOnShelves.books
    size: 1
    alias: book
permalink: "/{{ book.ISBN }}/"
---