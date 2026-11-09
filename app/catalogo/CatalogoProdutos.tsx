import ProductCard from "@/components/produto/ProductCard";
import type { Produto } from "@/types/produto/produto";

export default function CatalogoProdutos({ produtos }: { produtos: Produto[] }) {
  if (produtos.length === 0) {
    return <p>Nenhum produto disponível no catálogo no momento.</p>;
  }

  return (
    <section
      id="catalogo"
      className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-18 mb-16"
    >
      {produtos.map((produto) => (
        <ProductCard
          key={produto.codigo_interno || produto.id}
          nome_produto={produto.nome}
          imagens={produto.fotos}
          valor={produto.valor}
        />
      ))}
    </section>
  );
}
