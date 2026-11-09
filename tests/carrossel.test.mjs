import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import modulo from "../components/produto/ProdutoCarrosel.tsx";

const ProdutoCarrosel = modulo.default;

test("carrossel oferece navegação somente para múltiplas imagens", () => {
  const props = { nomeProduto: "Camiseta", imagens: ["/images/a.png", "/images/b.png"] };
  const comDuas = renderToStaticMarkup(createElement(ProdutoCarrosel, props));
  const comUma = renderToStaticMarkup(createElement(ProdutoCarrosel, { ...props, imagens: ["/images/a.png"] }));
  assert.match(comDuas, /Ver imagem anterior/);
  assert.match(comDuas, /Ver próxima imagem/);
  assert.doesNotMatch(comUma, /Ver imagem anterior/);
});
