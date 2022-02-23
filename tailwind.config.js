const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    './_site/**/*.html',
    './src/**/*.{html,js,njk,md}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Montserrat",
          "ui-sans-serif",
          "system-ui",
          ...defaultTheme.fontFamily.sans,
        ],
        serif: [
          "Lora",
          "ui-serif",
          "Georgia",
          ...defaultTheme.fontFamily.serif,
        ],
        Lora: ["Lora"],
        Montserrat: ["Montserrat"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#52525b",
            a: {
              // 'text-decoration': 'none',
              color: "#3182ce",
              "&:hover": {
                color: "#2c5282",
                "text-decoration-style": "wavy !important",
              },
              "text-decoration-color": "#f59e0b",
            },
            h1: {
              // 'text-decoration': 'none',
              // "font-size": "6rem !important",
              // color: "#52525b",
              // "margin-bottom": ".3rem !important",
            },
            h2: {
              // 'text-decoration': 'none',
              // "font-family": "Montserrat !important",
              // "font-size": "3rem !important",
              // color: "#52525bc7",
              // "margin-bottom": ".1rem !important",
            },
            h3: {
              "margin-bottom": "0.1rem !important",
              color: "#52525bc7",
            },

          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
