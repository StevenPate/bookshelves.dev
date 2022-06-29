const Image = require("@11ty/eleventy-img");

async function imageShortcode(
    src,
    cls,
    alt = "alt text",
    sizes = "(min-width: 760px) 600px, 300px"
) {
    if (alt === undefined) {
        // You bet we throw an error on missing alt (alt="" works okay)
        throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }

    let metadata = await Image(src, {
        widths: [300, 600],
        formats: ["webp", "avif", "jpeg"],
        urlPath: "/images/web/",
        outputDir: "./src/images/web/",
        cacheOptions: {
            duration: "1y",
            directory: "_cache",
        },
        fetchOptions: {
            headers: {
                // lol
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
            },
        },
    });

    let lowsrc = metadata.jpeg[0];
    let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

    return `<picture>
    ${Object.values(metadata)
        .map((imageFormat) => {
            return `  <source type="${
                imageFormat[0].sourceType
            }" srcset="${imageFormat
                .map((entry) => entry.srcset)
                .join(", ")}" sizes="${sizes}">`;
        })
        .join("\n")}
      <img
        src="${lowsrc.url}"
        alt="${alt}"
        class="${cls}"
        loading="lazy"
        decoding="async">
    </picture>`;
}

module.exports = imageShortcode;
