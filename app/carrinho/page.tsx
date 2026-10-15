import type { Metadata } from "next";
import CartPageContent from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Sacola demonstrativa | New Flow",
  description: "Veja os itens escolhidos na simulação de catálogo da New Flow.",
};

export default function CartPage() {
  return <CartPageContent />;
}
