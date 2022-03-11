const logMissing = (details) => {
  let missing = details;
  // console.log(`${missing.id} was used in a shortcode but not present on a shelf. Google data was fetched at build time and used.`)
  return missing;
}

module.exports.logMissing = logMissing;