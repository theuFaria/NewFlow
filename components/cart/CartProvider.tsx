"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getProducts } from "@/lib/products/productService";
import {
  addProductToCart,
  getCartSummary,
  updateCartQuantity,
  type AddToCartStatus,
  type CartSelection,
} from "@/lib/cart/cartLogic";
import { restoreCart } from "@/lib/cart/cartStorage";
import type { CartLine, Product } from "@/lib/products/types";

const STORAGE_KEY = "new-flow-cart-v1";

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  subtotalInCents: number;
  isReady: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addProduct: (product: Product, selection: CartSelection) => AddToCartStatus;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const itemsRef = useRef<CartLine[]>([]);

  useEffect(() => {
    let active = true;
    void getProducts().then((products) => {
      if (!active) return;
      let restored: CartLine[] = [];
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        restored = saved ? restoreCart(JSON.parse(saved) as unknown, products) : [];
      } catch {
        restored = [];
      }
      itemsRef.current = restored;
      setItems(restored);
      setIsReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be disabled or full; the in-memory cart still works.
    }
  }, [items, isReady]);

  const addProduct = useCallback((product: Product, selection: CartSelection) => {
    const result = addProductToCart(itemsRef.current, product, selection);
    if (result.status === "added") {
      itemsRef.current = result.items;
      setItems(result.items);
    }
    return result.status;
  }, []);

  const removeItem = useCallback((lineId: string) => {
    const next = itemsRef.current.filter((item) => item.id !== lineId);
    itemsRef.current = next;
    setItems(next);
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    const next = updateCartQuantity(itemsRef.current, lineId, quantity);
    itemsRef.current = next;
    setItems(next);
  }, []);

  const clearCart = useCallback(() => {
    itemsRef.current = [];
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const summary = useMemo(() => getCartSummary(items), [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: summary.itemCount,
    subtotalInCents: summary.subtotalInCents,
    isReady,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    addProduct,
    removeItem,
    setQuantity,
    clearCart,
  }), [
    items,
    summary,
    isReady,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    addProduct,
    removeItem,
    setQuantity,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
}
