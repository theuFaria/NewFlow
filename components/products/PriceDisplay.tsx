import { formatPrice } from "@/lib/products/productService";

export default function PriceDisplay({
  priceInCents,
  className = "",
}: {
  priceInCents: number;
  className?: string;
}) {
  return <span className={`price-display ${className}`.trim()}>{formatPrice(priceInCents)}</span>;
}
