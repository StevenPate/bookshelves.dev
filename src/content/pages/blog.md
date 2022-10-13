---
title: Bookshelves.dev microblog
subtitle: Posts
---
{% for post in collections.blog %}
<div><a href="/blog/{{ post.title | slug }}/">{{ post.title }}</a> <span class="text-sm text-gray-400">{{ post.date_published | dateString }}</span></div>
{% endfor %}