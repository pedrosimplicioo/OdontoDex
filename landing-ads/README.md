# Landing de tráfego pago — OdontoDex

Página independente criada exclusivamente para campanhas pagas.

## Arquivos

- `index.html`: conteúdo, SEO, Open Graph e dados estruturados.
- `landing-ads.css`: layout responsivo da landing.
- `landing-ads.js`: vídeo, animações leves, UTMs e instrumentação existente.
- `assets/demonstracao-odontodex.mp4`: local reservado para o vídeo final.

## URL planejada

`https://www.odontodex.com.br/landing-ads/`

## Instrumentação

- Reutiliza `src/scripts/meta-pixel.js`.
- Reutiliza `odontodex_session_id` e a coleção `landing_stats`.
- Reutiliza os eventos atuais de CTA, visualização de seção e profundidade de rolagem.
- Não registra eventos quando aberta por arquivo local ou localhost.

Nenhum arquivo da landing atual ou do aplicativo é importado para edição por esta página.
