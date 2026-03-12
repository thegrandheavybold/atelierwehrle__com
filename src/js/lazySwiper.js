import imageMarkup from "./imageMarkup.js";

// Slider images: lazy by default, with optional eager/fetchpriority overrides.
export default function lazySwiper(
  ImageName,
  ImageAlt,
  loading = "lazy",
  fetchPriority = "auto",
  width = 1600,
  height = 900
) {
  return imageMarkup({
    imageName: ImageName,
    imageAlt: ImageAlt,
    loading,
    fetchPriority,
    width,
    height,
    fallbackWidth: 1600,
    widths: [480, 800, 1200, 1600, 1920],
    sizes: "(max-width: 767px) 100vw, (max-width: 1439px) 92vw, 1600px",
  });
}


