import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { OpenAIClient } from '../src/openai.js';

test('OpenAIClient.fromEnv fallbacks', () => {
  const origEnv = { ...process.env };

  try {
    process.env.VBZ_API_KEY = 'custom-key';
    process.env.VBZ_BASE_LLM_URL = 'http://localhost:8000/v1';
    delete process.env.VBZ_BASE_IMAGE_URL;
    delete process.env.OPENAI_BASE_URL;
    process.env.VBZ_LLM_MODEL = 'custom-vl';
    process.env.VBZ_IMAGE_MODEL = 'custom-gen';

    const client = OpenAIClient.fromEnv();
    assert.strictEqual(client.apiKey, 'custom-key');
    assert.strictEqual(client.baseLLMURL, 'http://localhost:8000/v1');
    assert.strictEqual(client.baseImageURL, 'http://localhost:8000/v1'); // falls back to LLM URL
    assert.strictEqual(client.llmModel, 'custom-vl');
    assert.strictEqual(client.imageModel, 'custom-gen');

    // Test explicit image URL
    process.env.VBZ_BASE_IMAGE_URL = 'http://localhost:9000/v1';
    const client2 = OpenAIClient.fromEnv();
    assert.strictEqual(client2.baseImageURL, 'http://localhost:9000/v1');

    // Test fallback to OPENAI_API_KEY and default endpoint
    delete process.env.VBZ_API_KEY;
    delete process.env.VBZ_BASE_LLM_URL;
    delete process.env.VBZ_BASE_IMAGE_URL;
    delete process.env.VBZ_LLM_MODEL;
    delete process.env.VBZ_IMAGE_MODEL;
    process.env.OPENAI_API_KEY = 'openai-fallback-key';

    const client3 = OpenAIClient.fromEnv();
    assert.strictEqual(client3.apiKey, 'openai-fallback-key');
    assert.strictEqual(client3.baseLLMURL, 'https://api.openai.com/v1');
    assert.strictEqual(client3.baseImageURL, 'https://api.openai.com/v1');
    assert.strictEqual(client3.llmModel, 'openai/gpt-4o-mini');
    assert.strictEqual(client3.imageModel, 'black-forest-labs/flux.2-klein-4b');
  } finally {
    for (const k of Object.keys(process.env)) {
      if (!(k in origEnv)) delete process.env[k];
    }
    Object.assign(process.env, origEnv);
  }
});

test('OpenAIClient.describeImage calls vision endpoint', async () => {
  const expectedDesc = 'A futuristic cybernetic synthwave city';
  const imgBuf = Buffer.from('test-image-content');

  const server = http.createServer(async (req, res) => {
    assert.strictEqual(req.method, 'POST');
    assert.strictEqual(req.url, '/chat/completions');
    assert.strictEqual(req.headers['authorization'], 'Bearer test-token-123');

    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    const parsed = JSON.parse(body);
    assert.strictEqual(parsed.model, 'openai/gpt-4o-mini');

    const imgContent = parsed.messages[0].content.find((c) => c.type === 'image_url');
    assert.ok(imgContent);
    assert.strictEqual(
      imgContent.image_url.url,
      `data:image/jpeg;base64,${imgBuf.toString('base64')}`
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        choices: [
          {
            message: {
              content: expectedDesc,
            },
          },
        ],
      })
    );
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseURL = `http://localhost:${port}`;

  try {
    const client = new OpenAIClient({
      apiKey: 'test-token-123',
      baseLLMURL: baseURL,
    });

    const desc = await client.describeImage(imgBuf, 'photo.jpg');
    assert.strictEqual(desc, expectedDesc);
  } finally {
    server.closeAllConnections?.();
    server.close();
  }
});

test('OpenAIClient.generateImage calls image gen endpoint with b64_json', async () => {
  const expectedBytes = Buffer.from('fake-png-output');
  const b64Data = expectedBytes.toString('base64');

  const server = http.createServer(async (req, res) => {
    assert.strictEqual(req.method, 'POST');
    assert.strictEqual(req.url, '/images/generations');
    assert.strictEqual(req.headers['authorization'], 'Bearer test-gen-token');

    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    const parsed = JSON.parse(body);
    assert.strictEqual(parsed.model, 'black-forest-labs/flux.2-klein-4b');
    assert.strictEqual(parsed.prompt, 'generate vibes');
    assert.strictEqual(parsed.response_format, 'b64_json');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        data: [{ b64_json: b64Data }],
      })
    );
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseURL = `http://localhost:${port}`;

  try {
    const client = new OpenAIClient({
      apiKey: 'test-gen-token',
      baseImageURL: baseURL,
    });

    const img = await client.generateImage('generate vibes');
    assert.deepStrictEqual(img, expectedBytes);
  } finally {
    server.closeAllConnections?.();
    server.close();
  }
});

test('OpenAIClient.generateImage downloads when url is provided', async () => {
  const expectedBytes = Buffer.from('downloaded-image-data');
  let server;

  server = http.createServer(async (req, res) => {
    if (req.url === '/download/image.png') {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(expectedBytes);
      return;
    }

    if (req.url === '/images/generations') {
      const port = server.address().port;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          data: [{ url: `http://localhost:${port}/download/image.png` }],
        })
      );
      return;
    }

    res.writeHead(404);
    res.end();
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseURL = `http://localhost:${port}`;

  try {
    const client = new OpenAIClient({
      apiKey: 'test-token',
      baseImageURL: baseURL,
    });

    const img = await client.generateImage('prompt');
    assert.deepStrictEqual(img, expectedBytes);
  } finally {
    server.closeAllConnections?.();
    server.close();
  }
});

test('OpenAIClient handles error responses', async () => {
  const server = http.createServer((req, res) => {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: { message: 'Prompt violated safety guidelines' },
      })
    );
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseURL = `http://localhost:${port}`;

  try {
    const client = new OpenAIClient({
      apiKey: 'test-token',
      baseImageURL: baseURL,
    });

    await assert.rejects(
      async () => {
        await client.generateImage('bad prompt');
      },
      /Prompt violated safety guidelines/
    );
  } finally {
    server.closeAllConnections?.();
    server.close();
  }
});
