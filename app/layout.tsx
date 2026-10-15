import type { Metadata } from "next";
import "./globals.css";
import "./catalogo/catalogo.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "New Flow Moda Fitness | Seu movimento. Seu estilo.",
  description:
    "Conheça a New Flow e encontre moda fitness para acompanhar sua rotina.",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          <a className="skip-link" href="#conteudo">
            Pular para o conteúdo
          </a>
          <header>
            <Navbar />
          </header>
          <main id="conteudo">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
