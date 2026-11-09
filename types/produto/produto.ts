export type Produto = {
  id: number;
  nome: string;
  valor: number;
  estoque: number;
  codigo_interno: string;
  fotos: string[];
  cores?: string[];
  tamanhos?: string[];
  genero?: string[]
};
