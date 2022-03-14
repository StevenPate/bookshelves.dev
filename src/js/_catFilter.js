
const booksOnShelves = require("../_data/booksOnShelves.json");

function categoryFilter(category) {
  let shelvesWithCat = booksOnShelves.shelves.filter((item => item.categories.includes(category)));
  const shelvesWithCatByID = shelvesWithCat.map(({shelfID})=> shelfID);
  let catBooks = []
  booksOnShelves.books.forEach(element => {
    const master = element.shelves.find(item => item.shelf == "masterShelf")
    if (master) {
      if (master.details.hasOwnProperty('categories') && master.details.categories.includes('kids')) {
        catBooks.push(element);
      }   
    }
    element.shelves.forEach(s => {
      if (shelvesWithCatByID.includes(s.shelf)) {
        catBooks.push(element);
      }
    });  
  })
let withCategory = [...new Set(catBooks)];

const withoutCategory = booksOnShelves.books.filter(el => {
  return withCategory.indexOf(el) === -1;
});

const booksWithCategory = {with: withCategory, without: withoutCategory}

  return booksWithCategory;
}




module.exports = categoryFilter;
