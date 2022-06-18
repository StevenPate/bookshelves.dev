---
title: No Books But On Shelves
subtitle: Down with lists. Up with shelves.
dateCreated: 2022-03-28

---
Where do you keep _your_ books?

Probably on a shelf. Maybe (especially if you have what some people who aren't me might call "too many") in a stack. But I bet if you had your way, they'd all be on shelves.

It just feels right when books are put on shelves. By a person. Not by an algorithm or (simply) a sales chart.

And so <mark class="bg-amber-100">I want a system where I can organize books into an analogously harmonious digital collection</mark>. A shelf.

Right now, in the bookshelves.dev system, a shelf can come from a text file. As simple as a list of ISBNs, a title for the shelf. It can look like this:

```
---
title: "Timothy Snyder helps me understand Russia's invasion of Ukraine"
description: I heard Snyder on a few podcasts and learned more about the Russia/Ukraine conflict in 45 minutes than I had in the weeks before.
books:
  - ISBN: "9781610396004"
  - ISBN: "9780156701532"
  - ISBN: "9781541675643"
  - ISBN: "9780804190114"
  - ISBN: "978046503147"
  - ISBN: "9780525574477"
---

```

[Check out the page generated from this code](/timothy-snyder-helps-me-understand-russias-invasion-of-ukraine/). It pulls in a bunch of placeholder info from the web (cover images, description, title). This is meant to be superceded by content you add yourself.

Let's imagine that we want to add a new description to one of those books:

```
  - ISBN: "9780156701532"
    description: Snyder recommended this text on Ezra Klein's podcast as a timely book. Who could argue with that? This classic text has cast a very long shadow, and now is as good a time as any to remind ourselves exactly how and why humans coordinate to do the very worst things that humans can do. 
```

Anything I specify on the shelf will overwrite the data from the APIs. A live example would be the first entry from the shelf collecting all the audiobooks I listened to on a thruhike of the Pacific Crest Trail, [A memory palace the size of a nation-state shelf, which collects](/a-memory-palace-the-size-of-a-nation-state/) :


```
books:
  - ISBN: "9780743203968"
    description: |
      An artist living in a lonely rented house discovers a mysterious man with inexplicable knowledge of her own life. This novella is at once a sort of ghost story, an exploration of grief and solitude, and a surprising dive into the mysterious depths of the artistic process. DeLillo's impeccable sentences helped to pull me through the arid, sunwashed mountains, and Laurie Anderson's mesmerising, low-affext voice making it all the more surreal. This was one of the only audiobook recommendations I received before heading out on the trail (thanks Andy!), and it worked its magic on me. 
      
      **What this book is like (for me)**: sitting in the noonday desert sun listening to someone insisting that it is midnight on a moonless night, and believing them because they are that good at telling a story.
    audioISBN: "9780743562669"
    audiobook: true 
```
Not only did I add my own description, I also added the ISBN for an audiobook and set told it to use the audiobook link for this title (which defaults to [libro.fm](https://libro.fm)). 

Now, a book can be on multiple shelves. You can see below the book description on the page which is generated for every book placed on a shelf. {% book "9780857861832", "text::Here is an example", "local" %}. I have big plans for this way of linking among books and shelves.

My idea here is to have <mark class="bg-amber-100">the starting point for a flexible, organized system of books to be a human-readable text file.</mark>. Why? Because in a sense, this doesn't ever need to be backed up or exported. It *is* the collection. Everything else can be built *from* it. By importing it into any CMS, sure. Or just by running bookshelves.dev and building everything, using interchangeable technologies that make sense for specific contexts, at any date in the future.

So by creating a shelf with ISBNs, I generate a collection of books that can showcase different curation contexts which can contain different links (to worldcat, or open library, or bookshop.org, other conversion paths, etc.) or be updated globally if desired. This also produces a data file representing all shelves, which can be shared in a (still-evolving) format (check out the working version: [library.json](/library.json)).

There's a lot more to explain about how the shelves can work, and why I built it this way. Another place where I'll talk about this is on the [Building sites with javascript](/building-sites-with-javascript) page. 