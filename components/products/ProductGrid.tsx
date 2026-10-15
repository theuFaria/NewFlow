"use client";

import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/lib/products/types";

export default function ProductGrid({
  products,
  compact = false,
}: {
  products: Product[];
  compact?: boolean;
}) {
  if (products.length === 0) {
    return <p className="catalog-empty">Nenhum produto encontrado.</p>;
  }
  return (
    <div className={`product-grid${compact ? " is-compact" : ""}`}>
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
