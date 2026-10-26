import Image from "next/image";

export type Produto = {
  id: number;
  nome: string;
  valor: number;
  estoque: number;
  codigo_interno: string;
  fotos?: [];
  atributos?: [];
};
