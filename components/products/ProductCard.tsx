import Link from "next/link";
import ProductImage from "@/components/products/ProductImage";
import ProductQuickActions from "@/components/products/ProductQuickActions";
import PriceDisplay from "@/components/products/PriceDisplay";
import type { Product } from "@/lib/products/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-card-media">
        <Link
          className="product-card-image-link"
          href={`/produto/${product.slug}`}
          aria-label={`Ver detalhes: ${product.name}`}
        >
          <ProductImage product={product} />
        </Link>
        <span className={`product-stock-badge${product.isAvailable ? " is-available" : " is-unavailable"}`}>
          {product.isAvailable ? "Disponível na demonstração" : "Indisponível"}
        </span>
        <ProductQuickActions product={product} />
      </div>
      <div className="product-card-content">
        <span className="product-category-label">{product.category}</span>
        <h3>
          <Link href={`/produto/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="product-card-price-row">
          <PriceDisplay priceInCents={product.priceInCents} />
        </div>
        <Link className="product-details-link" href={`/produto/${product.slug}`}>
          Ver detalhes <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
