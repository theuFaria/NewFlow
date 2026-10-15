"use client";

import type { ProductOptionSource } from "@/lib/products/types";

export default function SizeSelector({
  sizes,
  source,
  value,
  onChange,
  disabled = false,
  compact = false,
}: {
  sizes: string[];
  source: ProductOptionSource;
  value: string;
  onChange: (size: string) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  if (sizes.length === 0) return null;
  return (
    <fieldset className={`variant-fieldset size-selector${compact ? " is-compact" : ""}`}>
      <legend>Tamanho</legend>
      <div className="size-options">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={`size-option${value === size ? " is-selected" : ""}`}
            aria-pressed={value === size}
            onClick={() => onChange(size)}
            disabled={disabled}
          >
            {size}
          </button>
        ))}
      </div>
      <small className="variant-note">
        {source === "demo"
          ? "Grade ilustrativa — confirmar opções por peça."
          : "Tamanho indicado no cadastro do produto."}
      </small>
    </fieldset>
  );
}
