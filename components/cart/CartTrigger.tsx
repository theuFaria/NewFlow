"use client";

import { useCart } from "@/components/cart/CartProvider";

export default function CartTrigger() {
  const { itemCount, isDrawerOpen, openDrawer } = useCart();
  return (
    <button
      className="nav-cart"
      type="button"
      aria-label={`Abrir sacola demonstrativa, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
      aria-expanded={isDrawerOpen}
      onClick={openDrawer}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M5 8h14l1 12H4L5 8Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>Sacola</span>
      <span className="nav-cart-count" aria-hidden="true">{itemCount}</span>
    </button>
  );
}
