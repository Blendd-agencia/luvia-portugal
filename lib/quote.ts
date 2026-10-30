export const productLabels: Record<string, string> = {
  rustic: 'Travertino Rustic', mix: 'Travertino Mix', light: 'Travertino Light',
  'vein-cut': 'Travertino Vein Cut', bordaduras: 'Bordaduras de piscina', ajuda: 'Preciso de aconselhamento',
};
export const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
export type Quote = { name: string; email: string; phone: string; postal_code: string; product: string; quantity: number; message: string; contact_permission: 'on'; submission_id: string };
export function parseQuote(value: unknown): Quote | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const d = value as Record<string, unknown>;
  const field = (key: string, max: number, required = false) => {
    const value = d[key] ?? '';
    if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return null;
    const clean = value.trim();
    return required && !clean ? null : clean;
  };
  const name = field('name', 120, true), email = field('email', 200, true), phone = field('phone', 30);
  const postal_code = field('postal_code', 8, true), product = field('product', 30, true), message = field('message', 3000);
  const submission_id = field('submission_id', 36, true);
  const quantity = typeof d.quantity === 'string' || typeof d.quantity === 'number' ? Number(d.quantity) : NaN;
  if (name === null || email === null || phone === null || postal_code === null || product === null || message === null || submission_id === null) return null;
  if (/[\r\n]/.test(name + email + phone) || !emailPattern.test(email) || !/^\d{4}-\d{3}$/.test(postal_code) || !Object.hasOwn(productLabels, product) || !Number.isFinite(quantity) || quantity < 0.1 || quantity > 100000 || d.contact_permission !== 'on' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submission_id)) return null;
  return { name, email, phone, postal_code, product, quantity, message, contact_permission: 'on', submission_id };
}
export function quoteText(q: Quote) {
  return ['Novo pedido de orçamento — Luvia', '', `Nome: ${q.name}`, `Email: ${q.email}`, `Telefone: ${q.phone || 'Não indicado'}`, `Código postal: ${q.postal_code}`, `Produto: ${productLabels[q.product]}`, `Quantidade: ${q.quantity} ${q.product === 'bordaduras' ? 'metros lineares' : 'm²'}`, '', 'Mensagem:', q.message || 'Sem mensagem adicional.', '', 'Contacto autorizado para responder a este pedido.', `Referência: ${q.submission_id}`].join('\n');
}
