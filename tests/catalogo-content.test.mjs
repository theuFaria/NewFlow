import test from "node:test";
import assert from "node:assert/strict";

test("importar o conteúdo do catálogo não consulta o ERP", async () => {
  const originalFetch = globalThis.fetch;
  let chamadas = 0;
  globalThis.fetch = async () => {
    chamadas++;
    throw new Error("Requisição inesperada ao importar o módulo");
  };
  try {
    const modulo = await import("../app/catalogo/content.ts");
    assert.equal(typeof (modulo.buscarProdutos ?? modulo.default?.buscarProdutos), "function");
    assert.equal(chamadas, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
