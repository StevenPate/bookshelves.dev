---
title: Books
eleventyNavigation:
  key: Books
  order: 1
---
The books on this site are organized onto shelves, which is where they feel at home and can bump up with their friends. Why do I do it this way, and not and endless feed of books or "lists"? Good question! My thoughts about this are in a post called [No Books But On Shelves](/no-books-but-on-shelves/).

<section>
<div div="p-0">
{% for item in collections.shelves | reverse %}
{% shelf item.data.page.fileSlug, "card" %}
{% endfor %}
</div>
</section>


<h2>All Books</h2>
<div x-data="{ currentTab: 'clear'}" class="sm:px-6">
  <div class="flex flex-row space-x-4">
  <button @click="currentTab = 'non-kids'" class="p-2 transition duration-300 ease-in-out delay-150 border border-blue-200 hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:scale-110" :class="{ 'bg-blue-200' : currentTab === 'non-kids'}">Non-kids Books</button>
  <button @click="currentTab = 'kids'" class="p-2 transition duration-300 ease-in-out delay-150 border border-blue-200 hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:scale-110" :class="{ 'bg-blue-200' : currentTab === 'kids'}">Kids Books</button>
  <button @click="currentTab = 'clear'" class="p-2" :class="{ 'text-gray-100' : currentTab === 'clear'}">Clear</button>
  </div>
  <div class="p-2 border-2 border-gray-100 border-dotted">
  <section x-show="currentTab === 'non-kids'">
  <h3 class="mt-4">Non-Kids Books</h3>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
  {% for item in collections.nonKidsBooks %}
  {% book item.ISBN, 'small', 'local' %}
  {% endfor %}
  </div>
  </section>
  <section x-show="currentTab === 'kids'">
  <h3 class="mt-4">Kids Books</h3>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
  {% for item in collections.kidsBooks %}
  {% book item.ISBN, 'cover', 'local' %}
  {% endfor %}
  </div>
  </section>
  </div>
</div>