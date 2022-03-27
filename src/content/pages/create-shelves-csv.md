---
eleventyComputed:
  title: "{{title}}" 
layout: layouts/csv.njk
tags: shelf
pagination:
    data: booksOnShelves.shelves
    size: 1
    alias: shelf
permalink: "/{{ shelf.shelfID }}.csv"
---