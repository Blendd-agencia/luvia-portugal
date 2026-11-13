'use client';
import { useEffect, useState } from 'react';
import { initializeAds, readConsent, setConsent, trackAnalyticsQuote, trackContact, type Consent } from '../lib/ads';
export default function AdsConsent({ production }: { production: boolean }) {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);
  useEffect(() => {
    initializeAds(production);
    const saved = readConsent();
    setOpen(saved === null); setAnalytics(saved?.analytics || false); setAds(saved?.ads || false);
    function quote(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (detail && typeof detail.submission_id === 'string') trackAnalyticsQuote(detail.submission_id, detail.product);
    }
    function contact(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      if (link.protocol === 'tel:') trackContact('phone');
      else if (link.protocol === 'mailto:') trackContact('email');
      else if (['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(link.hostname)) trackContact('whatsapp');
    }
    window.addEventListener('luvia:quote-success', quote);
    document.addEventListener('click', contact);
    return () => { window.removeEventListener('luvia:quote-success', quote); document.removeEventListener('click', contact); };
  }, [production]);
  function choose(value: Consent) { setConsent(value); setAnalytics(value.analytics); setAds(value.ads); setOpen(false); }
  return <><button type="button" className="cookie-preferences" onClick={() => setOpen(true)}>Preferências de cookies</button>{open && <section className="ads-consent" aria-label="Preferências de cookies" style={{ flexWrap: 'wrap' }}><div><strong>Estatísticas e medição de campanhas</strong><p>Com a sua autorização, usamos Google Analytics para compreender as visitas e ações no site, e Google Ads para medir os pedidos de orçamento associados aos anúncios. Pode escolher cada finalidade. Não enviamos o nome, email, telefone ou mensagem do formulário para estas ferramentas. Pode recusar e pedir orçamento na mesma. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Como a Google utiliza os dados</a>.</p><div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 12 }}><label><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)}/> Estatísticas (Google Analytics)</label><label><input type="checkbox" checked={ads} onChange={e => setAds(e.target.checked)}/> Medição de campanhas (Google Ads)</label></div><p>Pode alterar a escolha em “Preferências de cookies”. Ao retirar uma autorização, a página será recarregada; guarde primeiro qualquer pedido por enviar.</p></div><div className="consent-actions" style={{ flexWrap: 'wrap', flexShrink: 1 }}><button type="button" onClick={() => choose({ analytics: false, ads: false })}>Recusar tudo</button><button type="button" onClick={() => choose({ analytics, ads })}>Guardar escolhas</button><button type="button" onClick={() => choose({ analytics: true, ads: true })}>Aceitar tudo</button></div></section>}</>;
}
