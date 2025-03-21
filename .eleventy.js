module.exports = function(eleventyConfig) {

   const moment = require("moment");

  eleventyConfig.addPassthroughCopy("./src/js/main.js");
  eleventyConfig.addPassthroughCopy("./src/js/main-min.js");
  eleventyConfig.addPassthroughCopy("./src/js/main-min.js.map");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/style.css");
  eleventyConfig.addPassthroughCopy("./src/style.css.map");
  eleventyConfig.addPassthroughCopy("./src/icon.svg");
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/icon-192.png");
  eleventyConfig.addPassthroughCopy("./src/icon-512.png");
  eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");
  eleventyConfig.addPassthroughCopy("./src/_headers");
  eleventyConfig.addPassthroughCopy("./src/_redirects");

  //118n Internationalization
  const { EleventyI18nPlugin } = require("@11ty/eleventy");

  module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
      // any valid BCP 47-compatible language tag is supported
      defaultLanguage: "en", // Required, this site uses "en"

      // Rename the default universal filter names
      filters: {
        // transform a URL with the current page’s locale code
        url: "locale_url",

        // find the other localized content for a specific input file
        links: "locale_links",
      },

      // When to throw errors for missing localized content files
      errorMode: "strict", // throw an error if content is missing at /en/slug
      // errorMode: "allow-fallback", // only throw an error when the content is missing at both /en/slug and /slug
      // errorMode: "never", // don’t throw errors for missing content
    });
  };
  
  // A responsive image helper using Netlify Large Media - image transformation
  eleventyConfig.addShortcode("picture", require("./src/js/picture.js"));

  // A lazy loading image helper using Netlify Large Media - image transformation
  eleventyConfig.addShortcode("lazypicture", require("./src/js/lazy-picture.js"));

  // A lazy loading image helper using Netlify Large Media - image transformation
  eleventyConfig.addShortcode("lazyswiper", require("./src/js/lazy-swiper.js"));

  // date filter (localized)
  eleventyConfig.addNunjucksFilter("date", function (date, format, locale) {
    locale = locale ? locale : "en";
    moment.locale(locale);
    return moment(date).format(format);
  });

  //©copyrights year output
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);


  //Gaerten Collections
  module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("gaerten_de", function (collection) {
    return collection.getFilteredByGlob("./src/de/gaerten/*.njk");
  });
  };

  module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection("gardens_en", function (collection) {
      return collection.getFilteredByGlob("./src/en/gardens/*.njk");
    });
  };


  // You can return your Config object (optional).
  return {
    dir: {
      input: "src",
      output: "dist",
      data: "_data"
    }
  };

};
