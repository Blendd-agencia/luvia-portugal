'use client';
import { useState } from 'react';
const images = [
  { src: '/images/vein-cut-3.webp', alt: 'Travertino Vein Cut aplicado numa parede de sala' },
  { src: '/images/vein-cut-1.webp', alt: 'Travertino Vein Cut no pavimento de uma casa de banho luminosa' },
  { src: '/images/vein-cut-4.webp', alt: 'Travertino Vein Cut nas paredes de uma casa de banho' },
  { src: '/images/vein-cut-2.webp', alt: 'Pormenor do pavimento de travertino Vein Cut numa casa de banho' },
];
export default function VeinCutGallery() {
  const [selected, setSelected] = useState(0);
  return <div className="vein-gallery" aria-label="Imagens de travertino Vein Cut">
    <div className="product-photo"><span className="product-number">04</span><img className="product-scene" src={images[selected].src} alt={images[selected].alt} loading="lazy" width="1440" height="1080"/></div>
    <div className="vein-thumbnails" role="group" aria-label="Escolher imagem de Vein Cut">{images.map((image, index) => <button key={image.src} type="button" aria-label={`Ver imagem ${index + 1}: ${image.alt}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={image.src} alt="" loading="lazy" width="144" height="108"/></button>)}</div>
  </div>;
}
