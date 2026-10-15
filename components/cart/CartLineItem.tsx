import Image from "next/image";
import PriceDisplay from "@/components/products/PriceDisplay";
import type { CartLine } from "@/lib/products/types";

export default function CartLineItem({
  item,
  productQuantity,
  onQuantityChange,
  onRemove,
}: {
  item: CartLine;
  productQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <article className="cart-line-item">
      <div className="cart-line-image">
        {item.image ? (
          <Image src={item.image} alt="" fill sizes="76px" />
        ) : (
          <span aria-hidden="true">NF</span>
        )}
      </div>
      <div className="cart-line-main">
        <div className="cart-line-top">
          <div>
            <span className="cart-line-sku">CÓD. {item.sku}</span>
            <h3>{item.name}</h3>
            {(item.size || item.color) && (
              <p className="cart-line-variants">
                {item.size ? `Tam. ${item.size}` : ""}
                {item.size && item.color ? " · " : ""}
                {item.color ? item.color : ""}
              </p>
            )}
          </div>
          <button
            className="cart-remove"
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${item.name} da sacola`}
          >
            Remover
          </button>
        </div>
        <div className="cart-line-bottom">
          <div className="cart-quantity-control" aria-label={`Quantidade de ${item.name}`}>
            <button
              type="button"
              aria-label={`Diminuir quantidade de ${item.name}`}
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange(item.quantity - 1)}
            >
              −
            </button>
            <span aria-live="polite">{item.quantity}</span>
            <button
              type="button"
              aria-label={`Aumentar quantidade de ${item.name}`}
              disabled={productQuantity >= item.stockLimit}
              onClick={() => onQuantityChange(item.quantity + 1)}
            >
              +
            </button>
          </div>
          <PriceDisplay priceInCents={item.unitPriceInCents * item.quantity} className="cart-line-price" />
        </div>
      </div>
    </article>
  );
}
