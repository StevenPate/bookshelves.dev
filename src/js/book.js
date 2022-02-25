const site = require("../_data/site.json");
const commerce = require("../_data/commerce.json");
const ISBNsOnShelves = require("../_data/ISBNsOnShelves.json");
const findDataForISBN = require("../js/findDataForISBN");
const slugify = require("slugify");
const MarkdownIt = require("markdown-it");
let md = new MarkdownIt();
const lf = new Intl.ListFormat('en');

const createISBNObject = async (ISBN) => {
  let fetchedDataForISBN = await findDataForISBN(ISBN);
  const ISBNObject = {
    ISBN: ISBN,
    shelfData: null,
    fetchedData: fetchedDataForISBN,
  };
  return ISBNObject;
};

const refineBookObject = (ISBNObject, thisShelf) => {

  let authorString = (Array.isArray(ISBNObject.fetchedData.author))
    ? lf.format(ISBNObject.fetchedData.author)
    : ISBNObject.fetchedData.author

  let thisBook = {
    ISBN: ISBNObject.ISBN,
    slug: slugify(ISBNObject.fetchedData.title, { lower: true, strict: true }),
    title: ISBNObject.fetchedData.title,
    subtitle: ISBNObject.fetchedData.subtitle,
    author: authorString,
    description: ISBNObject.fetchedData.description,
    descriptionCredit: null,
    categories: ISBNObject.fetchedData.categories,
    coverImage: ISBNObject.fetchedData.bookshopCoverImage,
  };


  let contexts = [];

  if (ISBNObject.shelfData != (null || undefined)) {
    ISBNObject.shelfData.forEach((shelfObject) => {
      let shelfLink = `<a href="/${shelfObject.shelfID}/">${shelfObject.shelfTitle}</a>`;

      let shelfAttrribution = (shelfObject.bookData.descriptionCredit != null) 
        ? shelfObject.bookData.descriptionCredit
        : shelfObject.shelfAttribution
      //////// will add link at some point!

      let shelfLabel =
        shelfObject.bookData.shelfLabel != null
          ? shelfObject.bookData.shelfLabel
          : null;

      let context = {
        shelfLink: shelfLink,
        shelfLabel: shelfLabel,
        shelfAttribution: shelfAttrribution,
      };
      if (shelfObject.shelfID != thisBook.ISBN) {
        contexts.push(context);
      }

      thisBook.contexts = contexts;
    });

    let addAnyData = (entry) => {
      if (entry[1] != null) {
        let prop = entry[0];
        thisBook = {
          ...thisBook,
          [prop]: entry[1],
        };
      }
    };

    if (ISBNObject.masterShelf != null) {
      let priorityData = ISBNObject.shelfData.find(
        (item) => item.shelfPath === ISBNObject.masterShelf
      );
      Object.entries(priorityData.bookData).forEach((entry) => {
        addAnyData(entry);
      });
    }
    if (thisShelf != null) {
      let priorityData = ISBNObject.shelfData.find(
        (item) => item.shelfPath === thisShelf
      );
      Object.entries(priorityData.bookData).forEach((entry) => {
        addAnyData(entry);
      });
    }
  }
  if (thisBook.descriptionCredit == null) {
    if (thisBook.description == ISBNObject.fetchedData.description) {
      thisBook.descriptionCredit = "Publisher's Copy" 
    }
  }
  if (thisBook.descriptionCredit != null) {
    thisBook.description += ` (${thisBook.descriptionCredit})`;
  } 
  thisBook.description = md.render(thisBook.description);

  return thisBook;
};

const createISBNLink = (thisBook, linkType) => {
  let linkForBook;
  if (linkType == "local") {
    linkType =
      thisBook.contexts == (null || "") ||
      typeof thisBook.contexts == "undefined"
        ? "purchase"
        : "local";
    if (linkType == "local") {
      linkForBook = `/${thisBook.ISBN}`;
    }
  }
  if (linkType == "purchase") {
    linkType = commerce.bookshoporgAffiliateID;
  }
  thisBook.conversionPath
    ? (linkType = thisBook.conversionPath)
    : (linkType =
        linkType == (null || "") || typeof linkType == "undefined"
          ? "local"
          : linkType);
  if (/^a\d+$/i.test(linkType)) {
    linkForBook = `${commerce.bookshoporgLink}${linkType.substring(1)}/${
      thisBook.ISBN
    }`;
  } else {
    if (
      linkType != ("local" || "purchase" || null || "") ||
      typeof linkType != "undefined"
    ) {
      let commercePath = commerce.conversions.find(
        (item) => item.pathName === linkType
      );
      if (commercePath != undefined) {
        const commercePathURLwithISBN = commercePath.pathURL.replace(
          "[ISBN]",
          thisBook.ISBN
        );
        linkForBook = commercePathURLwithISBN;
      }
    }
  }

  return linkForBook;
};

// const renderBook = thisBook => {}

const renderDescriptiveContexts = (thisBook) => {
  // eventually take thisShelf as a parameter and exclude it from contexts when desired

  if (
    typeof thisBook.contexts !== "undefined" &&
    thisBook.contexts.length > 0
  ) {
    let descriptiveContexts = [];
    thisBook.contexts.forEach((element) => {
      element.shelfAttribution != null
        ? descriptiveContexts.unshift(element)
        : descriptiveContexts.push(element);
    });

    let ContextDescription = "<div>";
    ContextDescription +=
      descriptiveContexts[0].shelfLabel != null
        ? `${thisBook.title} was named ${descriptiveContexts[0].shelfLabel} in ${descriptiveContexts[0].shelfLink}`
        : descriptiveContexts[0].shelfAttribution
        ? `${thisBook.title} was added to the ${descriptiveContexts[0].shelfLink} shelf`
        : `${thisBook.title} is on the ${descriptiveContexts[0].shelfLink} shelf`;
    ContextDescription += descriptiveContexts[0].shelfAttribution
      ? ` by ${descriptiveContexts[0].shelfAttribution}. `
      : `.`;

    for (let i = 1; i < descriptiveContexts.length; i++) {
      if (i === 1) {
        ContextDescription += `It is also on the `;
      }
      ContextDescription += `${descriptiveContexts[i].shelfLink}`;
      if (descriptiveContexts.length >= 3) {
        ContextDescription +=
          i === descriptiveContexts.length - 1 ? ` shelves.` : ` and `;
      } else {
        ContextDescription += ` shelf.`;
      }
    }
    ContextDescription += "</div>";

    return ContextDescription;
  }
};

module.exports = async function (
  thisISBN,
  display = "textlink",
  displayText,
  linkType = "purchase",
  context,
  thisShelf
) {
  if (thisISBN == (null || "") || typeof thisISBN == "undefined") {
    return;
  }

  let ISBNfromShelves = ISBNsOnShelves.find(
    (element) => element.ISBN == thisISBN
  );
  let ISBNObject =
    ISBNfromShelves === undefined
      ? await createISBNObject(thisISBN)
      : ISBNfromShelves;
  let thisBook = refineBookObject(ISBNObject, thisShelf);
  let ISBNLink = createISBNLink(thisBook, linkType);
  let fullContext = renderDescriptiveContexts(thisBook, thisShelf);

  let renderedBook = thisBook.title;
  

  switch (display) {
    case "cover":
      renderedBook = `<a href="${ISBNLink}">${thisBook.coverImage}</a>`;
      break;
    case "page":
      renderedBook = `
      <div id="${thisBook.slug}" class="flex gap-x-8 my-16">
        <div id="${thisBook.slug}-info" class="w-2/3">
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
        renderedBook += `<aside class="mt-12 bg-blue-100 px-6 py-6">${fullContext}</aside>`;
      }

      renderedBook += `
        </div>
        <div id="${thisBook.slug}-image" class="w-1/3 not-prose my-6 px-6 flex flex-col">
        <!-- {{ processedCoverImage | safe }} -->
          ${thisBook.coverImage}`

          if (linkType == "purchase") {
          renderedBook += `
            <a href="${ISBNLink}" class="mx-auto my-6 text-xl sm:text-2xl font-bold text-[#79BEFE] hover:underline; hover:decoration-wavy hover:decoration-amber-500	">
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
          renderedBook += `<aside class="mt-12 bg-blue-100 px-6 py-6">${fullContext}</aside>`;
        }
  
        renderedBook += `
          </div>
          <div id="${thisBook.slug}-image" class="w-full sm:w-1/3 not-prose my-6 px-6">
          <!-- {{ processedCoverImage | safe }} -->
            ${thisBook.coverImage}
          </div>
        </div>`;
  
        break;  
    case "textlink":
    default:
      displayText = !displayText ? thisBook.title : displayText;
      renderedBook = `<a href="${ISBNLink}">${displayText}</a>`;
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
};
