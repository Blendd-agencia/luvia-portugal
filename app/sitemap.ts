import type { MetadataRoute } from 'next';
import { indexable, siteUrl } from '../lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return indexable ? [{ url: `${siteUrl}/` }] : [];
}
