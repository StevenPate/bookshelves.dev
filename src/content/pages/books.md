---
title: Books
eleventyNavigation:
  key: Books
---

<div x-data="{ currentTab: 'non-kids' }">
  <button @click="currentTab = 'non-kids'" class="p-2" :class="{ 'bg-blue-200' : currentTab === 'non-kids'}">Non-kids Books</button>
  <button @click="currentTab = 'kids'" class="p-2" :class="{ 'bg-blue-200' : currentTab === 'kids'}">Kids Books</button>
  <button @click="currentTab = 'all'" class="p-2" :class="{ 'bg-blue-200' : currentTab === 'all'}">All Books</button>
  <div class="p-2 border-2 border-gray-100 border-dotted">
  <section x-show="currentTab === 'non-kids'">
  <h3 class="mt-4">Non-Kids Books</h3>
  <div class="grid grid-cols-2 gap-4">
  {% for item in collections.nonKidsBooks %}
  {% book item.ISBN, 'small', 'local' %}
  {% endfor %}
  </div>
  </section>
  <section x-show="currentTab === 'kids'">
  <h3 class="mt-4">Kids Books</h3>
  <div class="grid grid-cols-3 gap-4">
  {% for item in collections.kidsBooks %}
  {% book item.ISBN, 'cover', 'local' %}
  {% endfor %}
  </div>
  </section>
  <section x-show="currentTab === 'all'">
  <h3 class="mt-4">All Books</h3>
  <div class="grid grid-cols-2 gap-4">
  {% for item in booksOnShelves.books %}
  {% book item.ISBN, 'small', 'local' %}
  {% endfor %}
  </div>
  </section>
  </div>
</div>

<!-- <h2>Here are the books...</h2> -->

<!-- 

 -->

<!-- <section>
  <div class="grid grid-cols-3 gap-4 md:grid-cols-4">
  {% for book in booksOnShelves.books %}
  {% book book.ISBN, 'cover', 'local' %}
  {% endfor %}
  </div>
</section> -->