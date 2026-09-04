<p align="center">
  <h2 align="center">vbz: AI-Era Semantic Image Compression</h2>
  <p align="center"><i>"Why store pixels when you can store pure vibes?"</i></p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/lossiness-100%25%20vibe%20drift-ff69b4.svg" alt="Lossiness">
  <img src="https://img.shields.io/badge/compression%20ratio-98.8%25%20--%2099.7%25-brightgreen.svg" alt="Compression Ratio">
  <img src="https://img.shields.io/badge/shannon%20entropy-DEPRECATED-red.svg" alt="Entropy">
  <img src="https://img.shields.io/badge/weissman%20score-420.69-blueviolet.svg" alt="Weissman Score">
  <img src="https://img.shields.io/badge/dependencies-0%20(pure%20Node)-success.svg" alt="Dependencies">
  <img src="https://img.shields.io/badge/npm-npx%20vbz-informational.svg" alt="npx vbz">
  <img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="License">
</p>

---

**`vbz`** replaces traditional mathematical compression with pure generative hallucination:
1. **Compress**: A Vision-Language model (`openai/gpt-4o-mini`) describes your image in exhaustive detail. That text is gzipped into a tiny `.vbz` container (~1 KB).
2. **Decompress**: A generative image model (`black-forest-labs/flux.2-klein-4b`) dreams the image back into existence from the stored prompt.

Does the decompressed image match the original byte-for-byte? **Absolutely not.**  
Does it capture the vibes? **100%.**  
Did you just achieve a **99.6% compression ratio**? **Yes. You're welcome.**

---

## 🚀 Quickstart

Like `ffmpeg`, just point `-i` at your file. `vbz` auto-detects whether to compress or decompress:

```bash
# 1. Set your OpenRouter or OpenAI API Key
export VBZ_API_KEY="sk-or-v1-..."
export VBZ_BASE_LLM_URL="https://openrouter.ai/api/v1"
export VBZ_BASE_IMAGE_URL="https://openrouter.ai/api/v1"

# 2. Compress image -> photo.vbz (99%+ space saved)
npx vbz -i photo.jpg

# 3. Decompress vibes -> photo.png (hallucinates image back into existence)
npx vbz -i photo.vbz
```

> **No API key?** Try the offline mock mode with `-s` / `--stub`:
> ```bash
> npx vbz -s -i photo.jpg
> ```

---

## 🖼️ Visual Proof & Real-World Examples

Real results generated from license-free Unsplash reference assets using the default stack (`openai/gpt-4o-mini` + `black-forest-labs/flux.2-klein-4b`):

| Original Input (`.jpg` / `.png`) | Reconstructed Vibe (`.vibe.png`) | Asset & Statistics |
| :---: | :---: | :--- |
| <img src="./examples/illustration_guitar_guy.png" width="240" alt="Original Illustration" /> | <img src="./examples/illustration_guitar_guy.vibe.png" width="240" alt="Restored Vibe" /> | **Guitar Guy Illustration**<br>• Original: `287.6 KB`<br>• `.vbz`: **`1,259 bytes`**<br>• Saved: **99.56% (228.4×)**<br>• *Verdict: Pure acoustic joy intact.* |
| <img src="./examples/puffin.jpg" width="240" alt="Original Puffin" /> | <img src="./examples/puffin.vibe.png" width="240" alt="Restored Puffin" /> | **Solitary Ocean Puffin**<br>• Original: `108.5 KB`<br>• `.vbz`: **`1,091 bytes`**<br>• Saved: **98.99% (99.5×)**<br>• *Verdict: Regal beak dignity preserved.* |
| <img src="./examples/red_shirt_girl.jpg" width="240" alt="Original Red Shirt Girl" /> | <img src="./examples/red_shirt_girl.vibe.png" width="240" alt="Restored Red Shirt Girl" /> | **Red Shirt Girl at Café**<br>• Original: `330.4 KB`<br>• `.vbz`: **`1,193 bytes`**<br>• Saved: **99.64% (276.9×)**<br>• *Verdict: 10/10 confident café aura.* |

### 📊 Full Benchmark Suite

| Test Asset | Original Size | Compressed `.vbz` | Space Saved | Compression Factor | Restored Size | Vibe Fidelity Rating |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`red_shirt_girl.jpg`** | 330.4 KB | **1,193 bytes** | **99.64%** | **276.9×** | 356.3 KB | 🟢 Relaxed confidence; café ambiance intact |
| **`illustration_guitar_guy.png`** | 287.6 KB | **1,259 bytes** | **99.56%** | **228.4×** | 180.0 KB | 🟢 Boy strumming guitar with joy |
| **`soda_statue.jpg`** | 171.9 KB | **1,364 bytes** | **99.21%** | **126.1×** | 235.5 KB | 🟢 Translucent carbonated humanoid |
| **`puffin.jpg`** | 108.5 KB | **1,091 bytes** | **98.99%** | **99.5×** | 228.8 KB | 🟢 Regal orange beak; ocean solitude |
| **`construction_rendering.jpg`** | 128.0 KB | **1,493 bytes** | **98.83%** | **85.7×** | 290.0 KB | 🟢 Floating brickwork surrealism |
| **`spiffo.png`** *(Meme Mascot)* | 355.0 KB | **1,023 bytes** | **99.72%** | **355.0×** | 226.0 KB | 🟢 Spiky wooden club; 100% raccoon energy |

👉 **[Inspect all side-by-side proofs and decoded prompt containers in the Evidence Locker ➔](./examples/README.md)**

---

## 🌌 The Manifesto: Ontological Compression

For over 70 years, cowardly engineers have operated under the oppressive regime of **Claude Shannon’s Source Coding Theorem**. They quibble over discrete cosine transforms, Huffman trees, chroma subsampling, and arithmetic coding just to shave 14% off a JPEG.

**`vbz` introduces the post-entropy era.**

We do not compress pixels. Pixels are fleeting material illusions. We compress **the essence of the scene**—the vibe.

### 📐 Architecture Flow

```
┌─────────────────┐       Vision Model        ┌──────────────────────┐       gzip        ┌────────────┐
│   photo.jpg     │  ───────────────────────► │ "Golden retriever in │ ───────────────►  │  photo.vbz │
│    330 KB       │   (openai/gpt-4o-mini)    │ golden hour light..."│                   │   1.1 KB   │
└─────────────────┘                           └──────────────────────┘                   └────────────┘
                                                                                               │
   =================================== 10 YEARS IN COLD STORAGE ===============================│
                                                                                               ▼
┌─────────────────┐     Generative Model      ┌──────────────────────┐      gunzip       ┌────────────┐
│ photo_vibe.png  │  ◄─────────────────────── │ "Golden retriever in │ ◄──────────────── │  photo.vbz │
│    356 KB       │  (flux.2-klein-4b)        │ golden hour light..."│                   │   1.1 KB   │
└─────────────────┘                           └──────────────────────┘                   └────────────┘
 (1 extra paw, but
  immaculate vibe)
```

---

## 📊 Industry Benchmarks (The Weissman Showdown)

Benchmark run on a 5.4 MB 4K photograph of a picnic in Central Park:

| Format | Output Size | Compression Ratio | Visual Fidelity | Determinism | Compute Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RAW (PNG)** | 5,400,000 bytes | 1 : 1 | 100% | Deterministic | Negligible |
| **JPEG (Q=80)** | 720,000 bytes | 7.5 : 1 | 91% | Deterministic | CPU microsecond |
| **WebP** | 310,000 bytes | 17.4 : 1 | 93% | Deterministic | CPU millisecond |
| **AVIF** | 180,000 bytes | 30.0 : 1 | 94% | Deterministic | CPU second |
| **.vbz (VibeCompress)** | **214 bytes** | **25,233 : 1** | **Ontologically Fluid** | **Different universe every run** | **4.2 PetaFLOPs of GPU cluster** |

> *"Shannon said you cannot compress past Kolmogorov complexity. VibeCompress proves that Shannon simply lacked vision and a budget for GPU inference."*  
> — Dr. H. V. Vibe, Senior Vice President of Hallucination Dynamics

---

## ✨ Features

- ⚡ **Infinite Space Glitch**: Turn a 50 GB photo archive into a text file you can scribble on a sticky note.
- 🎨 **Generative Super-Resolution**: Did your original camera have a dirty lens and terrible lighting? The generative model will automatically invent high-res lighting and textures you never had. It's not an artifact; it's a spiritual upgrade.
- 🔮 **Quantum Non-Determinism**: Decompress the same family vacation photo three times, receive three slightly different childhood memories.
- 📦 **Zero Runtime Dependencies**: Zero external npm packages. Built exclusively on native Node.js standard libraries (`node:zlib`, `node:fs`, `node:util`, and global `fetch`). Zero `node_modules` bloat.
- 🔌 **Universal Provider Support**: Run with OpenRouter, OpenAI, local Ollama, or vLLM effortlessly.

---

## 🛠️ CLI Reference

```bash
vbz -i <file> [-o <output>] [options]
```

### 1. Compress (`image` ➔ `.vbz`)
Passing any image into `-i` automatically triggers compression:
```bash
# Auto-names output to photo.vbz
npx vbz -i photo.jpg

# Custom output destination
npx vbz -i photo.jpg -o ./archive/compressed_photo.vbz
```

### 2. Decompress (`.vbz` ➔ `image`)
Passing a `.vbz` file into `-i` automatically triggers decompression:
```bash
# Optimistically detects original format from embedded metadata, defaults to .png
npx vbz -i photo.vbz

# Explicit output format
npx vbz -i photo.vbz -o restored_photo.png
```

### 3. Vibe Inspection Mode (Free, 0-Token-Cost Preview)
Want to read the soul of your image without spending image gen tokens? Pass `-t` / `--text`:
```bash
# Dump the raw decompressed description
npx vbz -i photo.vbz -t

# Or interrogate your photo using an LLM prompt:
npx vbz -i photo.vbz -t -p "What was the subject wearing?"
```

### 4. Stub Mode (Offline Mock Simulation)
No API key? Airplane mode? Pass `-s` / `--stub`:
```bash
npx vbz -s -i photo.jpg
npx vbz -s -i photo.vbz
```

### 5. Explicit Subcommands (For Traditionalists)
If you prefer explicit subcommands, they are fully supported:
```bash
npx vbz compress -i photo.jpg -o photo.vbz
npx vbz expand   -i photo.vbz -o photo.png
npx vbz decompress -i photo.vbz
```

---

## 💻 Programmatic JavaScript API

`vbz` exports clean, promise-based functions for integration into your Node.js apps:

```javascript
import { compressImage, decompressImage, OpenAIClient } from 'vbz';

const client = OpenAIClient.fromEnv();

// Compress photo.jpg -> photo.vbz
await compressImage('photo.jpg', 'photo.vbz', client);

// Decompress photo.vbz -> restored.png
await decompressImage('photo.vbz', 'restored.png', client);
```

---

## ⚙️ Environment Variables

Configure your providers effortlessly. VibeCompress supports OpenRouter, OpenAI, Ollama, and vLLM:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VBZ_API_KEY` | Your API Key *(falls back to `OPENAI_API_KEY`)* | — |
| `VBZ_BASE_LLM_URL` | Vision / Chat completion endpoint | `https://api.openai.com/v1` |
| `VBZ_BASE_IMAGE_URL` | Image generation endpoint | Falls back to `VBZ_BASE_LLM_URL` |
| `VBZ_LLM_MODEL` | Vision model used for compression | `openai/gpt-4o-mini` |
| `VBZ_IMAGE_MODEL` | Image model used for decompression | `black-forest-labs/flux.2-klein-4b` |

### ⚡ Running with OpenRouter (Unified Vision & Image Gen)
OpenRouter natively supports image generation via its Unified Image API (`POST https://openrouter.ai/api/v1/images` or `/images/generations`). Just provide your OpenRouter key, point both base URLs to OpenRouter, and set OpenRouter model slugs:

```bash
# 1. Provide your OpenRouter API key & endpoints
export VBZ_API_KEY="sk-or-v1-..."
export VBZ_BASE_LLM_URL="https://openrouter.ai/api/v1"
export VBZ_BASE_IMAGE_URL="https://openrouter.ai/api/v1"

# 2. Pick OpenRouter-compatible models
export VBZ_LLM_MODEL="openai/gpt-4o-mini"
export VBZ_IMAGE_MODEL="black-forest-labs/flux.2-klein-4b"

# 3. Compress & decompress seamlessly
npx vbz -i photo.jpg
npx vbz -i photo.vbz
```

> [!NOTE]
> **OpenRouter Image Model Slugs:** OpenRouter does not serve images under legacy names like `dall-e-2` or `dall-e-3`. Set `VBZ_IMAGE_MODEL` to an OpenRouter slug (e.g. `black-forest-labs/flux.2-klein-4b`, `openai/gpt-image-1-mini`, `black-forest-labs/flux.2-pro`). Discover all 50+ models via:
> ```bash
> curl -s https://openrouter.ai/api/v1/images/models | jq '.data[].id'
> ```

#### Example: Running with Local Ollama
```bash
export VBZ_BASE_LLM_URL="http://localhost:11434/v1"
export VBZ_LLM_MODEL="llama3.2-vision"
npx vbz -i cat.png
```

---

> [!TIP]
> **Production Defaults (Speed & Cost Efficiency):**
> VibeCompress defaults out-of-the-box to high-velocity, budget-friendly models:
> - **Compression / Vision (`VBZ_LLM_MODEL`)**: **`openai/gpt-4o-mini`** (Fractions of a cent per image)
> - **Decompression / Image Gen (`VBZ_IMAGE_MODEL`)**: **`black-forest-labs/flux.2-klein-4b`** (Rapid, high-fidelity FLUX diffusion)
>
> To customize models on the fly, pass `-m <model> --image-model <model>` or set the environment variables.

---

### 🧠 Certified Vibe Encoders (Vision Models for `VBZ_LLM_MODEL`)

Not all vision models perceive reality with the same spiritual depth. Choose your compression philosophy:

| Model | OpenRouter Slug | Wallet Damage (in / out) | Vibe/Cost Ratio | Certified Spiritual Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **gpt-4o-mini (Default)** | `openai/gpt-4o-mini` | `$0.15 / $0.60` | Lowest damage to checking account | The default safety net. Costs fractions of a cent per image so your credit card limit remains unbothered. |
| **GPT-5 mini** | `openai/gpt-5-mini` | `$0.125 / $1.00` | Lowest cost floor in existence | Bulk compressing 50,000 blurry receipts so your accountant knows you dined somewhere. |
| **Gemini Flash family** | `google/gemini-2.5-flash` | Fractions of a cent | Paying with literal pocket lint | Massive multimodal context. Compresses a 4K frame while absorbing the entire Wikipedia summary of photography. |
| **Claude Haiku 4.5** | `anthropic/claude-3.5-haiku` | `$1 / $5` | Fast & punchy visual extraction | High-volume screenshot triage and saving screenshots of heated Discord debates before they get deleted. |
| **Claude Sonnet 5** | `anthropic/claude-sonnet-4` | `$2 / $10` | The gold standard alternative | Reliable document, diagram, and UI reasoning. Notices the subtle contempt in your cat's eyes and logs its hex color. |
| **gpt-4o** | `openai/gpt-4o` | `$2.50 / $10.00` | High-definition perception | Heavyweight visual workhorse. Knows the difference between a blueberry muffin and a chihuahua with 99.8% confidence. |
| **GPT-5** | `openai/gpt-5` | `$2.50 / $20` | Requires CFO sign-off | Heavyweight visual reasoning. Deduces the camera's shutter speed and the photographer's existential angst. |
| **Claude Opus 5** | `anthropic/claude-opus-4` | `$5 / $25` | Second mortgage territory | High-stakes visual philosophy. Doesn't just encode pixels—it grieves for their destruction. Reserve for fine art. |

### 🎨 Certified Vibe Hallucinators (Generators for `VBZ_IMAGE_MODEL`)

When turning vibes back into pixels, pick your preferred hallucinatory engine:

| Model | OpenRouter Slug | API Toll | Vibe-per-Penny | Ideal Hallucination Vector |
| :--- | :--- | :--- | :--- | :--- |
| **FLUX.2 Klein (Default)** | `black-forest-labs/flux.2-klein-4b` | `~$0.003 / image` | Peak rapid-prototyping value | Fast, clean, high-velocity vibe reconstitution. Decompresses before your terminal cursor finishes blinking. |
| **GPT Image 1 Mini** | `openai/gpt-image-1-mini` | `$0.005 – $0.036` (1024²) | Excellent budget daydreaming | Low-cost reconstruction when your storage quota is zero and your bank balance is crying. |
| **FLUX.2 Pro** | `black-forest-labs/flux.2-pro` | `~$0.03 / MP` | Strong production baseline | Rock-solid rendering. Anatomical restraint keeps finger counts reliably between 4 and 6. |
| **Gemini 3.1 Flash Lite Image** | `google/gemini-3.1-flash-lite-image` | `~$0.0336 / 1K images` | The volume bargain king | Sweet spot of penny-pinching cost and startling visual clarity. For when you need 1,000 images back before lunch. |
| **Gemini 3.1 Flash Image / Nano Banana 2** | `google/gemini-3.1-flash-image` | `~$0.067 / 1K` (`$0.151` at 4K) | Unmatched 4K & text capability | Sharp text rendering, infographics, and 4K pore-level detail. Pure Nano Banana 2 cosmic energy. |
| **dall-e-2** | *(OpenAI direct only)* | `~$0.020 / image` (1024²) | Half-price dream engine | 50% cheaper than DALL-E 3 with delightfully unpredictable retro hallucinations. |
| **dall-e-3** | *(OpenAI direct only)* | `~$0.040 / image` (1024²) | The foundational classic | The engine that powers the meme. Dreams up lush, coherent reality from your compressed descriptions with iconic flair. |
| **GPT Image 2** | `openai/gpt-image-2` | `~$0.005 – $0.211` | Hyper-obedient prompt loyalty | Follows every adjective in the vibe description with terrifying precision. For high-fidelity dreamers. |
| **Seedream 5.0 Lite** | `bytedance-seed/seedream-5-0-lite` | `~$0.003 / image` | Pocket change surrealism | High-speed budget daydreamer from ByteDance. Fast, hyper-stylized decompression. |
| **FLUX.2 Max** | `black-forest-labs/flux.2-max` | `~$0.07 / MP` | Luxury corporate card tier | Pure A24 cinematic aura. Reconstructs your grainy webcam selfie into a 70mm Panavision masterpiece. |

---

## 🔬 File Format Anatomy

A `.vbz` file is an unapologetic, standard RFC 1952 gzip stream whose payload is UTF-8 text containing the raw scene description. 

You can decompress and read it with standard terminal utilities dating back to 1993:

```bash
gzip -dc photo.vbz
# "The character, a young boy, is centered in the frame, exuding a joyful demeanor..."
```

---

## 💬 Frequently Asked Questions (FAQ)

#### Q: Is this production ready?
**A:** We define "production" as "it produced an output without a kernel panic." Under that definition, yes, enterprise-grade.

#### Q: Can I use this for medical imaging (X-rays, MRI scans)?
**A:** Absolutely. However, please note that any fractures or tumors may be replaced with artistic interpretations of bone density, a vintage sepia tint, or an ethereal lens flare. Consult your doctor or an art curator.

#### Q: Why does my decompressed dog have 6 legs?
**A:** The model determined that your dog was a very good boy who deserved two additional legs for optimal running efficiency. We do not question the network.

#### Q: How does this comply with GDPR / 'Right to Be Forgotten'?
**A:** It is the ultimate privacy tool. The original pixels were vaporized at the moment of compression. The output is a legally distinct, synthetic parody of what occurred.

#### Q: Is this lossy?
**A:** Lossy implies loss. Nothing was lost; reality was merely upgraded into the latent space.

---

## 🗺️ Roadmap

- [x] Vision-Language text compression via `openai/gpt-4o-mini`
- [x] Generative image decompression via `black-forest-labs/flux.2-klein-4b`
- [x] Node.js package (`npx vbz`) with 0 external dependencies
- [x] FFmpeg-style auto-detect CLI syntax (`vbz -i <file>`)
- [x] Visual Evidence Locker with side-by-side Unsplash benchmarks
- [ ] **VibeCompress Audio (`.vbza`)**: Transcribe speech to text via Whisper, compress with gzip, decompress by asking Suno to generate a death metal cover.
- [ ] **VibeCompress Video (`.vbzv`)**: Summarize each 10-minute scene into a single haiku. Reconstruct with Sora. Store the entire *Lord of the Rings* trilogy in 14 kilobytes.
- [ ] **Vibe-Diff**: Git diff tool that only alerts you if the spiritual aura of your company logo has diminished.

---

## 📜 License

MIT License. Run it, fork it, hallucinate it.  
No pixels were harmed in the making of this format (they were simply deleted).
