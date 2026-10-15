"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import CartLineItem from "@/components/cart/CartLineItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/components/cart/CartProvider";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotalInCents,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    setQuantity,
  } = useCart();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="cart-drawer-layer">
      <button className="cart-drawer-scrim" type="button" aria-label="Fechar sacola" onClick={closeDrawer} />
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        ref={dialogRef}
      >
        <header className="cart-drawer-header">
          <div>
            <span className="section-kicker">NEW FLOW / SIMULAÇÃO</span>
            <h2 id="cart-drawer-title">Sua sacola <em>({itemCount})</em></h2>
          </div>
          <button
            ref={closeButtonRef}
            className="cart-drawer-close"
            type="button"
            onClick={closeDrawer}
            aria-label="Fechar sacola"
          >
            ×
          </button>
        </header>

        <p className="cart-demo-notice">
          Carrinho demonstrativo. Nenhum pedido, pagamento ou reserva de estoque será realizado.
        </p>

        {items.length === 0 ? (
          <div className="cart-empty-state">
            <span aria-hidden="true">◇</span>
            <h3>Sua sacola está vazia</h3>
            <p>Explore a coleção e adicione uma peça para visualizar a simulação.</p>
            <Link className="button button-primary" href="/catalogo" onClick={closeDrawer}>
              Conhecer a coleção
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  productQuantity={items
                    .filter((line) => line.productId === item.productId)
                    .reduce((total, line) => total + line.quantity, 0)}
                  onQuantityChange={(quantity) => setQuantity(item.id, quantity)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
            <footer className="cart-drawer-footer">
              <CartSummary itemCount={itemCount} subtotalInCents={subtotalInCents} />
              <button className="cart-checkout-disabled" type="button" disabled>
                Finalização ainda não disponível
              </button>
              <Link className="cart-page-link" href="/carrinho" onClick={closeDrawer}>
                Ver sacola completa <span aria-hidden="true">↗</span>
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
