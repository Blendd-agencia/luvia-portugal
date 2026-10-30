import { createHash } from 'node:crypto';
import { emailPattern, parseQuote, productLabels, quoteText } from '../../../lib/quote';
export const runtime = 'nodejs';
export const maxDuration = 30;
const reply = (status: number, error?: string) => Response.json(error ? { error } : { ok: true }, { status, headers: { 'Cache-Control': 'no-store' } });
// Per-instance mitigation only; use Vercel Firewall for distributed rate limits.
const attempts = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return reply(403, 'Origem não permitida.');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(415, 'Formato inválido.');
  const reader = request.body?.getReader();
  if (!reader) return reply(400, 'Pedido vazio.');
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 16000) { await reader.cancel(); return reply(413, 'Pedido demasiado longo.'); }
      chunks.push(value);
    }
  } catch { return reply(400, 'Pedido inválido.'); }
  let data: unknown;
  try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return reply(400, 'Pedido inválido.'); }
  if (data && typeof data === 'object' && 'website' in data && data.website) return reply(400, 'Pedido inválido.');
  const quote = parseQuote(data);
  if (!quote) return reply(400, 'Verifique os campos obrigatórios.');
  const now = Date.now();
  for (const [key, item] of attempts) if (item.until < now) attempts.delete(key);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ipKey = createHash('sha256').update(ip).digest('hex');
  const attempt = attempts.get(ipKey) || { count: 0, until: now + 600000 };
  if (attempt.count >= 5 || attempts.size >= 10000) return reply(429, 'Aguarde alguns minutos antes de voltar a tentar.');
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.QUOTE_FROM_EMAIL;
  const to = (process.env.QUOTE_TO_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!apiKey || !from || !to.length || to.length > 10 || to.some(address => !emailPattern.test(address))) return reply(503, 'O envio está temporariamente indisponível. Contacte info@luvia.pt.');
  attempt.count++; attempts.set(ipKey, attempt);
  // Stable across retries, but changes if the submitted content changes.
  const fingerprint = createHash('sha256').update(JSON.stringify(quote)).digest('hex');
  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `luvia-${fingerprint}` },
      body: JSON.stringify({ from, to, reply_to: quote.email, subject: `Luvia — Pedido de orçamento: ${productLabels[quote.product]}`, text: quoteText(quote) }),
      signal: AbortSignal.timeout(12000),
    });
    if (!result.ok) { console.error('Quote email provider status:', result.status); return reply(502, 'Não foi possível confirmar o envio. Tente novamente.'); }
    const resultData = await result.json();
    if (!resultData.id) return reply(502, 'Não foi possível confirmar o envio. Tente novamente.');
    return reply(200);
  } catch { return reply(502, 'Não foi possível confirmar o envio. Tente novamente.'); }
}
