"use client";

import Link from "next/link";
import CartLineItem from "@/components/cart/CartLineItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/components/cart/CartProvider";

export default function CartPageContent() {
  const { items, itemCount, subtotalInCents, clearCart, removeItem, setQuantity } = useCart();

  return (
    <section className="cart-page container" aria-labelledby="cart-page-title">
      <div className="cart-page-heading">
        <div>
          <span className="section-kicker">NEW FLOW / SIMULAÇÃO</span>
          <h1 id="cart-page-title">Sua <em>sacola.</em></h1>
          <p>Uma prévia de como suas escolhas aparecerão no carrinho.</p>
        </div>
        {items.length > 0 && (
          <button className="cart-clear-button" type="button" onClick={clearCart}>
            Esvaziar sacola
          </button>
        )}
      </div>

      <p className="cart-demo-notice">
        Esta é uma demonstração: não há pedido real, pagamento ou reserva de estoque.
      </p>

      {items.length === 0 ? (
        <div className="cart-page-empty">
          <span aria-hidden="true">◇</span>
          <h2>Ainda não há itens por aqui</h2>
          <p>Volte para a coleção e descubra as peças da New Flow.</p>
          <Link className="button button-primary" href="/catalogo">
            Ir para o catálogo <span aria-hidden="true">↗</span>
          </Link>
        </div>
      ) : (
        <div className="cart-page-layout">
          <div className="cart-page-items">
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
            <Link className="cart-continue-link" href="/catalogo">
              ← Continuar explorando
            </Link>
          </div>
          <aside className="cart-page-summary" aria-label="Resumo da sacola">
            <h2>Resumo</h2>
            <CartSummary itemCount={itemCount} subtotalInCents={subtotalInCents} />
            <button className="cart-checkout-disabled" type="button" disabled>
              Finalização ainda não disponível
            </button>
            <p className="cart-future-note">Pagamento e pedidos reais não fazem parte desta versão.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
