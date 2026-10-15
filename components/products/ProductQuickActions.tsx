"use client";

import { useState } from "react";
import AddToCartButton from "@/components/products/AddToCartButton";
import ColorSelector from "@/components/products/ColorSelector";
import SizeSelector from "@/components/products/SizeSelector";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/products/types";

function initialSingleChoice(values: string[], source: Product["sizesSource"]): string {
  return source === "name" && values.length === 1 ? values[0] : "";
}

export default function ProductQuickActions({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(() => initialSingleChoice(product.sizes, product.sizesSource));
  const [selectedColor, setSelectedColor] = useState(() => initialSingleChoice(product.colors, product.colorsSource));
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { addProduct } = useCart();

  function addQuickly() {
    const status = addProduct(product, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity: 1,
    });
    const messages: Record<string, string> = {
      added: "Adicionado à sacola demonstrativa.",
      unavailable: "Produto sem estoque positivo na planilha.",
      "size-required": "Escolha um tamanho para continuar.",
      "color-required": "Escolha uma cor para continuar.",
      "invalid-variant": "Essa opção não está disponível neste cadastro.",
      "invalid-quantity": "Quantidade inválida.",
      "stock-limit": "Limite do estoque demonstrativo atingido.",
    };
    setFeedback(messages[status]);
  }

  return (
    <div className={`product-quick-actions${isExpanded ? " is-expanded" : ""}`}>
      <button
        className="quick-mobile-toggle"
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`quick-actions-${product.id}`}
        disabled={!product.isAvailable}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        {product.isAvailable ? (isExpanded ? "Fechar opções" : "Compra rápida") : "Indisponível"}
      </button>
      <div className="quick-actions-panel" id={`quick-actions-${product.id}`}>
        <span className="quick-actions-label">COMPRA RÁPIDA</span>
        {product.sizesSource === "demo" && (
          <small className="quick-demo-note">Tamanhos ilustrativos</small>
        )}
        <SizeSelector
          sizes={product.sizes}
          source={product.sizesSource}
          value={selectedSize}
          onChange={setSelectedSize}
          disabled={!product.isAvailable}
          compact
        />
        {product.colors.length > 1 && (
          <ColorSelector
            colors={product.colors}
            source={product.colorsSource}
            value={selectedColor}
            onChange={setSelectedColor}
            disabled={!product.isAvailable}
          />
        )}
        <AddToCartButton
          className="quick-add-button"
          onClick={addQuickly}
          disabled={!product.isAvailable}
        >
          Adicionar à sacola <span aria-hidden="true">↗</span>
        </AddToCartButton>
        <span className="quick-feedback" aria-live="polite">{feedback}</span>
      </div>
    </div>
  );
}
