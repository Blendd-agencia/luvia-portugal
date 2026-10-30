import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseQuote, quoteText } from '../lib/quote.ts';
const valid = { name: 'Teste Luvia', email: 'teste@example.com', phone: '', postal_code: '4400-103', product: 'vein-cut', quantity: '12.5', message: 'Pedido de teste', contact_permission: 'on', submission_id: 'e16d4ad9-c698-4ad6-a826-a4d407b5e42c' };
test('accepts valid quote and formats product and units', () => {
  const quote = parseQuote(valid); assert.ok(quote); assert.match(quoteText(quote), /Travertino Vein Cut/); assert.match(quoteText(quote), /12.5 m²/);
  assert.match(quoteText(parseQuote({ ...valid, product: 'bordaduras' })), /metros lineares/);
});
test('rejects malformed, oversized and unconsented requests', () => {
  for (const changes of [{ email: 'bad' }, { email: 'x@example.com\r\nBcc: other@example.com' }, { name: 'x\nHeader' }, { quantity: -1 }, { quantity: 'Infinity' }, { quantity: 100001 }, { postal_code: '4400103' }, { product: '__proto__' }, { contact_permission: '' }, { message: 'x'.repeat(3001) }, { submission_id: 'bad' }]) assert.equal(parseQuote({ ...valid, ...changes }), null);
  assert.equal(parseQuote(null), null);
});
