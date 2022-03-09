const site = require("../_data/site.json");

const slugify = require("slugify");
const humanizeList = require("humanize-list");
const { data } = require("autoprefixer");
const { getBookshopOrg } = require("./_getData");

const formatArray = (arrayToFormat) => {
  if (Array.isArray(arrayToFormat)) {
    arrayToFormat = humanizeList(arrayToFormat);
  }
  return arrayToFormat;
};

const buildLink = (defaultLinks, linkInfo, conversionPath) => {

  if (/::/.test(linkInfo)) {
    linkComponents = linkInfo.split(new RegExp('[::]'));
    linkType = linkComponents[0];
    linkValue = linkComponents[2];
    // console.log(linkType, linkValue)
  } else {
    linkType = linkInfo;
    linkValue = (conversionPath) ? conversionPath : "default";
  }
  
  // so at this point 
  //   we have a linkType of local or purchase.
  //   if it's local, wright the default local link, which is /[ISBN]
  //   If it is purchase, then...
  //   if there was something after :: in the linkInfo parameter passed by the shortcode,
  //   we have that as the linkValue.
  //   if not we will use a conversionPath from the shelf or masterShelf and use that as linkValue
  //   otherwise the linkValue is default.
  // now we want to do this:
  //   if default, write the default link using global commerce data.
  //   if it's a value we recognize from global commerce data, use the corresponding link
  //   if it looks like a borg affiliate id, use that
  //   if we recognize it as a url, look for [ISBN] in there and write that out for linkValue

  //   defaultLinks as defined aren't useful but maybe all this logic gets moved to component and called from _buildBook, so just output a link.

  switch (linkType) {
    case "purchase":
      link = (linkValue == "default") ? defaultLinks.purchase : linkValue
      break;
    case "local":
      link = (linkValue == "default") ? defaultLinks.local : linkValue
      break;
  }

  return link;
}

function layout(id, display, details, contexts, otherContexts, linkInfo) {
  let {
    title,
    subtitle,
    categories,
    authors,
    description,
    cover,
    cachedCover,
    defaultLinks,
    conversionPath
  } = details;
  let slug = slugify(title, { lower: true, strict: true });
  let sub =
    subtitle != null
      ? `<h3 id="${slug}-subtitle" class="mb-2 text-3xl font-bold text-gray-500 sm:text-3xl">${subtitle}</h3>`
      : "";
  // link = linkType == "purchase" ? link.purchase : link.local;

  let link = buildLink(defaultLinks, linkInfo, conversionPath);
  
  // if (/::/.test(linkInfo)) {
  //   linkComponents = linkInfo.split(new RegExp('[::]'));
  //   linkType = linkComponents[0];
  //   linkValue = linkComponents[2];
  //   console.log(title, linkType, linkValue)
  // } else {
  //   linkType = linkInfo;
  //   linkValue = "default";
  // }
  
  // switch (linkType) {
  //   case "purchase":
  //     link = (linkValue == "default") ? defaultLinks.purchase : linkValue
  //     break;
  //   case "local":
  //     link = (linkValue == "default") ? defaultLinks.local : linkValue
  //     break;
  // }
  // console.log(linkType);
  // switch (linkType) {
  //   case "purchase":
  //   default:
  //     console.log(`purchase!`);
  //     link = link.purchase; //temp
  //     break
  //     // return `<a href="${link2}">${displayText}</a>`;
  //   case "local":
  //     console.log(`local!`);
  //     link = link.local; //temp
  //     break
  //     // return `<a href="${link2}">${displayText}</a>`;
  //   case "URL":
  //     console.log(`URL!`);
  //     break
  // }

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
    display = displayHasText[0];
    displayText = displayHasText[2];
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
<div><a href="${link}">here is a link</a></div>
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
