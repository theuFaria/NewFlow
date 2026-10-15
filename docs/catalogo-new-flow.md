# Catálogo demonstrativo New Flow

## Como executar

Na pasta do projeto:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000/catalogo`. O detalhe de cada produto usa `/produto/<slug>`, e a sacola completa fica em `/carrinho`.

Validação local:

```bash
npm test
npm run test:import
npm run lint
npm run build
```

## Produtos e importação da planilha

A fonte pública normalizada é `data/products.demo.json`. Ela contém exatamente 20 registros selecionados da exportação `Produtos (1).xlsx`. Foram priorizados os 12 registros com estoque positivo; os 8 restantes completam a seleção em ordem da planilha. O processo preserva o código, nome, preço de venda e estoque, convertendo o preço para centavos inteiros.

O adaptador/importador fica em `scripts/import_products.py` e usa apenas a biblioteca padrão do Python. Para uma nova planilha:

```bash
python scripts/import_products.py "C:/caminho/Produtos.xlsx" --out data/products.demo.json --limit 20
```

O script valida colunas obrigatórias, códigos repetidos, preço e estoque, prioriza estoque positivo e preserva imagens/descrições/variações já associadas ao mesmo SKU quando o arquivo de saída anterior existe. Também é possível apontar metadados antigos com `--existing caminho/anterior.json`. Custos, código de barras, NCM e data administrativa não são publicados no JSON.

Na planilha atual, os itens com tamanho/cor escritos explicitamente no nome preservam essas opções. Nos demais, a grade P/M/G/GG está marcada como demonstrativa; cores não indicadas não são inferidas. Estoque total não é distribuído entre tamanhos. O importador seleciona uma única coleção, sem somar cadastros de lojas que compartilham o mesmo estoque físico.

## Como alterar um produto

Edite o objeto correspondente em `data/products.demo.json`:

- `name`, `priceInCents`, `stock`, `description`, `category` e `images`;
- valores monetários permanecem em centavos (`4999` = R$ 49,99);
- `sizesSource` e `colorsSource` distinguem opções do cadastro (`name`) de opções de demonstração (`demo`);
- `isAvailable` deve continuar coerente com `stock > 0`.

As colunas internas da planilha são convertidas pelo importador; os componentes React usam somente o contrato `Product` de `lib/products/types.ts`.

## Como substituir as imagens

As 20 imagens são ilustrações geradas para a demonstração e estão em `public/images/products/<SKU>.webp`, em 1000 × 1250 px. Para trocar uma foto, substitua o arquivo WebP mantendo o mesmo nome, ou edite o caminho `images` do SKU no JSON. Não é necessário alterar JSX. `components/products/ProductImage.tsx` apresenta um fallback acessível quando o arquivo falha.

`scripts/fetch_product_images.mjs` registra as fontes geradas e converte as imagens para WebP; os links de origem podem expirar. Para uma troca durável, prefira copiar a nova imagem para o caminho local do SKU e atualize `images` se o nome mudar.

## Como alterar os cards e o catálogo

- `components/products/ProductCard.tsx`: estrutura visual reutilizada por todos os produtos.
- `components/products/ProductQuickActions.tsx`: escolha rápida de tamanho e inclusão na sacola.
- `components/products/ProductGrid.tsx`: renderização dinâmica da coleção.
- `app/catalogo/catalogo.css`: grid, hover, responsividade, detalhes de produto e estilos da sacola.
- `app/catalogo/page.tsx`: título, introdução e quantidade exibida.

No desktop, o painel de compra rápida aparece ao passar o mouse ou focar o card. Em dispositivos touch, o botão “Compra rápida” revela as opções sem depender de hover.

## Como funciona o carrinho

`components/cart/CartProvider.tsx` mantém o estado global; `lib/cart/cartLogic.ts` implementa regras e cálculos; `lib/cart/cartStorage.ts` valida os dados recuperados. A persistência usa `localStorage` na chave `new-flow-cart-v1`, somente no navegador. Linhas da mesma peça e combinação de variações são agrupadas; outras variações ficam separadas. Quantidade e subtotal são calculados em memória e os itens persistem após atualização da página.

O drawer abre pelo botão “Sacola” no cabeçalho. A rota `/carrinho` exibe a mesma coleção de itens, remoção, alteração de quantidade e subtotal. O controle de finalização permanece desabilitado.

## Integração futura com o GestãoClick

Os componentes dependem do modelo tipado em `lib/products/types.ts` e do serviço central em `lib/products/productService.ts`. Para substituir o JSON, implemente a obtenção de dados em um backend seguro e adapte a resposta para `Product` no serviço/adaptador. Não coloque credenciais do GestãoClick no navegador. Cards, páginas e carrinho podem continuar consumindo o mesmo contrato.

A integração futura ainda precisará resolver sincronização do estoque compartilhado, concorrência na última unidade e validação em servidor antes de qualquer venda real.

## Limitações desta demonstração

- As 20 imagens são ilustrações geradas por IA e não representam fielmente peças do estoque.
- Grades P/M/G/GG sem indicação no nome são simuladas; cores não indicadas não foram inventadas.
- Tamanho/cor explicitamente presentes no nome foram mantidos, mas não há estoque separado por variante.
- Estoque é uma fotografia estática da planilha e precisa ser confirmado com a loja.
- Não há pagamentos, checkout, pedidos reais, reserva ou baixa de estoque, transportadoras, autenticação ou integração com WhatsApp.
- O carrinho é local ao navegador e serve somente para apresentação; a arquitetura não está pronta para aceitar vendas.
