<p align="center">
  <h3 align="center">vbz: The AI-Era's Semantic Image Compression Standard</h3>
  <p align="center"><i>"Why store pixels when you can store vibes?"</i></p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/lossiness-100%25%20vibe%20drift-ff69b4.svg" alt="Lossiness">
  <img src="https://img.shields.io/badge/compression%20ratio-99.99%25-brightgreen.svg" alt="Compression Ratio">
  <img src="https://img.shields.io/badge/shannon%20entropy-DEPRECATED-red.svg" alt="Entropy">
  <img src="https://img.shields.io/badge/weissman%20score-420.69-blueviolet.svg" alt="Weissman Score">
  <img src="https://img.shields.io/badge/npm-v0.1.0-informational.svg" alt="npm">
  <img src="https://img.shields.io/badge/dependencies-0-success.svg" alt="Dependencies">
</p>

---

## 🌌 The Concept

**`vbz`** is the official Node.js reference implementation of VibeCompress.

Instead of cowardly mathematical compression algorithms like JPEG or PNG that obsess over keeping pixels recognizable, `vbz` replaces them with pure semantics:
1. **Compress**: A Vision-Language model (`gpt-4o`) describes your image in detail. That text is gzipped into a tiny `.vbz` container.
2. **Decompress**: A diffusion model (`dall-e-3`) dreams the image back into existence from the description.

Compression ratio: **99.99%**.

---

## ⚡ Zero Dependencies

`vbz` has **zero external dependencies**. It relies entirely on native Node.js standard libraries (`node:zlib`, `node:fs`, `node:util`, and global `fetch`). Zero `node_modules` clutter.

---

## 🚀 Usage

### 1. Instant Run via `npx`
```bash
export VBZ_API_KEY="sk-..."

# Compress
npx vbz compress -i photo.jpg

# Decompress
npx vbz expand -i photo.vbz
```

### 2. Global Install
```bash
npm install -g vbz
vbz compress -i photo.jpg
vbz expand -i photo.vbz
```

### 3. Programmatic API
```javascript
import { compressImage, decompressImage, OpenAIClient } from 'vbz';

const client = OpenAIClient.fromEnv();

// Compress photo.jpg -> photo.vbz
await compressImage('photo.jpg', 'photo.vbz', client);

// Decompress photo.vbz -> restored.png
await decompressImage('photo.vbz', 'restored.png', client);
```

---

## 🛠️ CLI Options

| Flag | Description |
| :--- | :--- |
| `-i, --input <file>` | Path to input file (required) |
| `-o, --output <file>` | Path to output file (default: auto-detected) |
| `-s, --stub` | Offline mock mode (no API keys, zero network) |
| `-t, --text` | Inspect decompressed vibe text without generating an image |
| `-p, --prompt <text>` | Query the stored description using an LLM |
| `-k, --api-key <key>` | API key override |
| `-b, --base-url <url>` | LLM/vision base URL override |
| `--image-base-url <url>` | Image generation base URL override |
| `-m, --model <name>` | Vision model (default: `gpt-4o`) |
| `--image-model <name>` | Image model (default: `dall-e-3`) |

---

## ⚙️ Environment Variables

- `VBZ_API_KEY` (fallback: `OPENAI_API_KEY`)
- `VBZ_BASE_LLM_URL` (fallback: `OPENAI_BASE_URL`, default: `https://api.openai.com/v1`)
- `VBZ_BASE_IMAGE_URL` (fallback: `VBZ_BASE_LLM_URL`)
- `VBZ_LLM_MODEL` (default: `gpt-4o`)
- `VBZ_IMAGE_MODEL` (default: `dall-e-3`)

---

## 📜 License

MIT. Go forth and compress reality.
