
import productData from "../../data/products.demo.json" with { type: "json" };
import type { Product } from "./types";

const products = productData as Product[];

export async function getProducts(): Promise<Product[]> {
  return [...products];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (limit <= 0) return [];
  const others = products.filter((item) => item.id !== product.id);
  const sameCategory = others.filter((item) => item.category === product.category);
  const selected = [...sameCategory, ...others.filter((item) => item.category !== product.category)];
  return selected.slice(0, limit);
}

export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceInCents / 100);
}
