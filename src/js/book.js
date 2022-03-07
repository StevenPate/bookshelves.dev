const site = require("../_data/site.json");
const ISBNsOnShelves = require("../_data/ISBNsOnShelves.json");
const createObjectFromISBN = require("../js/createISBNObject");
const formatISBNContext = require("../js/formatISBNContext");
const contexts = require("../js/contexts");
const refineBookObject = require("../js/refineBookObject");

async function thisBook(
  thisISBN,
  display,
  displayText,
  linkType = "purchase",
  context,
  thisShelf
) {
  if (!thisISBN) {
    console.log(
      `Can't create any book to display without an ISBN.`,
    );
    return;
  }

  // get everything we got for the ISBN from the sockShelves script
  let ISBNfromShelves = ISBNsOnShelves.find(
    (element) => element.ISBN == thisISBN
  );

  // Start creating a book and if we didn't already find anything, go fetch some info
  let ISBNObject =
    ISBNfromShelves === undefined
      ? await createObjectFromISBN(thisISBN)
      : ISBNfromShelves;

  // Update the book object with data from the shelves
  let thisBook = refineBookObject(ISBNObject, thisShelf, linkType);
  
  let cover = (thisBook.coverImage != null) 
    ? `<a href="${thisBook.link}">${thisBook.coverImage}</a>`
    : ''
  let textLink = (thisBook.displayText != null) 
    ? `<a href="${thisBook.link}">${displayText}</a>`
    : `<a href="${thisBook.link}">${thisBook.title}</a>`
  let purchaseLinkText = (thisBook.displayText != null) 
    ? displayText
    : "Buy on Bookshop.org→";
  let purchase =`<a href="${thisBook.link}" class="mx-auto my-6 text-xl sm:text-2xl font-bold text-[#79BEFE] hover:underline; hover:decoration-wavy hover:decoration-amber-500">${purchaseLinkText}</a>`;

  let subtitle = (thisBook.subtitle != null) 
    ? `<h3 id="${thisBook.slug}-subtitle" class="mb-2 text-3xl font-bold text-gray-500 sm:text-3xl">${thisBook.subtitle}</h3>`
    : ''
  
  // in case we don't have anything else to add, let's at least write the title.
  let renderedBook = thisBook.title;

  switch (display) {
    case "textlink":
    default:
      return textLink;
    case "rawinfo":
      return thisBook;
      // return JSON.stringify(thisBook);
    case "description":
      return thisBook.description;
    case "context":
      return thisBook.formattedContext;
    case "cover":
      return cover;
    case "author":
      return thisBook.author;
    case "subtitle":
      return subtitle;
    case "title":
      return thisBook.title;
    case "slug":
      return thisBook.slug;
    case "purchase":
      return purchase;
    case "page":
      renderedBook = `
      <div id="${thisBook.slug}" class="flex gap-x-8 my-16">
        <div id="${thisBook.slug}-info" class="w-2/3">
          <h2 id="${thisBook.slug}-title" class="mb-2 text-5xl !mt-0 font-bold leading-tight book-title">
            ${thisBook.title}
          </h2>`;
      if (thisBook.subtitle != null) {
        renderedBook += subtitle;
      }
      if (thisBook.author != null) renderedBook += `
          <div id="${thisBook.slug}-author" class="mb-12 mt-4 text-2xl leading-tight ease-in-out prose prose-xl book-attribution font-Asul">
          ${thisBook.categories} by ${thisBook.author}
          </div>`

      renderedBook += `
          
        <div class="prose prose-xl">${thisBook.description}</div>`

      if (displayText) {
        renderedBook += `<p>${displayText}</p>`;
      }
      if (context == "full") {
        renderedBook += `<aside class="mt-12 bg-blue-100 px-6 py-6 backdrop-blur-lg">${thisBook.formattedContext}</aside>`;
      }

      renderedBook += `
        </div>
        <div id="${thisBook.slug}-image" class="w-1/3 not-prose my-6 px-6 flex flex-col">
        <!-- {{ processedCoverImage | safe }} -->
          ${thisBook.coverImage}`

          if (linkType == "purchase") {
          renderedBook += `
            <a href="${thisBook.link}" class="mx-auto my-6 text-xl sm:text-2xl font-bold text-[#79BEFE] hover:underline; hover:decoration-wavy hover:decoration-amber-500	">
                Buy on Bookshop.org→
            </a>`
          };

        renderedBook += `
        </div>
      </div>`;

      break;
    case "full":
        renderedBook = `
        <div id="${thisBook.slug}" class="flex flex-col-reverse sm:flex-row gap-x-8 my-16">
          <div id="${thisBook.slug}-info" class="w-full sm:w-2/3">
            <h2 id="${thisBook.slug}-title" class="mb-2 text-5xl !mt-0 font-bold leading-tight book-title">
              ${thisBook.title}
            </h2>`;
        if (thisBook.subtitle != null) {
          renderedBook += `<h3 id="${thisBook.slug}=subtitle" class="mb-2 text-3xl font-bold text-gray-500 sm:text-3xl">${thisBook.subtitle}</h3>`;
        }
        if (thisBook.author != null) renderedBook += `
            <div id="${thisBook.slug}-author" class="mb-12 mt-4 text-2xl leading-tight ease-in-out prose prose-xl book-attribution font-Asul">
            ${thisBook.categories} by ${thisBook.author}
            </div>`
  
        renderedBook += `
            
          <div class="prose prose-xl">${thisBook.description}</div>`
  
        if (displayText) {
          renderedBook += `<p>${displayText}</p>`;
        }
        if (context == "full") {
          renderedBook += `<aside class="mt-12 bg-blue-100 px-6 py-6">${thisBook.formattedContext}</aside>`;
        }
  
        renderedBook += `
          </div>
          <div id="${thisBook.slug}-image" class="w-full sm:w-1/3 not-prose my-6 px-6">
          <!-- {{ processedCoverImage | safe }} -->
            ${thisBook.coverImage}
          </div>
        </div>`;
  
        break;  
    case "json":
      // linkText = 'Buy Now on Bookshop.org';
      return `"title": "${thisBook.title}",
            "id": "${thisBook.ISBN}",
            "author": "${thisBook.author}",
            "link": "${site.url}/${thisBook.ISBN}/",
            "image": "${thisBook.cover}",
            "date_finished": null,
            "notes": "${thisBook.description}"`;
  }

  return renderedBook;
}

module.exports = thisBook;
