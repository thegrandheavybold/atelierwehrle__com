import fs from "node:fs";
import path from "node:path";

const IMAGE_ROOT = path.resolve(process.cwd(), "src/assets/img");
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const SOF_MARKERS = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
  0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (EXTENSIONS.has(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

function readPngSize(buffer) {
  if (buffer.length < 24) return null;
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readJpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) return null;
    if (SOF_MARKERS.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
}

function getSize(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);
  if (ext === ".png") return readPngSize(buffer);
  if (ext === ".jpg" || ext === ".jpeg") return readJpegSize(buffer);
  return null;
}

function buildImageDimensionMap() {
  const map = {};
  const files = walk(IMAGE_ROOT);
  for (const filePath of files) {
    const name = path.basename(filePath);
    const size = getSize(filePath);
    if (size && size.width > 0 && size.height > 0) {
      map[name] = size;
    }
  }
  return map;
}

const imageDimensionMap = buildImageDimensionMap();

export function getImageDimensions(imageName) {
  return imageDimensionMap[imageName] || null;
}
