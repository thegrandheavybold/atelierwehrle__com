import moment from "moment";
import { EleventyI18nPlugin } from "@11ty/eleventy";
import markdownIt from "markdown-it";

import picture from "./src/js/picture.js";
import lazyPicture from "./src/js/lazyPicture.js";
import lazySwiper from "./src/js/lazySwiper.js";


export default function (eleventyConfig) {
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  });

  eleventyConfig.addPassthroughCopy({"./src/_generated/assets": "./assets"});
  eleventyConfig.addPassthroughCopy("./src/assets");
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
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
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

  eleventyConfig.addNunjucksFilter("markdown", function (content = "") {
    return md.render(content);
  });

   // Collections New for Gardens
  eleventyConfig.addCollection("gardens_de", (collection) => 
    collection.getFilteredByGlob("./src/gaerten/de/*.md")
  );

  eleventyConfig.addCollection("gardens_en", (collection) => 
    collection.getFilteredByGlob("./src/gaerten/en/*.md")
  );

  eleventyConfig.addCollection("team_de", (collection) =>
    collection
      .getFilteredByGlob("./src/team/de/*.md")
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999))
  );

  eleventyConfig.addCollection("team_en", (collection) =>
    collection
      .getFilteredByGlob("./src/team/en/*.md")
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999))
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
      includes: "_includes",
      data: "_data"
    }
  };

}
