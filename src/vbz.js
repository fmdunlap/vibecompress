import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

/**
 * Stub model for offline testing without credentials or network calls.
 */
export class StubModel {
  async describeImage(_imageBuffer, _filename) {
    return '[STUB] Image description unavailable: configure an ImageDescriber provider.';
  }

  async generateImage(_prompt) {
    return Buffer.from('[STUB] Reconstructed image data unavailable: configure an ImageGenerator provider.');
  }

  async expandDescription(_description, _prompt) {
    return '[STUB] Expansion unavailable: configure a DescriptionExpander provider.';
  }
}

/**
 * Extracts the original filename stored in a gzip (RFC 1952) header if FNAME flag is set.
 */
export function readGzipFilename(buf) {
  if (!buf || buf.length < 10 || buf[0] !== 0x1f || buf[1] !== 0x8b) return null;
  const flags = buf[3];
  if (!(flags & 0x08)) return null; // FNAME flag not set
  let offset = 10;
  if (flags & 0x04) { // FEXTRA
    const xlen = buf.readUInt16LE(offset);
    offset += 2 + xlen;
  }
  let end = offset;
  while (end < buf.length && buf[end] !== 0) end++;
  return buf.toString('latin1', offset, end);
}

function writeGzipWithName(str, origName) {
  const gz = zlib.gzipSync(Buffer.from(str, 'utf-8'));
  if (!origName) return gz;
  const nameBuf = Buffer.from(path.basename(origName) + '\0', 'latin1');
  const header = Buffer.from(gz.subarray(0, 10));
  header[3] |= 0x08; // set FNAME flag
  return Buffer.concat([header, nameBuf, gz.subarray(10)]);
}

/**
 * Compresses a UTF-8 description string into a .vbz gzip file, optionally embedding the original filename.
 */
export async function writeVBZ(filePath, description, origName = '') {
  if (!description || typeof description !== 'string') {
    throw new Error('description is empty');
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const compressed = writeGzipWithName(description, origName);
  await fs.writeFile(filePath, compressed);
}

/**
 * Reads and decompresses a .vbz gzip file into a UTF-8 description string.
 */
export async function readVBZ(filePath) {
  const fileData = await fs.readFile(filePath);
  const decompressed = zlib.gunzipSync(fileData);
  return decompressed.toString('utf-8');
}

/**
 * Reads an image, describes it with describer, and writes a .vbz file.
 */
export async function compressImage(inputPath, outputPath, describer) {
  const image = await fs.readFile(inputPath);
  const description = await describer.describeImage(image, path.basename(inputPath));
  await writeVBZ(outputPath, description, path.basename(inputPath));
}

/**
 * Optimistically detects the output image path for decompressing a .vbz file.
 * Checks double extensions (e.g. photo.jpg.vbz), embedded gzip header filename, or falls back to .png.
 */
export async function detectDecompressedPath(inputPath, explicitOutput) {
  if (explicitOutput) return explicitOutput;

  const base = inputPath.endsWith('.vbz') ? inputPath.slice(0, -4) : inputPath;
  const knownExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff']);

  // 1. Check double extension (e.g. photo.jpg.vbz)
  const ext = path.extname(base).toLowerCase();
  if (knownExts.has(ext)) {
    return base;
  }

  // 2. Check gzip header
  try {
    const fileData = await fs.readFile(inputPath);
    const origName = readGzipFilename(fileData);
    if (origName) {
      const origExt = path.extname(origName).toLowerCase();
      if (knownExts.has(origExt)) {
        return `${base}${origExt}`;
      }
    }
  } catch {}

  // 3. Default to .png
  return `${base}.png`;
}

/**
 * Reads a .vbz file, generates an image from its description, and writes the reconstructed image.
 */
export async function decompressImage(inputPath, outputPath, generator) {
  const description = await readVBZ(inputPath);
  const imageBytes = await generator.generateImage(description);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, imageBytes);
}

/**
 * Reads a .vbz file and queries its description with an expander.
 */
export async function expandVBZ(inputPath, prompt, expander) {
  const description = await readVBZ(inputPath);
  return await expander.expandDescription(description, prompt);
}
