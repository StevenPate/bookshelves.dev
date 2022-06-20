---
title: Digital Garden
subtitle: Like a blog, but the posts are never "done".
eleventyNavigation:
  key: Digital Garden
  order: 2
---
A digital garden? Well, it's like a blog but I continue updating the pages and tending to them. Read more on the post on the topic, [About Digital Gardens](/digital-gardens/).
<section>
{% for item in collections.posts | reverse %}
<!-- <li><a href="{{item.url}}">{{item.data.title}}</a></li> -->
<div class="flex flex-row items-start py-6 space-x-8 sm:p-6 group">
<div class="prose prose-xl">
<a class="group-hover:decoration-wavy" href="{{item.url}}">{{item.data.title}}</a>
<div class="mb-1 text-lg">{{item.data.subtitle}}</div>
<div class="text-sm text-gray-400">Updated on {{ item.inputPath | getGitCommitDateFromPath | readableDate }}</div>

</div>
</div>

{% endfor %}
</section>