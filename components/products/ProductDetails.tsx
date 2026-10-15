"use client";

import Link from "next/link";
import { useState } from "react";
import AddToCartButton from "@/components/products/AddToCartButton";
import ColorSelector from "@/components/products/ColorSelector";
import ProductGrid from "@/components/products/ProductGrid";
import ProductImage from "@/components/products/ProductImage";
import PriceDisplay from "@/components/products/PriceDisplay";
import QuantitySelector from "@/components/products/QuantitySelector";
import SizeSelector from "@/components/products/SizeSelector";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/products/types";

function initialExplicitChoice(values: string[], source: Product["sizesSource"]): string {
  return source === "name" && values.length === 1 ? values[0] : "";
}

const feedbackByStatus: Record<string, string> = {
  added: "Produto adicionado à sacola demonstrativa.",
  unavailable: "Este produto está indisponível na exportação atual.",
  "size-required": "Selecione um tamanho antes de continuar.",
  "color-required": "Selecione uma cor antes de continuar.",
  "invalid-variant": "A opção selecionada não pertence a este produto.",
  "invalid-quantity": "Selecione uma quantidade válida.",
  "stock-limit": "A quantidade supera o estoque demonstrativo disponível.",
};

export default function ProductDetails({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [size, setSize] = useState(() => initialExplicitChoice(product.sizes, product.sizesSource));
  const [color, setColor] = useState(() => initialExplicitChoice(product.colors, product.colorsSource));
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const { addProduct } = useCart();
  const maxQuantity = Math.max(1, Math.floor(product.stock));

  function addToCart() {
    const status = addProduct(product, {
      size: size || undefined,
      color: color || undefined,
      quantity,
    });
    setFeedback(feedbackByStatus[status]);
  }

  return (
    <>
      <section className="product-detail-section container" aria-labelledby="product-title">
        <nav className="breadcrumbs" aria-label="Trilha de navegação">
          <Link href="/catalogo">Coleção</Link>
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          <div className="product-detail-gallery">
            <div className="product-detail-main-image">
              <ProductImage
                product={product}
                priority
                sizes="(max-width: 760px) 100vw, 55vw"
              />
              <span className="image-illustrative-label">IMAGEM ILUSTRATIVA</span>
            </div>
            <p className="gallery-caption">Representação visual criada para esta demonstração; pode não corresponder ao item físico.</p>
          </div>

          <div className="product-detail-info">
            <span className="product-category-label">{product.category} / NEW FLOW</span>
            <h1 id="product-title">{product.name}</h1>
            <p className="product-detail-sku">CÓDIGO {product.sku}</p>
            <PriceDisplay priceInCents={product.priceInCents} className="product-detail-price" />
            <p className={`product-detail-availability${product.isAvailable ? " is-available" : " is-unavailable"}`}>
              <span aria-hidden="true" />
              {product.isAvailable
                ? "Estoque positivo na planilha — confirme a disponibilidade com a loja."
                : "Sem estoque positivo na exportação da planilha."}
            </p>

            <p className="product-description">
              {product.description ?? "A planilha não inclui uma descrição comercial para esta peça. Confirme composição, modelagem e demais características antes de publicar."}
            </p>

            {product.colors.length > 0 && (
              <ColorSelector
                colors={product.colors}
                source={product.colorsSource}
                value={color}
                onChange={(nextColor) => { setColor(nextColor); setFeedback(""); }}
                disabled={!product.isAvailable}
              />
            )}
            {product.sizes.length > 0 && (
              <SizeSelector
                sizes={product.sizes}
                source={product.sizesSource}
                value={size}
                onChange={(nextSize) => { setSize(nextSize); setFeedback(""); }}
                disabled={!product.isAvailable}
              />
            )}

            <div className="product-purchase-row">
              <QuantitySelector
                value={quantity}
                max={maxQuantity}
                onChange={setQuantity}
                disabled={!product.isAvailable}
              />
              <AddToCartButton
                className="product-detail-add"
                onClick={addToCart}
                disabled={!product.isAvailable}
              >
                {product.isAvailable ? "Adicionar à sacola" : "Indisponível"}
                <span aria-hidden="true">↗</span>
              </AddToCartButton>
            </div>
            <p className="product-feedback" aria-live="polite">{feedback}</p>
            <p className="product-demo-disclaimer">
              Compra simulada. O carrinho não cria pedidos, não recebe pagamentos e não reserva estoque.
            </p>
            <Link className="product-continue-link" href="/catalogo">← Continuar comprando</Link>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products-section" aria-labelledby="related-products-title">
          <div className="container">
            <header className="related-products-heading">
              <span className="section-kicker">02 / MAIS PARA EXPLORAR</span>
              <h2 id="related-products-title">Continue <em>descobrindo.</em></h2>
            </header>
            <ProductGrid products={relatedProducts} compact />
          </div>
        </section>
      )}
    </>
  );
}
