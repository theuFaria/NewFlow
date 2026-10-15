import type { CartLine, Product } from "../products/types";

export type AddToCartStatus =
  | "added"
  | "unavailable"
  | "size-required"
  | "color-required"
  | "invalid-variant"
  | "invalid-quantity"
  | "stock-limit";

export interface CartSelection {
  size?: string;
  color?: string;
  quantity: number;
}

export interface AddToCartResult {
  items: CartLine[];
  status: AddToCartStatus;
}

export interface CartSummary {
  itemCount: number;
  subtotalInCents: number;
}

function fail(items: CartLine[], status: Exclude<AddToCartStatus, "added">): AddToCartResult {
  return { items, status };
}

export function addProductToCart(
  items: CartLine[],
  product: Product,
  selection: CartSelection,
): AddToCartResult {
  const stockLimit = Math.max(0, Math.floor(product.stock));
  if (!product.isAvailable || stockLimit === 0) return fail(items, "unavailable");
  if (!Number.isInteger(selection.quantity) || selection.quantity < 1) {
    return fail(items, "invalid-quantity");
  }

  const size = selection.size ?? (
    product.sizesSource === "name" && product.sizes.length === 1 ? product.sizes[0] : undefined
  );
  const color = selection.color ?? (
    product.colorsSource === "name" && product.colors.length === 1 ? product.colors[0] : undefined
  );
  if (product.sizes.length > 0 && !size) return fail(items, "size-required");
  if (product.colors.length > 0 && !color) return fail(items, "color-required");
  if ((size && !product.sizes.includes(size)) || (color && !product.colors.includes(color))) {
    return fail(items, "invalid-variant");
  }

  const productQuantity = items
    .filter((item) => item.productId === product.id)
    .reduce((total, item) => total + item.quantity, 0);
  if (productQuantity + selection.quantity > stockLimit) return fail(items, "stock-limit");

  const id = JSON.stringify([product.id, size ?? null, color ?? null]);
  const existing = items.find((item) => item.id === id);
  if (existing) {
    return {
      status: "added",
      items: items.map((item) => item.id === id
        ? { ...item, quantity: item.quantity + selection.quantity }
        : item),
    };
  }

  const line: CartLine = {
    id,
    productId: product.id,
    sku: product.sku,
    name: product.name,
    image: product.images[0] ?? "",
    unitPriceInCents: product.priceInCents,
    stockLimit,
    size: size ?? null,
    color: color ?? null,
    quantity: selection.quantity,
  };
  return { status: "added", items: [...items, line] };
}

export function updateCartQuantity(items: CartLine[], lineId: string, requestedQuantity: number): CartLine[] {
  const target = items.find((item) => item.id === lineId);
  if (!target) return items;
  const otherProductQuantity = items
    .filter((item) => item.productId === target.productId && item.id !== lineId)
    .reduce((total, item) => total + item.quantity, 0);
  const maxForLine = Math.max(0, target.stockLimit - otherProductQuantity);
  if (maxForLine === 0) return items.filter((item) => item.id !== lineId);
  const safeRequested = Number.isFinite(requestedQuantity) ? Math.floor(requestedQuantity) : target.quantity;
  const quantity = Math.max(1, Math.min(safeRequested, maxForLine));
  return items.map((item) => item.id === lineId ? { ...item, quantity } : item);
}

export function getCartSummary(items: CartLine[]): CartSummary {
  return items.reduce<CartSummary>((summary, item) => ({
    itemCount: summary.itemCount + item.quantity,
    subtotalInCents: summary.subtotalInCents + item.unitPriceInCents * item.quantity,
  }), { itemCount: 0, subtotalInCents: 0 });
}
