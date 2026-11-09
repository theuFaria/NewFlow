import { Suspense } from "react";
import { connection } from "next/server";
import { buscarProdutos } from "./content";
import CatalogoProdutos from "./CatalogoProdutos";
import type { Produto } from "@/types/produto/produto";

async function ConteudoCatalogo() {
  // Evita consultar o ERP durante o build; a consulta fica no cache do servidor.
  await connection();
  let produtos: Produto[] | null;

  try {
    produtos = await buscarProdutos();
  } catch (erro) {
    console.error("Falha ao carregar o catálogo:", erro);
    produtos = null;
  }

  return produtos === null ? (
    <p role="alert">Não foi possível carregar o catálogo agora.</p>
  ) : (
    <CatalogoProdutos produtos={produtos} />
  );
}

export default function Catalogo() {
  return (
    <main className="container mt-15">
      <div className="w-full h-[10%] mb-13">
        <p className="font-bold text-4xl pb-5">Um novo fluxo de beleza</p>
        <span className="text-secondary text-sm">Moda Fitness</span>
      </div>
      <Suspense fallback={<p>Carregando catálogo...</p>}>
        <ConteudoCatalogo />
      </Suspense>
    </main>
  );
}
