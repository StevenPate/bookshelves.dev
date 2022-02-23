---
title: Digital Garden
eleventyNavigation:
  key: Digital Garden
---

<section>
<ul>
{% for item in collections.posts %}
<li><a href="{{item.url}}">{{item.data.title}}</a></li>
{% endfor %}
</ul>
</section>