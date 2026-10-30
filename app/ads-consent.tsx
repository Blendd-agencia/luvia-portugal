'use client';
import { useEffect, useState } from 'react';
import { initializeAds, readAdsChoice, setAdsChoice } from '../lib/ads';
export default function AdsConsent({ production }: { production: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { initializeAds(production); setOpen(readAdsChoice() === null); }, [production]);
  function choose(value: 'granted' | 'denied') { setAdsChoice(value); setOpen(false); }
  return <><button type="button" className="cookie-preferences" onClick={() => setOpen(true)}>Preferências de cookies</button>{open && <section className="ads-consent" aria-label="Preferências de cookies"><div><strong>Medição de campanhas</strong><p>Com a sua autorização, usamos cookies do Google Ads para perceber que anúncios originam pedidos de orçamento. A Google recebe dados de medição, incluindo identificadores de anúncios e do pedido. Não enviamos o nome, email, telefone ou mensagem do formulário. Pode recusar e pedir orçamento na mesma, ou alterar a escolha em “Preferências de cookies”. <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">Como a Google utiliza os dados</a>.</p></div><div className="consent-actions"><button type="button" onClick={() => choose('denied')}>Recusar</button><button type="button" onClick={() => choose('granted')}>Aceitar medição</button></div></section>}</>;
}
