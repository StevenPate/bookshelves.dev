const commerce = require("../_data/commerce.json");

const buildLink = (id, linkInfo, conversionPath) => {
  
  if (/::/.test(linkInfo)) {
    linkComponents = linkInfo.split(new RegExp("[::]"));
    linkType = linkComponents[0];
    linkValue = linkComponents[2];
  } else {
    linkType = linkInfo;
    linkValue = conversionPath ? conversionPath : "default";
  }

  let commercePath = commerce.conversions.find((item) => item.pathName === linkValue);

  link =
    commercePath != undefined
      ? commercePath.pathURL.replace("[ISBN]", id)
      : (/^a\d+$/i.test(linkValue))
        ? `${commerce.bookshoporgLink}${linkValue.substring(1)}/${id}`
        : link

  return link;
};

module.exports.buildLink = buildLink;
