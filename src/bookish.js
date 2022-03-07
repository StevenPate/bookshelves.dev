
// function getBookIdentifiers(id, type="ISBN") {
//   if (!id || !type) {
//     console.log({ error: "Bad request" });
//     return { error: "Bad request" };
//   }
//   console.log(id, type);
// }
// getBookIdentifiers("123");

const got = require("got");

// base = "https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys="

async function getType(type="ISBN", val="9780375868009") {
  try {
  //   const url = `${base}${type}:${val}`;
    // const url = `https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:9780375868009`;
    // let something = await got(url);

    // console.log(something);


    const {body} = await got(
      'https://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:9780375868009'
    ).json();
      
      console.log(body);


  } catch (e) {
    console.log(e);
    return null;
  }
}

getType();