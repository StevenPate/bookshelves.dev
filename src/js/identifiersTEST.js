function identifiersTEST (input) {
  let fifteen = Promise.resolve(`we had an input of ${input}`);
  console.log(fifteen);
  return fifteen
}
function getIdentifiersResult(input) {
  identifiersTEST(input)
      .then(function(response) {
          return response;
      })
}
module.exports = function (ISBN) {
  const identifiers = getIdentifiersResult(ISBN);
  // console.log(identifiers);
  return identifiers
  // return identifiers;
};