import { addProductToCart } from "./cartLogic.ts";
import type { Product, CartLine } from "../products/types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function restoreCart(value: unknown, products: Product[]): CartLine[] {
  if (!Array.isArray(value)) return [];
  let restored: CartLine[] = [];

  for (const candidate of value) {
    if (!isRecord(candidate) || typeof candidate.productId !== "string") continue;
    const product = products.find((item) => item.id === candidate.productId && item.isAvailable);
    if (!product || (typeof candidate.sku === "string" && candidate.sku !== product.sku)) continue;
    if (typeof candidate.quantity !== "number" || !Number.isFinite(candidate.quantity) || candidate.quantity < 1) continue;

    const existingQuantity = restored
      .filter((item) => item.productId === product.id)
      .reduce((total, item) => total + item.quantity, 0);
    const available = Math.max(0, Math.floor(product.stock) - existingQuantity);
    const quantity = Math.min(Math.floor(candidate.quantity), available);
    if (quantity < 1) continue;

    const result = addProductToCart(restored, product, {
      size: typeof candidate.size === "string" ? candidate.size : undefined,
      color: typeof candidate.color === "string" ? candidate.color : undefined,
      quantity,
    });
    if (result.status === "added") restored = result.items;
  }

  return restored;
}
