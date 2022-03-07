const slugify = require("slugify");
const humanizeList = require('humanize-list')

const formatArray = (arrayToFormat) => {
  if (Array.isArray(arrayToFormat)) { arrayToFormat = humanizeList(arrayToFormat)}
  return arrayToFormat;
}

function layout(id, details, contexts, diaplay) {
  let {title, subtitle, categories, authors, description, cachedCover, link} = details;
  let slug = slugify(title, { lower: true, strict: true });
  let sub = (subtitle != null) ?`<h3 id="${slug}-subtitle" class="mb-2 text-3xl font-bold text-gray-500 sm:text-3xl">${subtitle}</h3>` : ''
  // link = (linkType == "purchase") ? link.purchase : link.local
  const deccriptiveContexts = contexts.map(({descriptive})=> descriptive);
  let contextsList = formatArray(deccriptiveContexts);
  categories = formatArray(categories)
  authors = formatArray(authors)

  switch (diaplay) {
    case "textlink":
      default:
      return `<a href="${link}">${title}</a>`;
    case "cover":
      return `<a href="${link}">${cachedCover}</a>`
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
            <aside class="mt-12 px-6 py-6">
              <h3 class="font-bold">Shelves:</h3>
              ${contextsList}
            </aside>
          </div>
        </div>`
    case "raw":
      return JSON.stringify(details);
    case "test":
      return "ha!";
    }
  // return fullBook
}


module.exports.layout = layout