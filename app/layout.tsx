import type { Metadata } from 'next';
import { indexable, siteUrl } from '../lib/seo';
import './globals.css';
const title = 'Luvia | Travertino e pedra natural em Portugal';
const description = 'Descubra o travertino Luvia: Rustic, Mix, Light e Vein Cut. Pedra natural para interiores, exteriores e piscinas. Peça orçamento, com entregas em Portugal continental.';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title, description,
  alternates: { canonical: '/' },
  robots: { index: indexable, follow: indexable },
  openGraph: { type: 'website', locale: 'pt_PT', siteName: 'Luvia', url: siteUrl, title, description },
  twitter: { card: 'summary', title, description },
};
const business = {
  '@context': 'https://schema.org', '@type': 'Organization',
  '@id': `${siteUrl}/#organization`, name: 'Luvia', alternateName: 'Lúvia',
  url: siteUrl, logo: `${siteUrl}/images/luvia-color.svg`,
  email: 'info@luvia.pt', telephone: '+351220139599', taxID: '513756353',
  address: { '@type': 'PostalAddress', streetAddress: 'Avenida dos Descobrimentos, 1193 B, sala 13', postalCode: '4400-103', addressLocality: 'Vila Nova de Gaia', addressCountry: 'PT' },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-PT"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, '\\u003c') }}/>{children}</body></html>;
}
