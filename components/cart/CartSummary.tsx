import PriceDisplay from "@/components/products/PriceDisplay";

export default function CartSummary({
  itemCount,
  subtotalInCents,
}: {
  itemCount: number;
  subtotalInCents: number;
}) {
  return (
    <div className="cart-summary">
      <div className="cart-summary-row">
        <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "itens"})</span>
        <PriceDisplay priceInCents={subtotalInCents} />
      </div>
      <p>Frete e condições de entrega serão definidos em uma etapa futura.</p>
    </div>
  );
}
