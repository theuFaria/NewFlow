"use client";

import { useState } from "react";
import Image from "next/image";
import ChevronLeft from "@/public/svg/ChevronLeft";
import ChevronRight from "@/public/svg/ChevronRight";

export default function ProdutoCarrosel({
  imagens,
  nomeProduto,
}: {
  imagens: string[] | [];
  nomeProduto: string;
}) {
  const [indice, setIndice] = useState(0);
  if (imagens.length === 0) {
    return (
      // <div>
      //   <Image src={} alt="" />
      // </div>
      <p>Produto sem Imagem</p>
    );
  }

  function proximaImagem() {
    setIndice((indice) => (indice !== imagens.length - 1 ? indice + 1 : 0));
  }

  function imagemAnterior() {
    setIndice((indice) => (indice === 0 ? imagens.length - 1 : indice - 1));
  }

  return (
    <div className="w-full h-[75%] relative mb-1.5 group overflow-hidden">
      <Image
        src={imagens[indice]}
        alt={nomeProduto}
        fill={true}
        className="object-cover rounded-sm"
        sizes="1000"
        loading="eager"
      />

      {imagens.length > 1 && (
        <div className="absolute inset-0 hidden justify-between items-center px-2 group-hover:flex duration-150">
          <button
            type="button"
            onClick={imagemAnterior}
            aria-label="Ver imagem anterior"
            className="py-1 hover:cursor-pointer w-8 h-8 rounded-full bg-[#5A595F]  opacity-50 flex items-center justify-center"
          >
            <span className="pr-1">
              <ChevronLeft cor="#31393C" width="20" height="20" />
            </span>
          </button>

          <div className="flex h-full items-end justify-center gap-3 mb-4">
            {imagens.map((_, posicao) => (
              <div
                key={posicao}
                aria-label={`Ver imagem ${posicao + 1} de ${imagens.length}`}
                aria-current={indice === posicao ? "true" : undefined}
                className={`h-2.5 w-2.5 rounded-full border opacity-70 ${
                  indice === posicao ? "bg-white" : "bg-black"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={proximaImagem}
            aria-label="Ver próxima imagem"
            className="py-1 hover:cursor-pointer w-8 h-8 bg-[#5A595F] rounded-full opacity-50 flex items-center justify-center"
          >
            <span className="pl-1">
              <ChevronRight cor="#31393C" width="20" height="20" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
