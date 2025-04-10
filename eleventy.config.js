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

  // Collections Old versions
  eleventyConfig.addCollection("gaerten_de", (collection) => 
    collection.getFilteredByGlob("./src/de/gaerten/*.njk")
  );

  eleventyConfig.addCollection("gaerten_en", (collection) => 
    collection.getFilteredByGlob("./src/en/gaerten/*.njk")
  );

   // Collections New for Gardens
  eleventyConfig.addCollection("gardens_de", (collection) => 
    collection.getFilteredByGlob("./src/gaerten/de/*.md")
  );

  eleventyConfig.addCollection("gardens_en", (collection) => 
    collection.getFilteredByGlob("./src/gaerten/en/*.md")
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
  
  //For Templating using picture shortcode and frontmatter
  // Split-Filter registrieren
  eleventyConfig.addFilter("split", function (str, delimiter) {
    return str.split(delimiter);
  });

  // Optional auch gleich "last" ergänzen:
  eleventyConfig.addFilter("last", function (arr) {
    if (Array.isArray(arr)) {
      return arr[arr.length - 1];
    }
    return arr;
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