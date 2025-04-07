import moment from "moment";
import { EleventyI18nPlugin } from "@11ty/eleventy";

import picture from "./src/js/picture.js";
import lazyPicture from "./src/js/lazyPicture.js";
import lazySwiper from "./src/js/lazySwiper.js";


export default function (eleventyConfig) {

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
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy("./src/google20e2595b65a4949d.html");

  
  // Shortcodes for Pictures
  eleventyConfig.addShortcode("picture", picture);
  eleventyConfig.addShortcode("lazypicture", lazyPicture);
  eleventyConfig.addShortcode("lazyswiper", lazySwiper);
  //Shortcode for ©copyrights year output
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // date filter (localized)
  eleventyConfig.addNunjucksFilter("date", function (date, format, locale) {
    locale = locale ? locale : "en";
    moment.locale(locale);
    return moment(date).format(format);
  });

  // Collections
  eleventyConfig.addCollection("gaerten_de", (collection) => 
    collection.getFilteredByGlob("./src/de/gaerten/*.njk")
  );

  eleventyConfig.addCollection("gaerten_en", (collection) => 
    collection.getFilteredByGlob("./src/en/gaerten/*.njk")
  );

  // i18n
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
		defaultLanguage: "de",

		// Rename the default universal filter names
		filters: {
			// transform a URL with the current page’s locale code
			url: "locale_url",

			// find the other localized content for a specific input file
			links: "locale_links"
		},

		// When to throw errors for missing localized content files
		errorMode: "strict"
	});


  //Config object.
  return {
    dir: {
      input: "src",
      output: "dist",
      data: "_data"
    }
  };

}