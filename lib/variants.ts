export type Variant = { label: string; sku: string; count: number };
export const variants: Record<string, Variant[]> = {
  rustic: [
    { label: 'Opus de 4 formatos', sku: 'com3op12', count: 4 },
    { label: '40,6 × 61 cm', sku: 'com3461', count: 4 },
  ],
  mix: [
    { label: 'Opus de 4 formatos', sku: 'stmixop12', count: 4 },
    { label: '40,6 × 61 cm', sku: 'stmix461', count: 6 },
  ],
  light: [
    { label: 'Opus de 4 formatos', sku: 'stmokop12', count: 6 },
    { label: '40,6 × 61 cm', sku: 'stmok461', count: 6 },
  ],
  'vein-cut': [
    { label: 'Poro aberto', sku: 'mok361nrvc', count: 4 },
    { label: 'Resinado', sku: 'mok361vc', count: 4 },
  ],
};
