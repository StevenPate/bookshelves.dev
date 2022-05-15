---
title: tests
sectionClass: ""
---

<div class="my-16 prose">
<h2 class="">Just ISBN</h2>
{% book '9780374157357' %}
</div>
<div class="my-16 prose">
<h2>texlinks</h2>
<h3>text::a string of text, local</h3>
{% book '9780374157357', "text::a string of text", "local" %}
<h3>text, inventory</h3>
{% book '9780374157357', "text", "inventory" %}
<h3>text, librofm</h3>
{% book '9780374157357', "text", "librofm" %}
<h3>text, worldcat</h3>
{% book '9780374157357', "text", "worldcat" %}
<h3>text, local</h3>
{% book '9780374157357', "text", "openlibrary" %}
<h3>text, fallback</h3>
{% book '9780374157357', "text", "fallback" %}
</div>
<div class="my-16 prose">
<h2 class="">cover</h2>
{% book '9780374157357', "cover" %}
</div>
<div class="w-full my-16 prose">
<h2>full</h2>
{% book '9780374157357', "full" %}
</div>
<div class="my-16 prose">
<h2>full-details</h2>
{% book '9780374157357', "full-details" %}
</div>
<div class="my-16 prose">
<h2>wrapped</h2>
{% book '9780374157357', "wrapped" %}
</div>
<div class="my-16 prose">
<h2>small</h2>
{% book '9780374157357', "small" %}
</div>
<div class="my-16 prose">
<h2>card</h2>
{% book '9780374157357', "card" %}
</div>
<div class="my-16 prose">
<h2>title</h2>
{% book '9780374157357', "title" %}
</div>
<div class="my-16 prose">
<h2>raw</h2>
{% book '9780374157357', "raw" %}
</div>
<div class="my-16 prose">
<h2>json</h2>
{% book '9780374157357', "json" %}
</div>








