const site = require("../_data/site.json");
const slugify = require("slugify");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({
  html: true,
});
const humanizeList = require("humanize-list");
const dayjs = require("dayjs");

const formatArray = (arrayToFormat) => {
  if (Array.isArray(arrayToFormat)) {
    arrayToFormat = humanizeList(arrayToFormat);
  }
  return arrayToFormat;
};

function layoutBook(id, bookDisplayFormat, details, contexts) {
  let {
    title,
    subtitle,
    categories,
    authors,
    summary,
    description,
    // cover,
    // cachedCover,
    coverUrl,
    cachedCoverUrl,
    publisher,
    publishedDate,
    pageCount,
    link,
    linkText,
    excerpts, //need to format for extraFieldsLayout
    howFound, //need to format for extraFieldsLayout
    whereFound, //need to format for extraFieldsLayout
    otherInfo, //need to format for extraFieldsLayout
  } = details;
  let allContexts = contexts ? contexts.verbose.all : `${id} has no contexts`;
  let otherContexts =
    contexts && contexts.verbose.other ? `${contexts.verbose.other}` : ``;
  let slug = title ? slugify(title, { lower: true, strict: true }) : "??? ";
  categories = formatArray(categories);
  authors = formatArray(authors);
  // if (cachedCoverUrl == null) {
  //     cachedCoverUrl = cachedCover;
  // }

  // console.log(id,details)
  //TODO: CLEAN THESE UP
  // if (howFound) {
  //   howFoundContent =  md.render(howFound)
  //   howFoundDisplay = `
  //   <div>
  //     <h3>How did I find this?</h3>
  //     ${howFoundContent}
  //   </div>`
  // };
  // if (whereFound) {
  //   whereFound =  md.render(whereFound)
  //   whereFoundDisplay = `
  //   <div>
  //     <h3>How did I find this?</h3>
  //     ${whereFound}
  //   </div>`
  // };
  // if (otherInfo) {
  //   otherInfo =  md.render(otherInfo)
  //   otherInfoDisplay = `
  //   <div>
  //     <h3>Other Info</h3>
  //     ${whereFound}
  //   </div>`
  // };

  let contextsLayout =
    bookDisplayFormat == "full-details"
      ? `
<aside class="my-12 prose prose-base text-gray-500">
    ${allContexts}
</aside>`
      : `
<aside class="my-12 prose prose-base text-gray-500">
    ${otherContexts}
</aside>`;

  // let extraFieldsLayout =
  //   bookDisplayFormat == "full-details"
  //     ? `<div class="prose prose-base my-12">
  //     ${howFoundDisplay}
  //     ${whereFoundDisplay}
  //     ${otherInfoDisplay}
  //     </div>`
  //     : ''

  let detailsLayout =
    bookDisplayFormat == "context-card" || bookDisplayFormat == "full-details"
      ? `


<div class="prose prose-sm text-center " x-data="{ show: false }">
<button class="text-gray-500 p-2 transition duration-300 ease-in-out delay-150 hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:scale-110" x-text="show ? 'Hide Details' : 'Show Details &gt;&gt;'" :class="{ 'bg-blue-200'}" @click="show = !show"></button>
<div x-show="show" class="prose prose-sm py-6 text-left">
<div><strong>Publisher:</strong> ${publisher}</div>
<div><strong>Categories:</strong> ${categories}</div>
<div><strong>Pages:</strong> ${pageCount}</div>
<div><strong>Publication Date:</strong> ${publishedDate}</div>
<div><strong>ISBN:</strong> ${id}</div>
</div>
</div>`
      : "";

  let sub =
    subtitle != null
      ? `<h3 id="${slug}-subtitle" class="mb-2 text-3xl font-bold text-gray-500 sm:text-3xl">${subtitle}</h3>`
      : "";

  let textLink = title;
  if (/::/.test(bookDisplayFormat)) {
    const displayHasText = bookDisplayFormat.split(new RegExp("[::]"));
    bookDisplayFormat = displayHasText[0];
    linkText = displayHasText[2];
    if (bookDisplayFormat == "text") {
      textLink = linkText;
    }
  }

  switch (bookDisplayFormat) {
    case "text":
    default:
      return `<a href="${link}">${textLink}</a>`;
    case "cover":
      return `<div><a href="${link}">${cachedCoverUrl}</a></div>`;
    case "full":
    case "full-details":
      description = description ? md.render(description) : "";
      return `
<div data-aos="fade-up" id="${slug}" class="book flex flex-col-reverse sm:flex-row gap-x-8 px-8 md:px-16 lg:pl-16 lg:pr-48 my-16 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-300">
<div id="${slug}-info" class="book-info max-w-[65ch] sm:w-2/3">
<h2 id="${slug}-title" class="mb-2 text-5xl !mt-0 font-bold leading-tight book-title">
${title}
</h2>
${sub}
<div id="${slug}-author" class="mb-12 mt-4 text-2xl leading-tight ease-in-out prose prose-xl book-attribution font-Asul">
by ${authors}
</div>
<div class="prose prose-xl">${description}</div>
${contextsLayout}
${detailsLayout}
</div>
<div id="${slug}-image" class="book-cover w-full sm:w-1/3 not-prose my-6 sm:px-6 flex flex-col items-center content-start">
<a href="/${id}">${cachedCoverUrl}</a>
<a href="${link}">
<button class="mx-auto w-auto m-6 px-4 py-2 text-base font-semibold text-blue-400 bg-transparent bg-none border border-blue-300  hover:border-transparent transition duration-300 ease-in-out delay-150 hover:bg-white hover:shadow-xl">
${linkText}
</button>
</a>
</div>
</div>`;
    case "wrapped":
      return `
<div data-aos="fade-up" id="${slug}" class="max-w-[65ch] book flex flex-col-reverse sm:flex-row gap-x-8 my-16 bg-gradient-to-b bg-gr from-gray-100 via-gra-100 to-gray-300">
<div id="${slug}-description" class="relative book-description">
 <div id="${slug}-cover" class="float-right -mr-24 w-40 ml-12 mb-12 space-y-8 overflow-hidden book-cover">
  <a href="/${id}">${cachedCoverUrl}</a>
  <div id="${slug}-title" class="font-xl"><a href="${link}">${title}</a></div>
  <div id="${slug}-author" class="font-lg">by ${authors}</div>
 </div>
 ${description}
</div>
</div>

            `;
    case "small":
      return `
<div id="${slug}" class="my-4 flex flex-col sm:flex-row content-start" >
<div id="${slug}-image" class="w-full sm:w-28 py-8 content-start items-top"><a href="${link}">${cachedCoverUrl}</a></div>
<div id="${slug}-info" class="w-full sm:w-2/3 prose prose-lg py-6 pl-4 sm:py-auto">
<div id="${slug}-title" class="font-xl"><a href="${link}">${title}</a></div>
<div id="${slug}-author" class="font-lg">${authors}</div>
</div>
</div>
`;
    case "title":
      return `
<div id="${slug}" class="my-4">
<div id="${slug}-title" class="font-xl"><a href="${link}">${title}</a></div>
<div id="${slug}-author" class="font-lg">${authors}</div>
</div>
</div>
`;
    case "card":
      return `

<div class="m-2 bg-white rounded-lg shadow-xl lg:flex lg:max-w-lg">
<div class="lg:w-1/3 bg-gray-50 p-6">${cachedCoverUrl}</div>
<div class="p-6 bg-gray-50 lg:w-2/3">
<h2 class="mb-2 text-2xl font-bold text-gray-900 mt-0">${title}</h2>
<p class="text-gray-600">${authors}</p>
<a href="${link}">
<button class="mx-auto w-auto m-6 px-4 py-2 text-base font-semibold text-blue-400 bg-transparent bg-none border border-blue-300 hover:bg-blue-200 hover:text-white hover:border-transparent">
${linkText}
</button>
</a>
</div>
</div>


`;
    case "context-card":
      return `

<div class="m-2 transition duration-300 ease-in-out bg-white rounded-lg shadow-lg hover:bg-white hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01]">
    <div class="sm:flex">
        <div class="sm:w-1/3 bg-gray-50 p-6"><a href="${link}">${cachedCoverUrl}</a></div>
        <div class="px-6 lg:p-6 bg-gray-50 sm:w-2/3">
            <h2 class="mb-2 text-2xl font-bold text-gray-900 mt-0">${title}</h2>
            <p class="text-gray-600">${authors}</p>
        </div>
    </div>
    <div class="px-6 pb-6">
    <p class="text-gray-600 text-base">${summary} (<a href="${link}">Read More</a>)</p>
    <aside class="my-12 prose prose-base text-gray-500">
        ${allContexts}
    </aside>
    </div>
</div>


`;
    case "raw":
      return JSON.stringify(details);
    case "json":
      // linkText = 'Buy Now on Bookshop.org';
      let goodDesc = JSON.stringify(description);
      return `"title": "${title}",
            "id": "${id}",
            "author": "${authors}",
            "link": "${site.url}/${id}/",
            "image": "${coverUrl}",
            "date_finished": null,
            "notes": "TBD"`;
  }
}

function layoutShelf(
  shelfID,
  shelfBooks,
  shelfData,
  bookDisplayFormat,
  lastModifiedDate
) {
  const {
    shelfTitle,
    shelfDescription = "",
    dateModified,
    commitDate,
  } = shelfData;
  const lastModified = dayjs(commitDate).format("YYYY-MM-DD");
  switch (bookDisplayFormat) {
    case "card":
      return `
<div class="my-6 py-6 px-2 sm:p-6 group m-2 transition duration-300 ease-in-out bg-white rounded-lg shadow-lg hover:bg-white hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01] cursor-pointer">
    <a class="no-underline group flex flex-row space-x-8 items-start" href="/${shelfID}">
        <img src="/images/icons/book-shelf.png" alt="Line drawing of books on a shelf" class="h-12 my-0">
        <div class="prose prose-xl">
            <div class="underline text-bkshlvs-blue decoration-amber-500 group-hover:underline group-hover:decoration-wavy group-hover:text-blue-800">${shelfTitle}</div>
            <div class="mb-1 text-lg no-underline"">${shelfDescription}</div>
            <div class="text-sm text-gray-400 no-underline"">Updated on ${lastModified}</div>
        </div>
    </a>
</div>`;
    case "text":
    default:
      return shelfBooks.join("<br>");
    case "cover":
      let renderedCovers = "";
      for (let book in shelfBooks) {
        renderedCovers += `<div class="my-6 text-lg">${shelfBooks[book]}</div>`;
      }
      return `
<div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
${renderedCovers}
</div>`;
  }
}

module.exports.layoutBook = layoutBook;
module.exports.layoutShelf = layoutShelf;
