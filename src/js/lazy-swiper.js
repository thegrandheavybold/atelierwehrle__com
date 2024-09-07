// Generate an picture tag with image src URLs which use Neltify image transforms

module.exports = (ImageName, ImageAlt) => {
  return `<picture>
            <source data-srcset="/assets/img/${ImageName}" media="(min-width: 1025px)">
            <source data-srcset="/assets/img/${ImageName}?nf_resize=fit&w=1024" media="(min-width: 769px)">
            <source data-srcset="/assets/img/${ImageName}?nf_resize=fit&w=768" media="(min-width: 481px)">

            <source data-srcset="/assets/img/${ImageName}?nf_resize=fit&w=1024" media="(orientation: portrait) and (max-height: 920px)">

            <img loading="lazy" data-src="/assets/img/${ImageName}?nf_resize=fit&w=480" alt="${ImageAlt}" type="image/jpg"/>
          </picture>`;
};
