const site = require("../_data/site.json");
const slugify = require("slugify");
const humanizeList = require("humanize-list");

const formatArray = (arrayToFormat) => {
  if (Array.isArray(arrayToFormat)) {
    arrayToFormat = humanizeList(arrayToFormat);
  }
  return arrayToFormat;
};

function layout(id, display, details, contexts, otherContexts, linkInfo) {
  let {
    title,
    subtitle,
    categories,
    authors,
    description,
    cover,
    cachedCover,
    link,
  } = details;

  let slug = slugify(title, { lower: true, strict: true });
  

 
  let contextsLayout = "";
  if (contexts) {
    const deccriptiveContexts = contexts.map(({ descriptive }) => descriptive);
    let contextsList = formatArray(deccriptiveContexts);
    contextsLayout = `
      <aside class="my-12">
        <h3 class="font-bold">${title} is on these shelves:</h3>
          ${contextsList}
      </aside>`;
  }

  categories = formatArray(categories);
  authors = formatArray(authors);

  linkText = title;
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
      let sub =
      subtitle != null
        ? `<h3 id="${slug}-subtitle" class="mb-2 text-3xl font-bold text-gray-500 sm:text-3xl">${subtitle}</h3>`
        : "";
      return `
<div id="${slug}" class="book flex flex-col-reverse sm:flex-row gap-x-8 my-16">
<div id="${slug}-info" class="w-full sm:w-2/3">
<h2 id="${slug}-title" class="mb-2 text-5xl !mt-0 font-bold leading-tight book-title">
${title}
</h2>
${sub}
<div id="${slug}-author" class="mb-12 mt-4 text-2xl leading-tight ease-in-out prose prose-xl book-attribution font-Asul">
${categories} by ${authors}
</div>
<div class="prose prose-xl">${description}</div>
</div>
<div id="${slug}-image" class="w-full sm:w-1/3 not-prose my-6 px-6">
${cachedCover}
${contextsLayout}
<div><a href="${link}">${linkText}</a></div>
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
`
    case "title":
      return `
<div id="${slug}" class="my-4">
<div id="${slug}-title" class="font-xl"><a href="${link}">${title}</a></div>
<div id="${slug}-author" class="font-lg">${authors}</div>
</div>
</div>
`
    case "card":
    return `

<div class="m-2 bg-white rounded-lg shadow-xl lg:flex lg:max-w-lg">
<div class="lg:w-1/3 bg-gray-50 p-6">${cachedCover}</div>
<div class="p-6 bg-gray-50 lg:w-2/3">
<h2 class="mb-2 text-2xl font-bold text-gray-900 mt-0">${title}</h2>
<p class="text-gray-600">${authors}</p>
<div class="justify-center mx-auto"><a href="${link}">${linkText}</a></div>
</div>
</div>


    `
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
