---
sectionClass: ""
pagination:
    data: collections.blog
    size: 1
    alias: post
permalink: "blog/{{ post.title | slug }}/index.html"
layout: layouts/blogpost.njk
eleventyComputed:
  title: "{{ post.title }}"
---

{{post.content_html | safe}}