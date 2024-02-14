module.exports = {
  plugins: {
    "postcss-import":{},
    // "postcss-preset-env": {
    //   autoprefixer: {
    //     flexbox: "no-2009",
    //   },
    //   stage: 3,
    //   features: {
    //     "custom-properties": false,
    //   },
    // },
    "tailwindcss/nesting": {},
    "tailwindcss/nesting": {},
    "postcss-nesting": {},
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {}
  },
  // plugins: [
  //   require("postcss-import"),
  //   require("tailwindcss/nesting"),
  //   require("postcss-nesting"),
  //   require("tailwindcss"),
  //   require("autoprefixer"),
  // ]
}
