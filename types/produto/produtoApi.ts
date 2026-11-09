export type ProdutoApi = {
  id: string;
  nome: string;
  codigo_interno: string;
  possui_variacao: string;
  grupo_id: string;
  nome_grupo: string;
  estoque: number;
  valor_venda: string;
  valores: unknown[];
  fotos: [];
  atributos: [];
  variacoes: variacao[];
};

type variacao = {
  variacao: {
    id: string;
    codigo: string;
    nome: string;
    estoque: number;
    valores: {
      valor_venda: number;
    };
  };
};

export type GrupoProduto = {
  id: number;
  grupo_pai_id: number;
  nome: string;
};
