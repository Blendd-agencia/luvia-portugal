import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Transpile the real handler to an isolated directory; only the email provider is mocked.
const temp = mkdtempSync(join(tmpdir(), 'luvia-api-test-'));
for (const file of ['lib/quote.ts', 'app/api/quote/route.ts']) {
  const dest = join(temp, file.replace(/\.ts$/, '.js'));
  mkdirSync(join(dest, '..'), { recursive: true });
  writeFileSync(dest, ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);
}
const { POST } = createRequire(import.meta.url)(join(temp, 'app/api/quote/route.js'));
const data = { name: 'Teste Luvia', email: 'teste@example.com', postal_code: '4400-103', product: 'vein-cut', quantity: '10', contact_permission: 'on', submission_id: 'e16d4ad9-c698-4ad6-a826-a4d407b5e42c' };
const request = (body = data, origin = 'https://luvia.pt') => new Request('https://luvia.pt/api/quote/', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body) });
test('quote handler validates requests and only confirms provider acceptance', async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  try {
    assert.equal((await POST(request(data, 'https://unrelated.example'))).status, 403);
    assert.equal((await POST(request({ ...data, website: 'spam' }))).status, 400);
    assert.equal((await POST(request({ ...data, quantity: -10 }))).status, 400);
    assert.equal((await POST(request({ ...data, message: 'x'.repeat(17000) }))).status, 413);
    delete process.env.RESEND_API_KEY;
    assert.equal((await POST(request())).status, 503);
    process.env.RESEND_API_KEY = 'test-only-not-a-real-key';
    process.env.QUOTE_FROM_EMAIL = 'Luvia <luvia@blendd.pt>';
    process.env.QUOTE_TO_EMAILS = 'recipient@example.com';
    const calls = [];
    globalThis.fetch = async (url, init) => { calls.push({ url, ...init }); return Response.json({ id: 'test-email' }); };
    assert.equal((await POST(request())).status, 200);
    assert.equal((await POST(request())).status, 200);
    assert.equal(calls[0].headers['Idempotency-Key'], calls[1].headers['Idempotency-Key']);
    const sent = JSON.parse(calls[0].body);
    assert.deepEqual(sent.to, ['recipient@example.com']);
    assert.equal(sent.reply_to, data.email);
    assert.match(sent.text, /Travertino Vein Cut/);
    globalThis.fetch = async () => Response.json({ error: 'test' }, { status: 500 });
    assert.equal((await POST(request())).status, 502);
    globalThis.fetch = async () => { throw new Error('test timeout'); };
    assert.equal((await POST(request())).status, 502);
    globalThis.fetch = async () => Response.json({ id: 'test-email' });
    assert.equal((await POST(request())).status, 200);
    assert.equal((await POST(request())).status, 429);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of ['RESEND_API_KEY', 'QUOTE_FROM_EMAIL', 'QUOTE_TO_EMAILS']) {
      if (originalEnv[key] === undefined) delete process.env[key]; else process.env[key] = originalEnv[key];
    }
    rmSync(temp, { recursive: true, force: true });
  }
});
