import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addProductToCart, getCartSummary, updateCartQuantity } from "./cartLogic.ts";
import type { Product } from "../products/types.ts";

const product: Product = {
  id: "2444",
  sku: "2444",
  name: "BERMUDA COM BOLSO SANTUA T: G1; COR: FUCSIA",
  slug: "bermuda-2444",
  description: null,
  priceInCents: 11729,
  stock: 2,
  images: ["/images/products/2444.webp"],
  category: "Fitness",
  sizes: ["P", "G"],
  sizesSource: "demo",
  colors: ["FUCSIA"],
  colorsSource: "name",
  isAvailable: true,
  isDemo: true,
};

const selection = { size: "P", color: "FUCSIA", quantity: 1 };

describe("cart domain logic", () => {
  it("merges the same product and variant into one line", () => {
    const first = addProductToCart([], product, selection);
    assert.equal(first.status, "added");
    const second = addProductToCart(first.items, product, selection);
    assert.equal(second.status, "added");
    assert.equal(second.items.length, 1);
    assert.equal(second.items[0].quantity, 2);
  });

  it("keeps different sizes as separate lines", () => {
    const first = addProductToCart([], product, selection);
    const second = addProductToCart(first.items, product, { ...selection, size: "G" });
    assert.equal(second.items.length, 2);
  });

  it("requires a choice when multiple sizes exist", () => {
    const result = addProductToCart([], product, { color: "FUCSIA", quantity: 1 });
    assert.equal(result.status, "size-required");
    assert.equal(result.items.length, 0);
  });

  it("does not add unavailable products", () => {
    const result = addProductToCart([], { ...product, isAvailable: false, stock: 0 }, selection);
    assert.equal(result.status, "unavailable");
    assert.equal(result.items.length, 0);
  });

  it("does not let combined variants exceed the exported stock", () => {
    const first = addProductToCart([], product, selection);
    const result = addProductToCart(first.items, product, { ...selection, size: "G", quantity: 2 });
    assert.equal(result.status, "stock-limit");
    assert.equal(result.items.length, 1);
  });

  it("calculates subtotal and quantity for the cart", () => {
    const result = addProductToCart([], product, { ...selection, quantity: 2 });
    assert.deepEqual(getCartSummary(result.items), { itemCount: 2, subtotalInCents: 23458 });
  });

  it("clamps line quantity to the demo stock", () => {
    const added = addProductToCart([], product, selection);
    const updated = updateCartQuantity(added.items, added.items[0].id, 9);
    assert.equal(updated[0].quantity, 2);
  });
});
