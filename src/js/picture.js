// Generate an picture tag with image src URLs which use Neltify image transforms

module.exports = (ImageName, ImageAlt) => {
  return `<picture>
            <source srcset="/assets/img/${ImageName}&width=1920" media="(min-width: 1025px)">
            <source srcset="/assets/img/${ImageName}&width=1024" media="(min-width: 769px)">
            <source srcset="/assets/img/${ImageName}&width=768" media="(min-width: 481px)">

            <img src="/assets/img/${ImageName}&width=480" alt="${ImageAlt}" />
          </picture>`;
};
