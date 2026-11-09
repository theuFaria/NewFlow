import ProdutoCarrosel from "./ProdutoCarrosel";
import ProductColor from "./ProductColor";


export default function ProductCard({
  nome_produto,
  imagens,
  valor,
  obs = null,
}: {
  nome_produto: string;
  imagens: string[] | [];
  valor: number;
  obs?: string | null;
}) {
  const valor_string: string = valor.toFixed(2).toString().replace(".", ",");

  nome_produto = nome_produto
    .toLocaleLowerCase("pt-BR")
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="w-full max-w-77 min-w-0 mx-auto h-full min-h-135">
      <ProdutoCarrosel nomeProduto={nome_produto} imagens={imagens} />
      <div className="h-[25%] flex flex-col font-medium">
        <span className="text-[10px] pb-2 text-accent font-semibold tracking-widest">
          Moda Intima
        </span>
        <h2 className="text-lg pb-2 font-semibold tracking-wide">{nome_produto}</h2>
        <span className="text-sm pb-1 text-accent font-bold">R$ {valor_string}</span>
        <span className="text-secondary text-[10px] pb-2">Até 2x sem juros</span>
        {obs && <span className="text-accent text-xs">{obs}</span>}
        <div id="colors" className="flex gap-2 pb-2">
          <ProductColor color="bg-accent" />
          <ProductColor color="bg-red-500" />
        </div>
      </div>
    </div>
  );
}
