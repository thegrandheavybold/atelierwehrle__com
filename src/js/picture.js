// Generate an picture tag with image src URLs which use Neltify image transforms

module.exports = (ImageName, ImageAlt) => {
  return `<picture>
            <source srcset="/.netlify/images?url=/assets/img/${ImageName}&width=1920" media="(min-width: 1025px)">
            <source srcset="/.netlify/images?url=/assets/img/${ImageName}&width=1024" media="(min-width: 769px)">
            <source srcset="/.netlify/images?url=/assets/img/${ImageName}&width=768" media="(min-width: 481px)">

            <img src="/.netlify/images?url=/assets/img/${ImageName}&width=480" alt="${ImageAlt}" />
          </picture>`;
};
