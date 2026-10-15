import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { restoreCart } from "./cartStorage.ts";
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

describe("cart local storage restoration", () => {
  it("keeps only valid products and clamps restored quantities to exported stock", () => {
    const restored = restoreCart([
      { productId: "2444", sku: "2444", size: "P", color: "FUCSIA", quantity: 5 },
      { productId: "unknown", sku: "unknown", size: "P", quantity: 1 },
      { productId: "2444", sku: "2444", size: "NOT-A-SIZE", color: "FUCSIA", quantity: 1 },
    ], [product]);
    assert.equal(restored.length, 1);
    assert.equal(restored[0].quantity, 2);
    assert.equal(restored[0].unitPriceInCents, 11729);
    assert.equal(restored[0].image, "/images/products/2444.webp");
  });

  it("returns an empty cart for non-array or unavailable products", () => {
    assert.deepEqual(restoreCart({ invalid: true }, [product]), []);
    assert.deepEqual(restoreCart([
      { productId: "2444", size: "P", color: "FUCSIA", quantity: 1 },
    ], [{ ...product, isAvailable: false, stock: 0 }]), []);
  });
});
