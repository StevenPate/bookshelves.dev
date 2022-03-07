const got = require("got");

// const identifiers = async (ISBN) => {}
// module.exports = identifiers

async function test(ISBN) {
  try {
    const {body} = await got(`https://api.bookish.tech/search?type=isbn&id=${ISBN}`);
    const bookishData = JSON.parse(body);
    // console.log(busybody);

    const {
      isbn,
      lccn,
      oclc,
      openlibrary,
      goodreads,
      isbn13
    } = bookishData['results'];

    const identifiers = {
      isbn,
      isbn13,
      lccn,
      oclc,
      openlibrary,
      goodreads
    }

    console.log(identifiers);
    return identifiers;

  } catch (error) {
    console.error(error);
  }
}

test("9780375868009");