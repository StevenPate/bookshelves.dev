const site = require("../_data/site.json");

const slugify = require("slugify");
const humanizeList = require("humanize-list");

const formatArray = (arrayToFormat) => {
  if (Array.isArray(arrayToFormat)) {
    arrayToFormat = humanizeList(arrayToFormat);
  }
  return arrayToFormat;
};

function layout(id, display, details, contexts, otherContexts, linkType) {
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
  let sub =
    subtitle != null
      ? `<h3 id="${slug}-subtitle" class="mb-2 text-3xl font-bold text-gray-500 sm:text-3xl">${subtitle}</h3>`
      : "";
  link = linkType == "purchase" ? link.purchase : link.local;

  let contextsLayout = "";
  if (contexts) {
    const deccriptiveContexts = contexts.map(({ descriptive }) => descriptive);
    let contextsList = formatArray(deccriptiveContexts);
    contextsLayout = `
      <aside class="mt-12 px-6 py-6">
        <h3 class="font-bold">Shelves:</h3>
          ${contextsList}
      </aside>`;
  }

  categories = formatArray(categories);
  authors = formatArray(authors);

  displayText = title
  if (/::/.test(display)) {
    const displayHasText = display.split(new RegExp('[::]'));
    displayText = displayHasText[2];
    display = "text";
  }

  

  switch (display) {
    case "text":
    default:
      return `<a href="${link}">${displayText}</a>`;
    case "cover":
      return `<a href="${link}">${cachedCover}</a>`;
    case "full":
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
</div>
        </div>`;
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
