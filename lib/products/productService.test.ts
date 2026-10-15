import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPrice, getProductBySlug, getProducts, getRelatedProducts } from "./productService.ts";

describe("product service", () => {
  it("provides exactly twenty unique normalized demo products", async () => {
    const products = await getProducts();
    assert.equal(products.length, 20);
    assert.equal(new Set(products.map((product) => product.id)).size, 20);
    assert.ok(products.every((product) => !("cost" in product) && !("barcode" in product)));
  });

  it("looks up a product by slug and returns null for an unknown slug", async () => {
    const products = await getProducts();
    assert.equal(await getProductBySlug(products[0].slug), products[0]);
    assert.equal(await getProductBySlug("produto-inexistente"), null);
  });

  it("returns at most four related items without the current product", async () => {
    const products = await getProducts();
    const related = await getRelatedProducts(products[0], 4);
    assert.ok(related.length <= 4);
    assert.ok(related.every((product) => product.id !== products[0].id));
  });

  it("formats integer cents as Brazilian reais", () => {
    assert.ok(formatPrice(4999).includes("49,99"));
    assert.ok(formatPrice(11729).includes("117,29"));
  });
});
