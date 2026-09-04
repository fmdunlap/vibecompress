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
 * Compresses a UTF-8 description string into a .vbz gzip file.
 */
export async function writeVBZ(filePath, description) {
  if (!description || typeof description !== 'string') {
    throw new Error('description is empty');
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const compressed = zlib.gzipSync(Buffer.from(description, 'utf-8'));
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
  await writeVBZ(outputPath, description);
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
