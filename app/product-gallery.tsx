'use client';
import { useState } from 'react';

const scenes: Record<string, { src: string; alt: string }[]> = {
  light: [
    { src: '/images/light-1.webp', alt: 'Travertino Light no pavimento de uma casa de banho' },
    { src: '/images/light-2.webp', alt: 'Travertino Light num terraço com jardim' },
    { src: '/images/light-3.webp', alt: 'Travertino Light no pavimento de um hall de entrada' },
  ],
  mix: [
    { src: '/images/mix-2.webp', alt: 'Travertino Mix no pavimento em redor de uma piscina' },
    { src: '/images/mix-1.webp', alt: 'Travertino Mix no pavimento de uma sala' },
  ],
  rustic: [
    { src: '/images/rustic-1.webp', alt: 'Travertino Rustic no pavimento de uma loja' },
    { src: '/images/rustic-2.webp', alt: 'Travertino Rustic no pavimento de uma padaria' },
    { src: '/images/rustic-3.webp', alt: 'Travertino Rustic num terraço exterior' },
  ],
};

export default function ProductGallery({ id, name, number, sample }: { id: string; name: string; number: number; sample: string }) {
  const [selected, setSelected] = useState(0);
  const images = scenes[id];
  return <div className="vein-gallery" aria-label={`Imagens de travertino ${name}`}>
    <div className="product-photo">
      <span className="product-number">{String(number).padStart(2, '0')}</span>
      <img className="product-scene" src={images[selected].src} alt={images[selected].alt} loading="lazy" width="1440" height="1080"/>
      <img className="product-sample" src={sample} alt={`Detalhe de travertino ${name}`} loading="lazy" width="110" height="100"/>
    </div>
    <div className="vein-thumbnails product-thumbnails" role="group" aria-label={`Escolher imagem de ${name}`}>
      {images.map((image, index) => <button key={image.src} type="button" aria-label={`Ver imagem ${index + 1}: ${image.alt}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={image.src} alt="" loading="lazy" width="144" height="108"/></button>)}
    </div>
  </div>;
}
