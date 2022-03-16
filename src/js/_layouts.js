const site = require("../_data/site.json");
const slugify = require("slugify");
const humanizeList = require("humanize-list");

const formatArray = (arrayToFormat) => {
  if (Array.isArray(arrayToFormat)) {
    arrayToFormat = humanizeList(arrayToFormat);
  }
  return arrayToFormat;
};

function layout(id, display, details, contexts, linkInfo) {
  let {
    title,
    subtitle,
    categories,
    authors,
    description,
    cover,
    cachedCover,
    publisher,
    publishedDate,
    pages,
    link,
    linkText,
  } = details;
  let allContexts = (contexts)
    ? contexts.verbose.all
    : `${id} has no contexts`
  let otherContexts = (contexts)
    ? contexts.verbose.other
    : `${id} has no contexts`

  let slug = slugify(title, { lower: true, strict: true });
  categories = formatArray(categories);
  authors = formatArray(authors);

  let contextsLayout =
    display == "full-details"
      ? `
        <aside class="my-12 prose prose-xl">
          <h3><span class="font-bold italic">${title}</span> is on these shelves:</h3>
            ${allContexts}
        </aside>`
      : `
        <aside class="my-12 prose prose-base text-gray-500">
            <span>Elsewhere</span>: ${otherContexts}
        </aside>`;

  let detailsLayout =
    display == "full-details"
      ? `
      <div class="prose prose-sm my-12">
      <h3 class="text-lg font-bold">Details</h3>
      <div><strong>Publisher:</strong> ${publisher}</div>
      <div><strong>Categories:</strong> ${categories}</div>
      <div><strong>Pages:</strong> ${pages}</div>
      <div><strong>Publication Date:</strong> ${publishedDate}</div>
      <div><strong>ISBN:</strong> ${id}</div>
      </div>`
      : "";

  let sub =
    subtitle != null
      ? `<h3 id="${slug}-subtitle" class="mb-2 text-3xl font-bold text-gray-500 sm:text-3xl">${subtitle}</h3>`
      : "";

  if (/::/.test(display)) {
    const displayHasText = display.split(new RegExp("[::]"));
    display = displayHasText[0];
    linkText = displayHasText[2];
  }

  switch (display) {
    case "text":
    default:
      return `<a href="${link}">${linkText}</a>`;
    case "cover":
      return `<a href="${link}">${cachedCover}</a>`;
    case "full":
    case "full-details":
      return `
<div id="${slug}" class="book flex flex-col-reverse sm:flex-row gap-x-8 my-16">
<div id="${slug}-info" class="w-full sm:w-2/3">
<h2 id="${slug}-title" class="mb-2 text-5xl !mt-0 font-bold leading-tight book-title">
${title}
</h2>
${sub}
<div id="${slug}-author" class="mb-12 mt-4 text-2xl leading-tight ease-in-out prose prose-xl book-attribution font-Asul">
by ${authors}
</div>
<div class="prose prose-xl">${description}</div>
${contextsLayout}
</div>
<div id="${slug}-image" class="w-full sm:w-1/3 not-prose my-6 px-6 flex flex-col items-center content-start">
${cachedCover}
<a href="${link}">
<button class="mx-auto w-auto m-6 px-4 py-2 text-base font-semibold text-blue-400 bg-transparent bg-none border border-blue-300 hover:bg-blue-200 hover:text-white hover:border-transparent">
${linkText}
</button>
</a>
${detailsLayout}
</div>
</div>`;
    case "small":
      return `
<div id="${slug}" class="my-4 flex flex-row content-start" >
  <div id="${slug}-image" class="w-28 pr-2 content-start items-top"><a href="${link}">${cachedCover}</a></div>
  <div id="${slug}-info" class="">
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
<div class="lg:w-1/3 bg-gray-50 p-6">${cachedCover}</div>
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
    case "raw":
      return JSON.stringify(details);
    case "json":
      // linkText = 'Buy Now on Bookshop.org';
      return `"title": "${title}",
            "id": "${id}",
            "author": "${authors}",
            "link": "${site.url}/${id}/",
            "image": "${cover}",
            "date_finished": null,
            "notes": "${description}"`;
  }
}

module.exports.layout = layout;
