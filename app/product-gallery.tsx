'use client';
import { useState } from 'react';
import type { Variant } from '../lib/variants';

export default function ProductGallery({ name, variant }: { name: string; variant: Variant }) {
  const [index, setIndex] = useState(0);
  const imagePath = (position: number, small = false) =>
    '/images/variantes/' + variant.sku + (position ? '-' + position : '') + (small ? '-sm' : '') + '.webp';
  const title = name + ' · ' + variant.label;
  return <figure className="variant-gallery">
    <div className="variant-frame">
      <img src={imagePath(index)} alt={`Aplicação de travertino ${title}, fotografia ${index + 1}`} loading="lazy" />
    </div>
    <figcaption aria-live="polite"><strong>{title}</strong><span>{index + 1} / {variant.count}</span></figcaption>
    <div className="variant-strip" role="group" aria-label={`Fotografias de ${title}`}>
      {Array.from({ length: variant.count }, (_, i) =>
        <button key={i} type="button" aria-pressed={index === i} aria-label={`Ver fotografia ${i + 1} de ${title}`} onClick={() => setIndex(i)}>
          <img src={imagePath(i, true)} alt="" loading="lazy" />
        </button>)}
    </div>
  </figure>;
}
