import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import catalogoModule from "../app/catalogo/CatalogoProdutos.tsx";
import cardModule from "../components/produto/ProductCard.tsx";

const CatalogoProdutos = catalogoModule.default;
const ProductCard = cardModule.default;

const produto = {
  id: 1,
  nome: "Produto de teste",
  codigo_interno: "A1",
  valor: 115,
  estoque: 2,
  fotos: [],
};

test("catálogo vazio informa que ainda não há produtos", () => {
  const html = renderToStaticMarkup(createElement(CatalogoProdutos, { produtos: [] }));
  assert.match(html, /Nenhum produto disponível/);
});

test("catálogo apresenta cada produto recebido uma única vez", () => {
  const html = renderToStaticMarkup(createElement(CatalogoProdutos, { produtos: [produto] }));
  assert.equal(html.split("Produto De Teste").length - 1, 1);
  assert.doesNotMatch(html, /Nenhum produto disponível/);
});

test("card exibe observação apenas quando informada", () => {
  const props = { nome_produto: "Camiseta", imagens: [], valor: 10 };
  const comObs = renderToStaticMarkup(createElement(ProductCard, { ...props, obs: "Peça exclusiva" }));
  const semObs = renderToStaticMarkup(createElement(ProductCard, props));
  assert.match(comObs, /Peça exclusiva/);
  assert.doesNotMatch(semObs, /Peça exclusiva/);
});
