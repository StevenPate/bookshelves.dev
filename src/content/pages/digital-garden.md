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
<div class="my-6 transition duration-300 ease-in-out bg-white rounded-lg shadow-lg hover:bg-white hover:shadow-2xl
hover:-translate-y-1 hover:scale-[1.01]">
<a class="no-underline group" href="{{ item.url }}">
<div class="flex flex-row items-start p-6 space-x-8 ">
<div class="prose prose-xl">
<div class="underline text-bkshlvs-blue decoration-amber-500 group-hover:underline group-hover:decoration-wavy group-hover:text-blue-800">{{ item.data.title }}</div>
<div class="mb-1 text-lg no-underline">{{ item.data.subtitle }}</div>
<div class="text-sm text-gray-400 no-underline">Updated on
{{ item.inputPath | getGitCommitDateFromPath | readableDate }}</div>
</div>
</div>
</a>
</div>
{% endfor %}
</section>