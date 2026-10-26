import { ApiResponse } from "@/types/apiResponse";
import { apiRequest } from "./cliente";
import { GrupoProduto, ProdutoApi } from "@/types/produto/produtoApi";
import { Produto } from "@/types/produto/produto";
import { mapperProdutos } from "../mapper/produto";

type Loja = "NEWFLOW" | "INTIMIDADE";

const newflow_id = process.env.newflow_id;
const intimidade_id = process.env.intimidade_id;

function escolherLoja(loja: Loja) {
  if (loja == "INTIMIDADE") {
    return intimidade_id;
  } else {
    return newflow_id;
  }
}

export async function getProdutosApiLoja(loja: Loja): Promise<ProdutoApi[]> {
  const response: ApiResponse<ProdutoApi[]> = await apiRequest(
    `produtos?loja_id=${escolherLoja(loja)}`,
    "GET",
  );

  return response.data;
}

export async function unificarProdutos(
  produtosIntimidade: Produto[],
  produtosNewFlow: Produto[],
): Promise<Produto[]> {
  const unificados = produtosNewFlow.map((produto) => {
    const correspondente = produtosIntimidade.find(
      (outro) =>
        produto.codigo_interno !== "" &&
        outro.codigo_interno === produto.codigo_interno,
    );

    if (!correspondente) return produto;

    return {
      ...produto,
      estoque: produto.estoque + correspondente.estoque,
    };
  });

  const somenteIntimidade = produtosIntimidade.filter((produto) => {
    !produtosNewFlow.some(
      (outro) => produto.codigo_interno === outro.codigo_interno,
    );
  });

  return somenteIntimidade.concat(unificados);
}

export async function getProdutoLojaById(
  id: number,
  loja: Loja,
): Promise<ProdutoApi> {
  const response: ApiResponse<ProdutoApi> = await apiRequest(
    `produtos/${id}?loja_id=${escolherLoja(loja)}`,
    "GET",
  );
  return response.data;
}
