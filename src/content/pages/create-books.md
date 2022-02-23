---
eleventyComputed:
  title: "{{ book.fetchedData.title}}" 
layout: layouts/book.njk
tags: book
pagination:
    data: ISBNsOnShelves
    size: 1
    alias: book
permalink: "/{{ book.fetchedData.ISBN }}/"
---