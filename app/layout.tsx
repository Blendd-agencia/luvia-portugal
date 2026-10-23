import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Luvia | Travertino e pedra natural em Portugal',description:'Conheça as quatro famílias de travertino Luvia: Rustic, Mix, Light e Vein Cut. Peça uma proposta para o seu projeto em Portugal.',robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-PT"><body>{children}</body></html>}
