module.exports = {
  content: [
    './_site/**/*.html',
    './src/**/*.{html,js,njk,md}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
