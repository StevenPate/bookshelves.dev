const book = require("./_book");

// grabBook = async (ISBN) => {
//   return await book(ISBN, "full");
// }


// shelf = async (shelfID, shelfEntries, format = "full", bookLink = "external") => {
//     console.log(shelfID, format)
//     if (!shelfEntries) {
//       console.log(`go get shelfEntries from data`)
//     }
//     // console.log(shelfEntries);
//     // let ISBNsToProcess = shelfEntries.map((entry)=> entry.ISBN);
//     // console.log(ISBNsToProcess);
//     let booksToDisplay =[]
//     shelfEntries.forEach(shelfEntry => { 
//       console.log(shelfEntry.ISBN)
//       let thing = grabBook("9780374157357");
//       console.log(thing);
//       // return book(shelfEntry.ISBN, "full");
//     });
//     console.log(booksToDisplay);

//     if (format == "shelfDescriptionsOnly") {
//       console.log(`break up the shelfEntries`)
//     }
//     return "well."

// }


const getBook = async (ISBN) => {
  let bookData = await book(ISBN, "full");
  return {bookData}
}

const shelf = async (shelfID, shelfEntries, format = "full", bookLink = "external") => {
  console.log(shelfEntries);
  let placeholder =[];
  for (let i = 0; i < shelfEntries.length; i++) {  // use promise.all or something better here
    bookData = await getBook(shelfEntries[i].ISBN)
    .then(value => placeholder.push(value))
  }
  console.log(placeholder);
  return placeholder
}

module.exports = shelf; 