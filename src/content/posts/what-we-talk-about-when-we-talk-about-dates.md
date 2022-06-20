---
title: What we talk about when we talk about dates
subtitle: Dating things that you publish on the internet (including book reviews and capsules) is always important, but doing this effectively on this site is giving me some headaches.
tags:
  - about
dateCreated: 2022-06-06
dateModified: 2022-06-16
---

Easy-to-find dates are important for readers who want to evaluate a particular piece of content on the web.

I want to use the dates to show, at a glance, what may have changed since the last time you visited, and to provide some context for readers who want to evaluate the relevance of the book notes, reviews and content on the site.

When we're talking about shelves, I want those shelves to "live" and grow. Maybe it's a long time between updates, or maybe it's all the time. That's worth knowing.

Imagine walking into a bookstore and having terminator vision: everything that had changed since the last time you visited had a little red dot or something.

I want the created and updated dates to be somewhat prominent on shelf essays and full details for books, and to be scannable on certain formats of books and shelves (e.g., cards).

This site is built using a static site generator on a hosted platform. This means that the "date created" for all the files ends up being the time of deployment, and therefore not useful.

So this data needs to either be sourced from the CMS data via API or if (like me) you want to use git as the source of truth, then the original check-in date and the last check-in date can be used for first published, last updated.

But there is a further challenge: balancing the desire for simplicity in book entry (just ISBN! Maybe a title! And a description is great!), where adding the created and modified dates manually seems necessary but onerous. Is there a git solution for this? I don't know that there is.

