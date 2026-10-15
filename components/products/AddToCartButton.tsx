"use client";

import type { ReactNode } from "react";

export default function AddToCartButton({
  onClick,
  disabled = false,
  children = "Adicionar à sacola",
  className = "",
}: {
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`add-to-cart-button ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
