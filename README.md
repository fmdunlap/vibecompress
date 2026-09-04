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
1. **Compress**: A Vision-Language model (`openai/gpt-4o-mini` by default) describes your image in detail. That text is gzipped into a tiny `.vbz` container.
2. **Decompress**: A generative image model (`black-forest-labs/flux.2-klein-4b` by default) dreams the image back into existence from the description.

Compression ratio: **98.8% – 99.7%**.

👉 **[View side-by-side visual comparisons in the Evidence Locker ➔](./examples/README.md)**

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
| `-m, --model <name>` | Vision model (default: `gpt-4o-mini`) |
| `--image-model <name>` | Image model (default: `dall-e-2`) |

---

## ⚙️ Environment Variables

- `VBZ_API_KEY` (fallback: `OPENAI_API_KEY`)
- `VBZ_BASE_LLM_URL` (fallback: `OPENAI_BASE_URL`, default: `https://api.openai.com/v1`)
- `VBZ_BASE_IMAGE_URL` (fallback: `VBZ_BASE_LLM_URL`)
- `VBZ_LLM_MODEL` (default: `gpt-4o-mini`)
- `VBZ_IMAGE_MODEL` (default: `dall-e-2`)

### ⚡ Running with OpenRouter (Unified Vision & Image Gen)
OpenRouter natively routes `/images` and `/images/generations` to 50+ image models:

```bash
export VBZ_API_KEY="sk-or-v1-..."
export VBZ_BASE_LLM_URL="https://openrouter.ai/api/v1"
export VBZ_BASE_IMAGE_URL="https://openrouter.ai/api/v1"
export VBZ_LLM_MODEL="openai/gpt-4o-mini"
export VBZ_IMAGE_MODEL="openai/gpt-image-1-mini"  # or black-forest-labs/flux.2-pro

npx vbz -i photo.jpg
npx vbz -i photo.vbz
```

> **Note on OpenRouter Image Model Slugs:** OpenRouter does not serve images under the legacy OpenAI names `dall-e-2` or `dall-e-3`. Set `VBZ_IMAGE_MODEL` to an OpenRouter slug (e.g. `openai/gpt-image-1-mini`, `black-forest-labs/flux.2-pro`). Discover all 50+ models via `curl -s https://openrouter.ai/api/v1/images/models | jq '.data[].id'`.

> **Safety-First Defaults (Protecting Your Wallet):**
> Because someone will inevitably run `vbz -i` on a folder of 10,000 photos by accident, VibeCompress defaults to the **cheapest supported models** out-of-the-box:
> - **Compression / Vision (`VBZ_LLM_MODEL`)**: **`gpt-4o-mini`** (~$0.0002 / image vs ~$0.004 for `gpt-4o` — 95% cheaper!)
> - **Decompression / Image Gen (`VBZ_IMAGE_MODEL`)**: **`dall-e-2`** ($0.020 / image vs $0.040+ for `dall-e-3` — 50% cheaper!)
>
> If you want premium fidelity, simply pass `-m gpt-4o --image-model dall-e-3` or set the environment variables.

### 🧠 Certified Vibe Encoders (Vision Models for `VBZ_LLM_MODEL`)

| Model | OpenRouter Slug | Wallet Damage (in / out) | Vibe/Cost Ratio | Certified Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **gpt-4o-mini (Default)** | `openai/gpt-4o-mini` | `$0.15 / $0.60` | Lowest damage to checking account | The default safety net. Costs fractions of a cent per image so your credit card limit remains unbothered. |
| **GPT-5 mini** | `openai/gpt-5-mini` | `$0.125 / $1.00` | Lowest cost floor in existence | Bulk compressing 50,000 blurry receipts so your accountant knows you dined _somewhere_. |
| **Gemini Flash family** | `google/gemini-2.5-flash` | Fractions of a cent | Paying with literal pocket lint | Massive multimodal context. Compresses a 4K frame while absorbing the entire Wikipedia summary of photography. |
| **Claude Haiku 4.5** | `anthropic/claude-3.5-haiku` | `$1 / $5` | Fast & punchy visual extraction | High-volume screenshot triage and saving screenshots of heated Discord debates before they get deleted. |
| **Claude Sonnet 5** | `anthropic/claude-sonnet-4` | `$2 / $10` | The gold standard alternative | Reliable document, diagram, and UI reasoning. Notices the subtle contempt in your cat's eyes and logs its hex color. |
| **gpt-4o** | `openai/gpt-4o` | `$2.50 / $10.00` | High-definition perception | Heavyweight visual workhorse. Knows the difference between a blueberry muffin and a chihuahua with 99.8% confidence. |
| **GPT-5** | `openai/gpt-5` | `$2.50 / $20` | Requires CFO sign-off | Heavyweight visual reasoning. Deduces the camera's shutter speed and the photographer's existential angst. |
| **Claude Opus 5** | `anthropic/claude-opus-4` | `$5 / $25` | Second mortgage territory | High-stakes visual philosophy. Doesn't just encode pixels—it grieves for their destruction. Reserve for fine art. |

### 🎨 Certified Vibe Hallucinators (Generators for `VBZ_IMAGE_MODEL`)

| Model | OpenRouter Slug | API Toll | Vibe-per-Penny | Ideal Hallucination Vector |
| :--- | :--- | :--- | :--- | :--- |
| **dall-e-2 (Default)** | *(OpenAI direct only)* | `~$0.020 / image` (1024²) | Half-price dream engine | The safety-first default. 50% cheaper than DALL-E 3 with delightfully unpredictable retro hallucinations. |
| **GPT Image 1 Mini** | `openai/gpt-image-1-mini` | `$0.005 – $0.036` (1024²) | Excellent budget daydreaming | Low-cost reconstruction when your storage quota is zero and your bank balance is crying. |
| **FLUX Schnell** | `black-forest-labs/flux.2-klein-4b` | `~$0.003 / image` | Cheaper than dirt | 4-step turbo speedrun. Decompresses before your terminal cursor finishes blinking. Great for throwaway drafts. |
| **FLUX.2 Pro** | `black-forest-labs/flux.2-pro` | `~$0.03 / MP` | Strong production baseline | Rock-solid rendering. Anatomical restraint keeps finger counts reliably between 4 and 6. |
| **Gemini 3.1 Flash Lite Image** | `google/gemini-3.1-flash-lite-image` | `~$0.0336 / 1K images` | The volume bargain king | Sweet spot of penny-pinching cost and startling visual clarity. For when you need 1,000 images back before lunch. |
| **Gemini 3.1 Flash Image / Nano Banana 2** | `google/gemini-3.1-flash-image` | `~$0.067 / 1K` (`$0.151` at 4K) | Unmatched 4K & text capability | Sharp text rendering, infographics, and 4K pore-level detail. Pure Nano Banana 2 cosmic energy. |
| **dall-e-3** | *(OpenAI direct only)* | `~$0.040 / image` (1024²) | The foundational classic | The engine that powers the meme. Dreams up lush, coherent reality from your compressed descriptions with iconic flair. |
| **GPT Image 2** | `openai/gpt-image-2` | `~$0.005 – $0.211` | Hyper-obedient prompt loyalty | Follows every adjective in the vibe description with terrifying precision. For high-fidelity dreamers. |
| **Seedream 5.0 Lite** | `bytedance-seed/seedream-5-0-lite` | `~$0.003 / image` | Pocket change surrealism | High-speed budget daydreamer from ByteDance. Fast, hyper-stylized decompression. |
| **FLUX.2 Max** | `black-forest-labs/flux.2-max` | `~$0.07 / MP` | Luxury corporate card tier | Pure A24 cinematic aura. Reconstructs your grainy webcam selfie into a 70mm Panavision masterpiece. |

---

## 📜 License

MIT. Go forth and compress reality.
