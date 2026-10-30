export const ADS_ID = 'AW-18078478688';
export const ADS_DESTINATION = `${ADS_ID}/mnsTCPOd864dEODivqxD`;
const consentKey = 'luvia:ads-consent:v1';
const maxAge = 180 * 24 * 60 * 60 * 1000;
type Choice = 'granted' | 'denied';
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: any[]) => void; } }
let enabled = false;
let choice: Choice = 'denied';
let initialized = false;
const sent = new Set<string>();
export function readAdsChoice(): Choice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || 'null');
    return saved && Date.now() - saved.at < maxAge && ['granted', 'denied'].includes(saved.choice) ? saved.choice : null;
  } catch { return null; }
}
function command(...args: any[]) { window.gtag?.(...args); }
export function initializeAds(production: boolean) {
  enabled = production && ['luvia.pt', 'www.luvia.pt'].includes(window.location.hostname);
  choice = readAdsChoice() || 'denied';
  if (choice === 'granted') activate();
}
function activate() {
  if (!enabled || initialized) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer!.push(arguments); };
  command('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
  command('set', 'ads_data_redaction', true);
  command('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'denied' });
  command('js', new Date());
  command('config', ADS_ID, { send_page_view: false, allow_ad_personalization_signals: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  document.head.appendChild(script);
}
export function setAdsChoice(next: Choice) {
  choice = next;
  try { localStorage.setItem(consentKey, JSON.stringify({ choice: next, at: Date.now() })); } catch {}
  if (next === 'granted') {
    if (initialized) command('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'denied' });
    else activate();
  }
  else if (initialized) command('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
}
// Called only with the parsed server response. No contact details or monetary value.
export function trackQuoteSuccess(response: unknown, submissionId: string): boolean {
  if (!response || typeof response !== 'object' || !('ok' in response) || response.ok !== true) return false;
  if (choice !== 'granted' || !/^[0-9a-f-]{36}$/i.test(submissionId) || sent.has(submissionId)) return false;
  const key = `luvia:ads-sent:${submissionId}`;
  try { if (sessionStorage.getItem(key)) return false; } catch {}
  sent.add(submissionId);
  try { sessionStorage.setItem(key, '1'); } catch {}
  if (enabled) {
    activate();
    command('event', 'conversion', { send_to: ADS_DESTINATION, transaction_id: submissionId });
  } else {
    // Preview diagnostics only: never load Google's tag or report test leads.
    window.dispatchEvent(new CustomEvent('luvia:conversion-preview', { detail: { send_to: ADS_DESTINATION, transaction_id: submissionId } }));
  }
  return true;
}
