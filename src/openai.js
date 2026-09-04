import path from 'node:path';

export class OpenAIClient {
  constructor({
    apiKey = '',
    baseLLMURL = 'https://api.openai.com/v1',
    baseImageURL = '',
    llmModel = 'openai/gpt-4o-mini',
    imageModel = 'black-forest-labs/flux.2-klein-4b',
  } = {}) {
    this.apiKey = apiKey || '';
    this.baseLLMURL = (baseLLMURL || 'https://api.openai.com/v1').replace(/\/+$/, '');
    this.baseImageURL = (baseImageURL || this.baseLLMURL).replace(/\/+$/, '');
    this.llmModel = llmModel || 'openai/gpt-4o-mini';
    this.imageModel = imageModel || 'black-forest-labs/flux.2-klein-4b';
  }

  static fromEnv() {
    const apiKey = process.env.VBZ_API_KEY || process.env.OPENAI_API_KEY || '';
    const baseLLMURL = process.env.VBZ_BASE_LLM_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const baseImageURL = process.env.VBZ_BASE_IMAGE_URL || baseLLMURL;
    const llmModel = process.env.VBZ_LLM_MODEL || 'openai/gpt-4o-mini';
    const imageModel = process.env.VBZ_IMAGE_MODEL || 'black-forest-labs/flux.2-klein-4b';

    return new OpenAIClient({
      apiKey,
      baseLLMURL,
      baseImageURL,
      llmModel,
      imageModel,
    });
  }

  _checkAuth(targetURL) {
    if (!this.apiKey && targetURL.includes('api.openai.com')) {
      throw new Error(`API key required for ${targetURL}: please set VBZ_API_KEY or OPENAI_API_KEY`);
    }
  }

  _detectMIME(filename, buffer) {
    const ext = path.extname(filename || '').toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
      case '.gif':
        return 'image/gif';
    }
    if (buffer && buffer.length >= 4) {
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        return 'image/png';
      }
      if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
        return 'image/jpeg';
      }
      if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
        return 'image/gif';
      }
    }
    return 'image/jpeg';
  }

  async describeImage(imageBuffer, filename) {
    const endpoint = `${this.baseLLMURL}/chat/completions`;
    this._checkAuth(endpoint);

    const mimeType = this._detectMIME(filename, imageBuffer);
    const b64 = imageBuffer.toString('base64');
    const dataURL = `data:${mimeType};base64,${b64}`;

    const systemPrompt =
      'You are an expert visual compression encoder. Describe this image in exhaustive detail so that an image generation model can reproduce it as accurately as possible. Focus on composition, subject details, lighting, color palette, textures, camera angle, and artistic style.';

    const payload = {
      model: this.llmModel,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            { type: 'image_url', image_url: { url: dataURL } },
          ],
        },
      ],
    };

    const headers = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      const errText = await response.text();
      let msg = errText;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          msg = parsed.error.message;
        }
      } catch {}
      throw new Error(`API error (status ${response.status}): ${msg}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('no description returned by vision model');
    }

    return data.choices[0].message.content.trim();
  }

  async generateImage(prompt) {
    const endpoint = `${this.baseImageURL}/images/generations`;
    this._checkAuth(endpoint);

    const maxLen = this.imageModel === 'black-forest-labs/flux.2-klein-4b' ? 1000 : 4000;
    const cappedPrompt = prompt.length > maxLen ? prompt.slice(0, maxLen) : prompt;

    const payload = {
      model: this.imageModel,
      prompt: cappedPrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    };

    const headers = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      const errText = await response.text();
      let msg = errText;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          msg = parsed.error.message;
        }
      } catch {}
      throw new Error(`API error (status ${response.status}): ${msg}`);
    }

    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      throw new Error('no image data returned by image generation model');
    }

    const item = data.data[0];
    if (item.b64_json) {
      return Buffer.from(item.b64_json, 'base64');
    }

    if (item.url) {
      const imgRes = await fetch(item.url, { signal: AbortSignal.timeout(120_000) });
      if (!imgRes.ok) {
        throw new Error(`download image failed (status ${imgRes.status})`);
      }
      const arrayBuffer = await imgRes.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    throw new Error('image response contained neither b64_json nor url');
  }

  async expandDescription(description, prompt) {
    const endpoint = `${this.baseLLMURL}/chat/completions`;
    this._checkAuth(endpoint);

    const payload = {
      model: this.llmModel,
      messages: [
        {
          role: 'system',
          content: `You are assisting with an image description stored in a compressed format. Here is the stored description:\n\n${description}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const headers = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      const errText = await response.text();
      let msg = errText;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          msg = parsed.error.message;
        }
      } catch {}
      throw new Error(`API error (status ${response.status}): ${msg}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('no response choices returned');
    }

    return data.choices[0].message.content.trim();
  }
}
