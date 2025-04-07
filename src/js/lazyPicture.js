// Generate an picture tag with image src URLs which use Neltify image transforms
export default function picture(ImageName, ImageAlt) {
  return `<picture class="lazy lazy-initial">
            <img
              srcset="
                /assets/img/200/${ImageName}   200w,
                /assets/img/400/${ImageName}   400w,
                /assets/img/800/${ImageName}   800w,
                /assets/img/1200/${ImageName} 1200w"

              sizes=" 
                (max-width: 450px) 200px,
                (max-width: 850px) 400px,
                (max-width: 1000px) 800px,
                1200px"

              src="/assets/img/1200/${ImageName}"
              alt="${ImageAlt}"
            />
          </picture>`;
}
