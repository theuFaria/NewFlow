import { Produto } from "@/types/produto/produto";
import { ProdutoApi } from "@/types/produto/produtoApi";

export function mapperProduto(produto: ProdutoApi): Produto {
  const result: Produto = {} as Produto;
  result.nome = produto.nome.trim();
  result.id = Number(produto.id);
  result.estoque = Number(produto.estoque);
  result.valor = Number(produto.valor_venda);
  result.codigo_interno = produto.codigo_interno.trim();
  if (produto.fotos.length >= 1) {
    result.fotos = produto.fotos;
  }

  return result;
}

export function mapperProdutos(produtos: ProdutoApi[]): Produto[] {
  const result: Produto[] = produtos.map((p) => mapperProduto(p));
  return result;
}
