---
title: Digital Garden
subtitle: Like a blog, but the posts are never "done". [What is a Digital Garden?](/digital-gardens/)
eleventyNavigation:
  key: Digital Garden
  order: 2
---

<section>
<ul>
{% for item in collections.posts %}
<li><a href="{{item.url}}">{{item.data.title}}</a></li>
{% endfor %}
</ul>
</section>