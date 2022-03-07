const formattedContext = (thisBook) => {
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

module.exports = formattedContext;