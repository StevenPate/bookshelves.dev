---
title: tests
sectionClass: ""
---


{% for item in collections.booksOnShelf | limit(10) %}
<div class="p-8 border-4">
<p><strong>{{ item.google.title }}</p></strong>
<p>dateCreated: {{ item.dateCreated}}</p>
<p>dateModified: {{ item.dateCreated}}</p>
</div>
{% endfor %}

this doesn't work if you use the wrong ISBN.
{% book2 ISBN="9780811228787", layout="title" %}
{% book2 ISBN="9780811228787", layout="title-full", shelf="books-i-have-enjoyed-in-2022" %}
{% book2 ISBN="9780811228787", layout="description", shelf="books-i-have-enjoyed-in-2022" %}
{% book2 ISBN="9780811228787", layout="image", shelf="books-i-have-enjoyed-in-2022" %}

</div>








