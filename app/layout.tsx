import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "New Flow Moda Fitness | Seu movimento. Seu estilo.",
  description:
    "Conheça a New Flow e encontre moda fitness para acompanhar sua rotina.",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="shortcut icon" href="/images/icon.svg" type="image/x-icon" />
      </head>
      <body className={`${inter.className}`}>
        <header>
          <Navbar />
        </header>
        {children}
        <Footer />
      </body>
    </html>
  );
}
