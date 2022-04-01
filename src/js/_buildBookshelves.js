const commerce = require("../_data/commerce.json");
const booksOnShelves = require("../_data/booksOnShelves.json");

class Book {
    constructor(id, shelf, shelfEntry) {
        //TODO make sure ID is ISBN or spit out an ISBN

        this.id = id;
        const bookData = shelfEntry
            ? shelfEntry
            : booksOnShelves.books.find((element) => element.ISBN == this.id);
        if (!bookData) {
            this.error = `Bad input: didn't find any data for ${id}`;
            return;
        }

        this.shelf = shelf || null;
        const masterShelf = bookData.shelves.find(
            (element) => element.shelf == "masterShelf"
        );
        let shelfDetails = {};
        bookData.shelves.forEach((shelfEntry) => {
            let add = shelfEntry.details;
            // TODO : attribute the description to a shelf
            // if (shelfEntry.details.description && (shelfEntry.shelf != "masterShelf")) {
            //   const thisShelfInfo = booksOnShelves.shelves.find(
            //     (element) => element.shelfID == shelfEntry.shelf
            //   );
            //    const shelfLink = ` (<a href="/${shelfEntry.shelf}">${thisShelfInfo.shelfTitle}</a>)`
            //   shelfEntry.details.description += shelfLink

            // }
            shelfDetails = { ...shelfDetails, ...add };
        });
        const { shelfLabel, ...shelfDetailsToAdd } = shelfDetails; //remove shelf-specific stuff that should move upwards

        const details = masterShelf
            ? {
                ...bookData.google,
                ...bookData.bookshopOrg,
                ...bookData.image,
                ...shelfDetailsToAdd,
                ...masterShelf.details,
            }
        : {
                ...bookData.google,
                ...shelfDetailsToAdd,
                ...bookData.bookshopOrg,
                ...bookData.image,
            };
        details.isbn10 = bookData.identifiers.isbn[0];
        details.inventoryInfo = bookData.inventoryInfo
            ? bookData.inventoryInfo
            : null;
        this.details = details;

        // if we know the shelf, prioritize the details for that shelf
        if (this.shelf) {
            const shelfInfo = booksOnShelves.shelves.find(
                (element) => element.shelfID == this.shelf
            );
            const shelfData = bookData.shelves.find(
                (element) => element.shelf == this.shelf
            );
            if (shelfData) {
                this.details = {
                    ...this.details,
                    ...shelfInfo,
                    ...shelfData.details,
                };
            }
        }

        this.contexts = buildContexts(bookData, this.details.title, this.shelf);
    }
}

const buildBook = (ISBN, shelf, shelfEntry) => {
    let book = new Book(ISBN, shelf, shelfEntry);
    return book;
};

const buildLink = async (id, bookLink, conversionPath, isbn10) => {
    if (/::/.test(bookLink)) {
        linkComponents = bookLink.split(new RegExp("[::]"));
        linkType = linkComponents[0];
        linkValue = linkComponents[2];
    } else {
        linkType = bookLink;
        linkValue = conversionPath ? conversionPath : "default";
    }

    let commercePath = commerce.conversions.find(
        (item) => item.pathName === linkValue
    );

    link =
        commercePath != undefined
            ? commercePath.pathURL.includes("[isbn10]")
                ? commercePath.pathURL.replace("[isbn10]", isbn10)
                : commercePath.pathURL.replace("[ISBN]", id)
            : /^a\d+$/i.test(linkValue)
            ? `${commerce.bookshoporgLink}${linkValue.substring(1)}/${id}`
            : link;
    if (commercePath != undefined) {
        linkText = commercePath.pathLinkText;
    }

    // Ssubstitute a safer link if it looks like bookshop.org is coming up empty and we were trying to write a link there.
    const checkLink = (link, linkText) => {
        const linkURL = new URL(link);
        let thisBook = booksOnShelves.books.find((element) => element.ISBN == id);  
        let fallbackCommercePath = commerce.conversions.find(
            (item) => item.pathName === "fallback"
        );

        if ((linkURL.hostname == 'bookshop.org') && (thisBook.bookshopOrg.cover == "404")) {
            link = fallbackCommercePath.pathURL.replace("[ISBN]", id);
            linkText = fallbackCommercePath.pathLinkText
        }
        return { link, linkText }

    }

    return checkLink(link, linkText)
};

const buildContexts = (bookData, title, thisShelf) => {
    if (!bookData.shelves) {
        let error = `Bad input: didn't find any data for ${title}`;
        return;
    }
    const shelvesForContext = bookData.shelves.filter(
        (shelfEntry) => shelfEntry.shelf != "masterShelf"
    );

    let allContexts = [];

    collectContextDetails = (shelfEntry) => {
        // get details from json to build context
        const shelfInfo = booksOnShelves.shelves.find(
            // get details of the shelf
            (element) => element.shelfID == shelfEntry.shelf
        );

        const shelfData = bookData.shelves.find(
            (element) => element.shelf == shelfEntry.shelf
        );

        const {
            shelfLabel,
            attribution,
            shelfTitle,
            shelfID,
            shelfItems, // for later adding "allong with x number of other books"
            shelfDescription, // for future display options
            dateCreated,
            dateModified, // for flagging recently modified shelves
        } = { ...shelfInfo, ...shelfData.details };

        return {
            title,
            shelfID,
            shelfTitle,
            attribution: attribution || "",
            shelfLabel: shelfLabel || "",
            shelfItems,
            dateCreated,
            dateModified,
        };
    };

    shelvesForContext.forEach((shelfEntry) =>
        allContexts.push(collectContextDetails(shelfEntry))
    );
    const otherContexts = allContexts.filter(
        (context) => context.shelfID != thisShelf
    );
    const data = { all: allContexts, other: otherContexts };

    const createVerboseContexts = (contexts, isOther) => {
        // make a readable version of the context details
        displayContexts = [];
        for (let i = 0; i < contexts.length; i++) {
            const {
                title,
                shelfLabel,
                attribution,
                shelfTitle,
                shelfID,
                shelfItems,
            } = contexts[i];

            const ifTitle =
                i === 0
                    ? `<strong><em>${title}</em></strong>`
                    : i === 1
                    ? `It`
                    : "";

            const ifAlso = i === 1 || (isOther && i === 0) ? " also" : "";

            const shelfAction = attribution
                ? ` was${ifAlso} added`
                : ` is${ifAlso} on the`;

            const byAttribution = attribution ? ` by ${attribution} to` : "";

            const shelf = ` the <a href="/${shelfID}">${shelfTitle}</a> shelf`; // shelfType newsletter one day

            const asLabel = shelfLabel ? ` as "${shelfLabel}"` : "";

            const otherItems = shelfItems.length - 1;
            const withOthers = isOther ? ` with ${otherItems} other books` : "";

            const contextPunctuation =
                i === 0 || i == contexts.length - 1
                    ? `. `
                    : contexts.length - 1
                    ? " and"
                    : ", ";

            displayContext = `${ifTitle}${shelfAction}${byAttribution}${shelf}${asLabel}${withOthers}${contextPunctuation}`;
            displayContexts.push(displayContext);
        }

        return displayContexts.join("");
    };

    let verbose = {
        all: createVerboseContexts(allContexts, false),
        other: createVerboseContexts(otherContexts, true),
    };

    return { data, verbose };
};

module.exports.buildBook = buildBook;
module.exports.buildLink = buildLink;
module.exports.buildContexts = buildContexts;
