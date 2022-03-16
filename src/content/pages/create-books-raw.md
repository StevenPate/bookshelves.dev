---
eleventyComputed:
  title: "{{ book.google.title}}" 
layout: layouts/json.njk
tags: book
pagination:
    data: booksOnShelves.books
    size: 1
    alias: book
permalink: "/{{ book.ISBN }}.json"
---