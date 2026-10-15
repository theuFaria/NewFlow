"use client";

export default function QuantitySelector({
  value,
  max,
  onChange,
  disabled = false,
}: {
  value: number;
  max: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}) {
  const upperLimit = Math.max(1, Math.floor(max));
  return (
    <div className="quantity-selector" aria-label="Quantidade">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={disabled || value <= 1}
      >
        −
      </button>
      <output aria-live="polite" aria-label={`Quantidade selecionada: ${value}`}>{value}</output>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => onChange(Math.min(upperLimit, value + 1))}
        disabled={disabled || value >= upperLimit}
      >
        +
      </button>
    </div>
  );
}
