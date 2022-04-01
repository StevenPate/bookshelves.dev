const Image = require("@11ty/eleventy-img");
module.exports = async function (
    src,
    cls = "",
    alt = "Alt text",
    sizes = "50vw"
) {
    if (src == null) {
        return;
    }
    if (src == undefined) {
        return;
    }
    let metadata = await Image(src, {
        widths: [400, 600],
        formats: ["webp", "avif", "jpeg"],
        urlPath: "/images/web/",
        outputDir: "./src/images/web/",
        cacheOptions: {
            duration: "1y",
            directory: "_cache",
        },
    });

    let imageAttributes = {
        class: cls,
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
        duration: "1y",
    };

    return Image.generateHTML(metadata, imageAttributes);
};
