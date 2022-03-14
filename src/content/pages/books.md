---
title: Books
eleventyNavigation:
  key: Books
---
<h2>Here are the books...</h2>

<section>
<h3>Non-Kids Books</h3>
<div class="grid grid-cols-2 gap-4">
{% for item in collections.nonKidsBooks %}
{% book item.ISBN, 'small', 'local' %}
{% endfor %}
</div>
</section>

<section>
<h3>Kids Books</h3>
<div class="grid grid-cols-2 gap-4">
{% for item in collections.kidsBooks %}
{% book item.ISBN, 'card', 'local' %}
{% endfor %}
</div>
</section>

<!-- <section>
  <div class="grid grid-cols-3 gap-4 md:grid-cols-4">
  {% for book in booksOnShelves.books %}
  {% book book.ISBN, 'cover', 'local' %}
  {% endfor %}
  </div>
</section> -->