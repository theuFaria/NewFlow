import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <header>
          <Navbar />
        </header>
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
