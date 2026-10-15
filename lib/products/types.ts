export type ProductOptionSource = "name" | "demo" | "none";

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  priceInCents: number;
  stock: number;
  images: string[];
  category: string;
  sizes: string[];
  sizesSource: ProductOptionSource;
  colors: string[];
  colorsSource: ProductOptionSource;
  isAvailable: boolean;
  isDemo: boolean;
}

export interface CartLine {
  id: string;
  productId: string;
  sku: string;
  name: string;
  image: string;
  unitPriceInCents: number;
  stockLimit: number;
  size: string | null;
  color: string | null;
  quantity: number;
}
