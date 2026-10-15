import type { Metadata } from "next";
import ProductGrid from "@/components/products/ProductGrid";
import ProductImage from "@/components/products/ProductImage";
import { getProducts } from "@/lib/products/productService";

export const metadata: Metadata = {
  title: "Nossa Coleção | New Flow",
  description:
    "Conheça o catálogo demonstrativo de moda fitness e feminina da New Flow.",
};

export default async function CatalogPage() {
  const products = await getProducts();
  const featured =
    products.find((product) => product.isAvailable) ?? products[0];

  return (
    <>
      <section className="catalog-hero" aria-labelledby="catalog-title">
        <div className="container catalog-hero-inner">
          <div className="catalog-hero-copy">
            <span className="section-kicker">
              <span className="eyebrow-rule" /> NEW FLOW / COLEÇÃO
            </span>
            <h1 id="catalog-title">
              Nossa <em>Coleção.</em>
            </h1>
            <p>
              Moda para acompanhar seu ritmo, com uma experiência de compra
              pensada para você.
            </p>
            <div className="catalog-hero-meta">
              <span>{String(products.length).padStart(2, "0")} PEÇAS</span>
              <span aria-hidden="true">/</span>
              <span>IMAGENS ILUSTRATIVAS</span>
            </div>
          </div>
          {featured && (
            <div className="catalog-hero-visual">
              <div className="catalog-hero-image">
                <ProductImage
                  product={featured}
                  priority
                  sizes="(max-width: 760px) 55vw, 25vw"
                />
              </div>
              <div className="catalog-hero-stamp" aria-hidden="true">
                <span>NEW</span>
                <strong>FLOW</strong>
                <small>01 / 20</small>
              </div>
            </div>
          )}
          <span className="catalog-hero-side" aria-hidden="true">
            MOVIMENTO · ESTILO · NEW FLOW
          </span>
        </div>
      </section>

      <section className="catalog-section" aria-labelledby="catalog-grid-title">
        <div className="container">
          <header className="catalog-section-heading">
            <div>
              <span className="section-kicker">01 / EXPLORE</span>
              <h2 id="catalog-grid-title">
                Encontre sua próxima <em>peça.</em>
              </h2>
              <p>
                Escolha um produto para conhecer os detalhes ou experimente a
                compra rápida no card.
              </p>
            </div>
            <span className="catalog-product-count">
              <strong>{products.length}</strong> produtos
            </span>
          </header>
          <ProductGrid products={products} />
          <p className="catalog-disclaimer">
            Demonstração de catálogo. As fotos são ilustrativas; tamanhos e
            disponibilidade precisam ser confirmados com a loja.
          </p>
        </div>
      </section>
    </>
  );
}
