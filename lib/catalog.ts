export const products = [
 {id:'rustic',name:'Rustic',code:'COM3',price:22.90,image:'/images/product-rustic.webp',tag:'Autêntico por natureza',description:'Textura expressiva, variações de tonalidade e todo o carácter da pedra natural.'},
 {id:'mix',name:'Mix',code:'MIX',price:27.90,image:'/images/product-mix.webp',tag:'Equilíbrio em cada detalhe',description:'Uma combinação de tons quentes e nuances naturais para espaços com personalidade.'},
 {id:'light',name:'Light',code:'MOK',price:34.90,image:'/images/product-light.webp',tag:'Mais luz. Mais leveza.',description:'Tonalidades claras e suaves que dão continuidade a ambientes luminosos e intemporais.'},
 {id:'vein-cut',name:'Vein Cut',code:'VEIN CUT',price:64.90,image:'/images/product-vein-cut.webp',tag:'Um desenho singular',description:'Um corte que revela os veios da pedra e valoriza o seu desenho linear.'}
] as const;
export const euro = (value:number) => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(value);
