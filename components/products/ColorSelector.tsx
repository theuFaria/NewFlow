"use client";

import type { CSSProperties } from "react";
import type { ProductOptionSource } from "@/lib/products/types";

const swatches: Record<string, string> = {
  PRETO: "#171717",
  BRANCO: "#fffdf9",
  VERMELHO: "#bd2b32",
  FUCSIA: "#d52e83",
  CHUMBO: "#565656",
  AZUL: "#304d79",
  MARINHO: "#1b2e48",
  BEGE: "#c3a78a",
  VERDE: "#526b53",
};

export default function ColorSelector({
  colors,
  source,
  value,
  onChange,
  disabled = false,
}: {
  colors: string[];
  source: ProductOptionSource;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}) {
  if (colors.length === 0) return null;
  return (
    <fieldset className="variant-fieldset color-selector">
      <legend>Cor {value ? <span className="selected-color-name">· {value}</span> : ""}</legend>
      <div className="color-options">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-option${value === color ? " is-selected" : ""}`}
            style={{ "--color-swatch": swatches[color.toUpperCase()] ?? "#bdb6ae" } as CSSProperties}
            aria-label={`Selecionar cor ${color}`}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
            disabled={disabled}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <small className="variant-note">
        {source === "demo" ? "Cor ilustrativa — confirmar com a loja." : "Cor indicada no cadastro do produto."}
      </small>
    </fieldset>
  );
}
