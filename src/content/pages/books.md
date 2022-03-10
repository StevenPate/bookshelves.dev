---
title: Books
eleventyNavigation:
  key: Books
---
Here are the books...

<section>
  <div class="grid grid-cols-3 gap-4 md:grid-cols-4">
  {% for book in booksOnShelves.books %}
  {% book book.ISBN, 'cover', 'local' %}
  {% endfor %}
  </div>
</section>