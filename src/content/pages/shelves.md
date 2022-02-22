---
title: Shelves
eleventyNavigation:
  key: Shelves
---
Shelves go here.

<section>
<ul>
{% for item in collections.shelves %}
<li><a href="{{item.url}}">{{item.data.title}}</a></li>
{% endfor %}
</ul>
</section>