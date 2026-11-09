import test from "node:test";
import assert from "node:assert/strict";
import modulo from "../lib/gestaoclick/produto.ts";

const { unificarProdutos } = modulo;
const item = (codigo_interno, estoque, id) => ({
  id, nome: `Produto ${id}`, codigo_interno, estoque, valor: 10, fotos: [],
});

test("unifica produtos correspondentes e preserva exclusivos das duas lojas", async () => {
  const newFlow = [item("A", 2, 1), item("N", 4, 2)];
  const intimidade = [item("A", 3, 3), item("I", 5, 4)];
  const resultado = await unificarProdutos(intimidade, newFlow);
  assert.deepEqual(resultado.map(({ codigo_interno, estoque }) => [codigo_interno, estoque]), [
    ["I", 5], ["A", 5], ["N", 4],
  ]);
});

test("código vazio não une itens diferentes", async () => {
  const resultado = await unificarProdutos([item("", 5, 2)], [item("", 2, 1)]);
  assert.equal(resultado.length, 2);
});
