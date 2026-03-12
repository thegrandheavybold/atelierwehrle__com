import { getImageDimensions } from "./imageDimensions.js";

function escapeAttr(value = "") {
  return String(value).replace(/"/g, "&quot;");
}

function titleCase(value = "") {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function deriveAltFromFilename(imageName = "") {
  const decoded = decodeURIComponent(String(imageName || ""));
  const basename = decoded.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") || "";
  const cleaned = basename
    .replace(/^atelier-wehrle-/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b(img|image|foto|photo)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "Garden image";
  return titleCase(cleaned);
}

function isGenericAltText(imageAlt = "") {
  const normalized = String(imageAlt || "").trim().toLowerCase();
  if (!normalized) return true;
  return /^atelier\s+wehrle\b/.test(normalized);
}

function resolveImageAlt(imageAlt = "", imageName = "") {
  const normalizedAlt = String(imageAlt || "").trim().replace(/\s+/g, " ");
  const filenameAlt = deriveAltFromFilename(imageName);

  if (!normalizedAlt) return filenameAlt;
  if (!isGenericAltText(normalizedAlt)) return normalizedAlt;

  if (normalizedAlt.toLowerCase() === "atelier wehrle") return filenameAlt;
  if (normalizedAlt.toLowerCase().includes(filenameAlt.toLowerCase())) return normalizedAlt;
  return `${normalizedAlt} - ${filenameAlt}`;
}

const isDevContext = process.env.CONTEXT === "dev";

function buildTransformSrc(imageName, width) {
  const sourcePath = encodeURIComponent(`/assets/img/${imageName}`);
  return `/.netlify/images?url=${sourcePath}&width=${width}`;
}

function buildSrcSet(imageName, widths) {
  return widths.map((width) => `${buildTransformSrc(imageName, width)} ${width}w`).join(",\n                ");
}

export default function imageMarkup({
  imageName,
  imageAlt = "",
  className = "",
  widths = [200, 400, 800, 1200],
  sizes = "(max-width: 450px) 200px, (max-width: 850px) 400px, (max-width: 1000px) 800px, 1200px",
  fallbackWidth = 1200,
  width = null,
  height = null,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
}) {
  const safeAlt = escapeAttr(resolveImageAlt(imageAlt, imageName));
  const safeClass = escapeAttr(className).trim();
  const safeLoading = escapeAttr(loading);
  const safeDecoding = escapeAttr(decoding);
  const safeFetchPriority = escapeAttr(fetchPriority);
  const safeSizes = escapeAttr(sizes);
  const encodedName = encodeURIComponent(imageName);
  const plainSrc = `/assets/img/${encodedName}`;
  const transformedSrc = buildTransformSrc(imageName, fallbackWidth);
  const defaultSrcSet = buildSrcSet(imageName, widths);
  const src = isDevContext ? plainSrc : transformedSrc;
  const srcsetAttr = isDevContext
    ? ""
    : `srcset="
                ${defaultSrcSet}"`;
  const sizesAttr = isDevContext ? "" : `sizes="${safeSizes}"`;
  const detectedSize = getImageDimensions(imageName);
  const resolvedWidth = Number(width) || detectedSize?.width || null;
  const resolvedHeight = Number(height) || detectedSize?.height || null;
  const dimensionAttrs =
    resolvedWidth && resolvedHeight
      ? `width="${resolvedWidth}" height="${resolvedHeight}"`
      : "";

  return `<picture${safeClass ? ` class="${safeClass}"` : ""}>
            <img
              ${srcsetAttr}
              ${sizesAttr}
              src="${src}"
              alt="${safeAlt}"
              ${dimensionAttrs}
              loading="${safeLoading}"
              decoding="${safeDecoding}"
              fetchpriority="${safeFetchPriority}"
            />
          </picture>`;
}
