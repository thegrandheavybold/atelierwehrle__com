// Generate an picture tag with image src URLs which use Neltify image transforms

module.exports = (ImageName, ImageAlt) => {
  return `<picture>       
            <img src=".netlify/images?url=/assets/img/${ImageName}&fm=webp" alt="${ImageAlt}" />
          </picture>`;
};
