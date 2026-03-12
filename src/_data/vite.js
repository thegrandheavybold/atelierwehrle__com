import fs from "node:fs";
import path from "node:path";

const FALLBACK = {
  js: null,
  css: [],
  imports: [],
};

function buildImportList(manifest, entry) {
  const visited = new Set();
  const files = [];

  function walk(current) {
    if (!current || !Array.isArray(current.imports)) {
      return;
    }

    current.imports.forEach((key) => {
      if (visited.has(key) || !manifest[key] || !manifest[key].file) {
        return;
      }

      visited.add(key);
      files.push(manifest[key].file);
      walk(manifest[key]);
    });
  }

  walk(entry);
  return files;
}

export default function vite() {
  const manifestPath = path.resolve(process.cwd(), "src/_generated/manifest.json");

  if (!fs.existsSync(manifestPath)) {
    return FALLBACK;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const entry =
    manifest["src/js/main.js"] ||
    Object.values(manifest).find((item) => item && item.isEntry);

  if (!entry || !entry.file) {
    return FALLBACK;
  }

  return {
    js: entry.file,
    css: entry.css || [],
    imports: buildImportList(manifest, entry),
  };
}
