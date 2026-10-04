const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../server');

describe('Server Endpoints Integration Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    // Start on random ephemeral port
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const address = server.address();
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  it('GET /healthz returns 200 ok for Render healthcheck', async () => {
    const res = await fetch(`${baseUrl}/healthz`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'ok');
  });

  it('GET /api/config returns model provider details', async () => {
    const res = await fetch(`${baseUrl}/api/config`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.provider);
    assert(data.model);
    assert(data.label.includes('open-weight'));
  });

  it('GET / serves index.html with Bengali and English content', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('দাদুর রান্না'));
    assert(html.includes('Dadur Ranna'));
    assert(html.includes('recipe-editor-card'));
  });

  it('POST /api/extract returns 400 when body is empty', async () => {
    const res = await fetch(`${baseUrl}/api/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert(data.error);
  });

  it('POST /api/extract processes text successfully and returns structured recipe', async () => {
    const res = await fetch(`${baseUrl}/api/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'দাদুর স্পেশাল সর্ষে ইলিশ রেসিপি ৪ টুকরো মাছ ২ চামচ সর্ষে বাটা'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.recipe.title_bn);
    assert(data.recipe.title_en);
    assert(Array.isArray(data.recipe.ingredients));
    assert(data.recipe.ingredients.length > 0);
    assert(Array.isArray(data.recipe.steps_bn));
    assert(Array.isArray(data.recipe.steps_en));
    assert(Array.isArray(data.recipe.uncertain));
  });
});
