import imageMarkup from "./imageMarkup.js";

// Generate SEO-friendly picture tags that work with Netlify image transforms.
export default function picture(
  ImageName,
  ImageAlt,
  loading = "lazy",
  fetchPriority = "auto",
  width = 1200,
  height = 800
) {
  return imageMarkup({
    imageName: ImageName,
    imageAlt: ImageAlt,
    className: "lazy lazy-initial",
    loading,
    fetchPriority,
    width,
    height,
    fallbackWidth: 1200,
    widths: [200, 400, 800, 1200],
  });
}
