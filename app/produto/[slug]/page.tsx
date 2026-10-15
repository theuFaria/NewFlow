import Link from "next/link";
import type { Metadata } from "next";
import ProductDetails from "@/components/products/ProductDetails";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products/productService";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} | New Flow` : "Produto não encontrado | New Flow",
    description: product
      ? `Detalhes demonstrativos de ${product.name} no catálogo New Flow.`
      : "Não foi possível localizar este produto no catálogo New Flow.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return (
      <section className="product-not-found container" aria-labelledby="not-found-title">
        <span className="section-kicker">NEW FLOW / CATÁLOGO</span>
        <h1 id="not-found-title">Não encontramos essa peça.</h1>
        <p>O link pode estar desatualizado. Explore a coleção para encontrar outros produtos.</p>
        <Link className="button button-primary" href="/catalogo">Voltar à coleção</Link>
      </section>
    );
  }
  const relatedProducts = await getRelatedProducts(product, 4);
  return <ProductDetails key={product.id} product={product} relatedProducts={relatedProducts} />;
}
