import { unstable_cache } from "next/cache";
import { getProdutoLojaById } from "@/lib/gestaoclick/produto";

// Catálogo provisório: um produto até a loja definir os códigos exibidos.
// O cache impede uma consulta ao ERP por visita.
export const buscarProdutos = unstable_cache(
  async () => [await getProdutoLojaById(100059020, "NEWFLOW")],
  ["catalogo-produto-teste"],
  { revalidate: 3600 },
);
