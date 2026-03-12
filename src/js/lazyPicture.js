import imageMarkup from "./imageMarkup.js";

// Lazy picture variant with SEO/performance attributes.
export default function lazyPicture(
  ImageName,
  ImageAlt,
  fetchPriority = "auto",
  width = 1200,
  height = 800
) {
  return imageMarkup({
    imageName: ImageName,
    imageAlt: ImageAlt,
    className: "lazy lazy-initial",
    loading: "lazy",
    fetchPriority,
    width,
    height,
    fallbackWidth: 1200,
    widths: [200, 400, 800, 1200],
  });
}
