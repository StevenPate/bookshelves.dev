// // NodeJS-based GROQ queries that are persisted into the filesystem
// const sanityClient = require("@sanity/client");
// const fs = require("fs");
// const path = require("path");

// // @TODO: Update with your project's config
// const client = sanityClient({
//   projectId: "21ci71b0",
//   dataset: "production",
//   apiVersion: "2022-10-09",
//   // As this runs in a static generation context, we can afford not using the CDN to always get the freshest data
//   useCdn: false,
// });

// // @TODO: write your GROQ queries here
// const QUERIES = [
//   {
//     filename: "books.json",
//     query: `*[_type == "book"]`,
//   },
//   {
//     filename: "shelves.json",
//     query: `*[_type == "shelf"]`,
//   },
//   {
//     filename: "newsletters.json",
//     query: `*[_type == "newsletter"]`,
//   },
//   // {
//   //   filename: "homepage.json",
//   //   query: `{
//   //     "hero": *[_type == "homepage"][0],
//   //     "genus": *[_type == "genus"][0..3],
//   //     "settings": *[_type == "settings"][0]
//   //   }`,
//   // },
// ];

// const promises = QUERIES.map(({ filename, query }) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // 1. Get the data from Sanity
//       const data = await client.fetch(query);

//       // 2. Save that as JSON to disk
//       fs.writeFileSync(
//         path.join("src/_data", filename),
//         JSON.stringify(data, null, 2)
//       );
//       resolve(true);
//     } catch (error) {
//       console.error(`${filename} went wrong`, error);
//       reject();
//     }
//   });
// });

// async function getData() {
//   await Promise.allSettled(promises);
// }

// getData();