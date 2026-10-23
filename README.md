# Luvia Portugal · Next.js

Primeira versão para revisão. Next.js App Router, TypeScript, CSS e exportação estática.

## Executar

Node.js 22+; `npm ci`; `npm run dev`. Produção: `npm run build` gera `out/`.

## Conteúdo

- Quatro famílias e preços retirados da referência do cliente, em `lib/catalog.ts`.
- Logótipo extraído do PDF de identidade. Paleta visual aproximada do PDF.
- Fotografias de ambiente fornecidas anteriormente; imagens de produto extraídas da nova referência. Substituir os recortes por originais de alta resolução, especialmente Vein Cut, antes do lançamento.
- Bordaduras de piscina disponíveis como interesse no formulário, sem atribuir especificações ou preços não fornecidos.

## Pedidos de orçamento: integração pendente

O formulário valida os dados e pré-seleciona a família ao clicar num produto. Sem `NEXT_PUBLIC_QUOTE_ENDPOINT`, informa que o envio não está disponível e nunca simula sucesso.

Configurar um endpoint público HTTPS que aceite POST JSON e devolva 2xx apenas depois de gravar/encaminhar o pedido. Deve permitir CORS do domínio final, validar e limitar os campos no servidor, aplicar controlo de abuso e proteger os dados. Não enviar segredos para o browser. O serviço destinatário e a caixa de email ainda não foram fornecidos; não há backend, CRM ou envio de emails ativos nesta versão.

Campos: name, email, phone, postal_code, product, quantity, message, contact_permission, website (honeypot), attribution, source. `quantity` é m², exceto bordaduras (metros lineares). O honeypot é apenas uma proteção auxiliar. Há timeout e estados de erro/sucesso; nenhuma submissão foi feita a serviços externos.

UTMs/gclid são lidos da URL apenas no envio, sem armazenamento local. Após resposta 2xx, é emitido o evento de browser `luvia:quote-success`. Não existem tags GA4/Ads, cookies analíticos ou medição de conversões ativa. Só ligar tracking após definir a gestão de consentimento e testar com o endpoint final.

## Antes do lançamento em luvia.pt

1. Confirmar IVA, formatos/espessuras a que os preços se aplicam, condições comerciais, disponibilidade e entrega.
2. Validar códigos: COM3, MIX e MOK seguem a última mensagem (a imagem indica STMIX/STMOK).
3. Obter imagens originais dos quatro produtos e das bordaduras.
4. Definir destinatário dos pedidos e configurar/testar endpoint, incluindo falhas e duplicados.
5. Completar política de privacidade, identificação legal e contacto do responsável. O diálogo atual explica a finalidade mas não substitui a política completa.
6. Retirar `robots: noindex` em `app/layout.tsx` e configurar metadataBase/canonical para https://luvia.pt apenas no lançamento.
7. Publicar na conta de alojamento escolhida e apontar DNS. Esta versão não modifica o domínio luvia.pt.

## Validação

Executar `npm run typecheck` e `npm run build`. A revisão visual em browser e os testes de integração do formulário devem ser concluídos antes do lançamento público.

## Atualização de identidade
Tipografia confirmada em pattom.fr (CSS Elementor post-6): Bebas Neue nos títulos/botões e Figtree no texto. Fontes alojadas localmente. Logótipos SVG extraídos dos contornos vetoriais originais do PDF; cores digitais amostradas da sua renderização, sem afirmar conversão Pantone oficial.

## Redesign claro · 15 outubro
Manual revisto por inteiro: o PDF identifica Didot LT Std Bold e ITC Franklin Gothic Std Book nas aplicações. Os ficheiros completos/licenças web não foram fornecidos. Títulos usam Bodoni Moda (aproximação da família Didone, alojada localmente), texto usa Franklin Gothic Book quando instalada e Arial como fallback. Não se afirma que Bodoni é a fonte exata do manual. Tipografia Pattom removida. Fundos escuros removidos. Motivos SVG recriados a partir dos círculos, diagonais e ziguezagues do manual. Abertura dividida, fotografia sem sombreado e quatro famílias em grelha editorial de duas colunas, uma em mobile. Imagem Vein Cut continua a ser o recorte da referência fornecida, por substituir pelo original.

## Identidade: pedra natural
Removidos círculos decorativos, ondas e ziguezagues. Substituídos por módulos retangulares, juntas ortogonais e cortes retos. Tipografia, cores, contactos e catálogo mantidos.

Grafismos ajustados à seleção anotada do cliente: moldura quadrada, quadrados desencontrados, triângulos e diagonais. Vein Cut: 64,90 €/m², IVA incluído; IVA dos restantes produtos por confirmar.
