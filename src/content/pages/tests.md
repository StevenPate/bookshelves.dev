---
title: tests
sectionClass: ""
---


{% for item in collections.booksOnShelf | limit(10) %}
<div class="p-8 m-4 border-4">
<p><strong>{{ item.google.title }}</p></strong>
<p>dateCreated: {{ item.dateCreated}}</p>
<p>dateModified: {{ item.dateCreated}}</p>
</div>
{% endfor %}


</div>








