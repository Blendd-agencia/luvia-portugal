export const ADS_ID = 'AW-18078478688';
export const ADS_DESTINATION = `${ADS_ID}/mnsTCPOd864dEODivqxD`;
const consentKey = 'luvia:consent:v2';
const maxAge = 180 * 24 * 60 * 60 * 1000;
type Choice = 'granted' | 'denied';
export type Consent = { analytics: boolean; ads: boolean };
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: any[]) => void; } }
let enabled = false;
let current: Consent = { analytics: false, ads: false };
let initialized = false;
let adsLoaded = false;
let gtmLoaded = false;
const sent = new Set<string>();
const analyticsSent = new Set<string>();
export function readConsent(): Consent | null {
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || 'null');
    const age = Date.now() - saved?.at;
    return saved && age >= 0 && age < maxAge && typeof saved.analytics === 'boolean' && typeof saved.ads === 'boolean'
      ? { analytics: saved.analytics, ads: saved.ads } : null;
  } catch { return null; }
}
export function readAdsChoice(): Choice | null {
  const saved = readConsent();
  return saved ? (saved.ads ? 'granted' : 'denied') : null;
}
function command(...args: any[]) { window.gtag?.(...args); }
function appendScript(src: string) {
  const script = document.createElement('script');
  script.async = true; script.src = src; document.head.appendChild(script);
}
function applyConsent() {
  command('consent', 'update', {
    analytics_storage: current.analytics ? 'granted' : 'denied',
    ad_storage: current.ads ? 'granted' : 'denied',
    ad_user_data: current.ads ? 'granted' : 'denied',
    ad_personalization: 'denied'
  });
  if (enabled && current.ads && !adsLoaded) {
    adsLoaded = true;
    command('config', ADS_ID, { send_page_view: false, allow_ad_personalization_signals: false });
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`);
  }
  if (enabled && current.analytics && !gtmLoaded) {
    gtmLoaded = true;
    window.dataLayer!.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    appendScript('https://www.googletagmanager.com/gtm.js?id=GTM-WPKGJSCF');
  }
}
export function initializeAds(production: boolean) {
  enabled = production && ['luvia.pt', 'www.luvia.pt'].includes(window.location.hostname);
  if (!initialized) {
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
    command('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
    command('set', 'ads_data_redaction', true);
    command('js', new Date());
  }
  current = readConsent() || { analytics: false, ads: false };
  applyConsent();
}
function clearMeasurementCookies(analytics: boolean, ads: boolean) {
  for (const entry of document.cookie.split(';')) {
    const name = entry.trim().split('=')[0];
    if (!((analytics && /^(_ga|_gid|_gat)/.test(name)) || (ads && /^_gcl_/.test(name)))) continue;
    for (const domain of ['', window.location.hostname, '.luvia.pt', 'luvia.pt']) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? '; domain=' + domain : ''}; SameSite=Lax`;
    }
  }
}
export function setConsent(next: Consent) {
  const revokeAnalytics = current.analytics && !next.analytics;
  const revokeAds = current.ads && !next.ads;
  current = next;
  try { localStorage.setItem(consentKey, JSON.stringify({ ...next, at: Date.now() })); } catch {}
  // Update loaded tags before removing their cookies and reloading to unload them.
  if (revokeAnalytics || revokeAds) {
    command('consent', 'update', { analytics_storage: next.analytics ? 'granted' : 'denied', ad_storage: next.ads ? 'granted' : 'denied', ad_user_data: next.ads ? 'granted' : 'denied', ad_personalization: 'denied' });
    clearMeasurementCookies(revokeAnalytics, revokeAds);
    window.location.reload();
    return;
  }
  applyConsent();
}
export function setAdsChoice(next: Choice) { setConsent({ ...current, ads: next === 'granted' }); }
function analyticsEvent(event: string, parameters: Record<string, string>) {
  if (!enabled || !current.analytics || !readConsent()?.analytics) return;
  window.dataLayer!.push({ event, ...parameters });
}
export function trackAnalyticsQuote(submissionId: string, product: string) {
  if (!/^[0-9a-f-]{36}$/i.test(submissionId) || analyticsSent.has(submissionId) || !current.analytics) return;
  const key = `luvia:analytics-sent:${submissionId}`;
  try { if (sessionStorage.getItem(key)) return; } catch {}
  analyticsSent.add(submissionId);
  try { sessionStorage.setItem(key, '1'); } catch {}
  const allowed = ['rustic', 'mix', 'light', 'vein-cut', 'bordaduras', 'ajuda'];
  analyticsEvent('luvia_quote_success', { form_name: 'pedido_orcamento', product_name: allowed.includes(product) ? product : 'nao_especificado' });
}
export function trackContact(method: string) {
  if (['phone', 'email', 'whatsapp'].includes(method)) analyticsEvent('luvia_contact_click', { contact_method: method });
}
// Called only after the server confirms success. No contact details or monetary value.
export function trackQuoteSuccess(response: unknown, submissionId: string): boolean {
  if (!response || typeof response !== 'object' || !('ok' in response) || response.ok !== true) return false;
  if (!current.ads || !readConsent()?.ads || !/^[0-9a-f-]{36}$/i.test(submissionId) || sent.has(submissionId)) return false;
  const key = `luvia:ads-sent:${submissionId}`;
  try { if (sessionStorage.getItem(key)) return false; } catch {}
  sent.add(submissionId);
  try { sessionStorage.setItem(key, '1'); } catch {}
  if (enabled) {
    applyConsent();
    command('event', 'conversion', { send_to: ADS_DESTINATION, transaction_id: submissionId });
  } else {
    window.dispatchEvent(new CustomEvent('luvia:conversion-preview', { detail: { send_to: ADS_DESTINATION, transaction_id: submissionId } }));
  }
  return true;
}
