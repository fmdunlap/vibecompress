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

# Compress image -> photo.vbz
npx vbz -i photo.jpg

# Decompress vibes -> photo.jpg (optimistically detects original format, defaults to .png)
npx vbz -i photo.vbz
```

### 2. Global Install
```bash
npm install -g vbz
vbz -i photo.jpg
vbz -i photo.vbz
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

### 🧠 Certified Vibe Encoders (Vision Models for `VBZ_LLM_MODEL`)

| Model | Wallet Damage (in / out) | Vibe/Cost Ratio | Certified Use Case |
| :--- | :--- | :--- | :--- |
| **GPT-5 mini** | `$0.125 / $1.00` | Lowest cost floor in existence | Bulk compressing 50,000 blurry receipts so your accountant knows you dined _somewhere_. |
| **Gemini Flash family** | Fractions of a cent | Paying with literal pocket lint | Massive multimodal context. Compresses a 4K frame while absorbing the entire Wikipedia summary of photography. |
| **Claude Haiku 4.5** | `$1 / $5` | Fast & punchy visual extraction | High-volume screenshot triage and saving screenshots of heated Discord debates before they get deleted. |
| **Claude Sonnet 5** | `$2 / $10` | The gold standard default | Reliable document, diagram, and UI reasoning. Notices the subtle contempt in your cat's eyes and logs its hex color. |
| **GPT-5** | `$2.50 / $20` | Requires CFO sign-off | Heavyweight visual reasoning. Deduces the camera's shutter speed and the photographer's existential angst. |
| **Claude Opus 5** | `$5 / $25` | Second mortgage territory | High-stakes visual philosophy. Doesn't just encode pixels—it grieves for their destruction. Reserve for fine art. |

### 🎨 Certified Vibe Hallucinators (Generators for `VBZ_IMAGE_MODEL`)

| Model | API Toll | Vibe-per-Penny | Ideal Hallucination Vector |
| :--- | :--- | :--- | :--- |
| **FLUX Schnell** | `~$0.003 / image` | Cheaper than dirt | 4-step turbo speedrun. Decompresses before your terminal cursor finishes blinking. Great for throwaway drafts. |
| **GPT Image 1 Mini** | `$0.005 – $0.036` (1024²) | Excellent budget daydreaming | Low-cost reconstruction when your storage quota is zero and your bank balance is crying. |
| **FLUX.2 Klein** | `~$0.014 – $0.015 / image` | Peak rapid-prototyping value | Fast, clean, high-velocity vibe reconstitution for products that need to move fast and break anatomy. |
| **FLUX.2 Pro** | `~$0.03 / MP` | Strong production baseline | Rock-solid rendering. Anatomical restraint keeps finger counts reliably between 4 and 6. |
| **Gemini 3.1 Flash Lite Image** | `~$0.0336 / 1K images` | The volume bargain king | Sweet spot of penny-pinching cost and startling visual clarity. For when you need 1,000 images back before lunch. |
| **Gemini 3.1 Flash Image / Nano Banana 2** | `~$0.067 / 1K` (`$0.151` at 4K) | Unmatched 4K & text capability | Sharp text rendering, infographics, and 4K pore-level detail. Pure Nano Banana 2 cosmic energy. |
| **GPT Image 2** | `~$0.005 – $0.211` | Hyper-obedient prompt loyalty | Follows every adjective in the vibe description with terrifying precision. For high-fidelity dreamers. |
| **FLUX.2 Max** | `~$0.07 / MP` | Luxury corporate card tier | Pure A24 cinematic aura. Reconstructs your grainy webcam selfie into a 70mm Panavision masterpiece. |

---

## 📜 License

MIT. Go forth and compress reality.
