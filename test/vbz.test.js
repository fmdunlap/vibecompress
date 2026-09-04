import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {
  writeVBZ,
  readVBZ,
  compressImage,
  decompressImage,
  expandVBZ,
  StubModel,
} from '../src/vbz.js';

test('VBZ round trip write and read', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vbz-test-'));
  const filePath = path.join(tmpDir, 'test.vbz');
  const description = 'A majestic golden retriever sitting under an oak tree in golden hour sunlight.';

  await writeVBZ(filePath, description);
  const readBack = await readVBZ(filePath);

  assert.strictEqual(readBack, description);
  await fs.rm(tmpDir, { recursive: true });
});

test('compressImage uses describer and writes .vbz', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vbz-test-'));
  const inputPath = path.join(tmpDir, 'input.jpg');
  const outputPath = path.join(tmpDir, 'output.vbz');

  await fs.writeFile(inputPath, Buffer.from('fake-image-bytes'));

  let receivedImage = null;
  let receivedFilename = null;
  const mockDescriber = {
    async describeImage(buf, filename) {
      receivedImage = buf;
      receivedFilename = filename;
      return 'Mock detailed description';
    },
  };

  await compressImage(inputPath, outputPath, mockDescriber);

  assert.strictEqual(receivedFilename, 'input.jpg');
  assert.strictEqual(receivedImage.toString(), 'fake-image-bytes');

  const savedDesc = await readVBZ(outputPath);
  assert.strictEqual(savedDesc, 'Mock detailed description');

  await fs.rm(tmpDir, { recursive: true });
});

test('decompressImage uses generator and writes output image', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vbz-test-'));
  const inputPath = path.join(tmpDir, 'input.vbz');
  const outputPath = path.join(tmpDir, 'restored.png');

  await writeVBZ(inputPath, 'Photorealistic cyberpunk city skyline');

  let receivedPrompt = null;
  const mockGenerator = {
    async generateImage(prompt) {
      receivedPrompt = prompt;
      return Buffer.from('mock-png-bytes');
    },
  };

  await decompressImage(inputPath, outputPath, mockGenerator);

  assert.strictEqual(receivedPrompt, 'Photorealistic cyberpunk city skyline');
  const writtenBytes = await fs.readFile(outputPath);
  assert.strictEqual(writtenBytes.toString(), 'mock-png-bytes');

  await fs.rm(tmpDir, { recursive: true });
});

test('expandVBZ uses expander', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vbz-test-'));
  const inputPath = path.join(tmpDir, 'input.vbz');

  await writeVBZ(inputPath, 'A bowl of fresh apples and oranges');

  const mockExpander = {
    async expandDescription(desc, prompt) {
      return `Answer for "${prompt}" regarding: ${desc}`;
    },
  };

  const answer = await expandVBZ(inputPath, 'What fruits?', mockExpander);
  assert.strictEqual(answer, 'Answer for "What fruits?" regarding: A bowl of fresh apples and oranges');

  await fs.rm(tmpDir, { recursive: true });
});

test('StubModel smoke test', async () => {
  const stub = new StubModel();
  const desc = await stub.describeImage(Buffer.from(''), 'test.jpg');
  assert.match(desc, /\[STUB\]/);

  const img = await stub.generateImage('test prompt');
  assert.match(img.toString(), /\[STUB\]/);

  const exp = await stub.expandDescription('desc', 'prompt');
  assert.match(exp, /\[STUB\]/);
});

test('detectDecompressedPath optimistic detection', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vbz-test-'));

  // 1. Explicit output overrides everything
  const exp = await import('../src/vbz.js');
  const explicit = await exp.detectDecompressedPath('photo.vbz', 'custom.webp');
  assert.strictEqual(explicit, 'custom.webp');

  // 2. Double extension (photo.jpg.vbz)
  const doubleExt = await exp.detectDecompressedPath('photo.jpg.vbz');
  assert.strictEqual(doubleExt, 'photo.jpg');

  // 3. Gzip header filename detection
  const jpegVBZ = path.join(tmpDir, 'photo.vbz');
  await exp.writeVBZ(jpegVBZ, 'a photo description', 'original_camera.jpg');
  const detected = await exp.detectDecompressedPath(jpegVBZ);
  assert.strictEqual(detected, path.join(tmpDir, 'photo.jpg'));

  // 4. Fallback to .png
  const plainVBZ = path.join(tmpDir, 'plain.vbz');
  await exp.writeVBZ(plainVBZ, 'a description');
  const fallback = await exp.detectDecompressedPath(plainVBZ);
  assert.strictEqual(fallback, path.join(tmpDir, 'plain.png'));

  await fs.rm(tmpDir, { recursive: true });
});
