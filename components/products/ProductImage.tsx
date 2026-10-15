"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products/types";

export default function ProductImage({
  product,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1000px) 33vw, 25vw",
}: {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const source = product.images[0] ?? "";
  const [failed, setFailed] = useState(!source);


  if (failed) {
    return (
      <div
        className={`product-image-fallback ${className}`.trim()}
        role="img"
        aria-label={`${product.name}: imagem ilustrativa indisponível`}
      >
        <span aria-hidden="true">NEW FLOW</span>
        <strong>{product.category}</strong>
        <small>{product.sku}</small>
      </div>
    );
  }

  return (
    <Image
      className={className}
      src={source}
      alt={`${product.name} — imagem ilustrativa`}
      fill
      sizes={sizes}
      priority={priority}
      quality={82}
      onError={() => setFailed(true)}
    />
  );
}
