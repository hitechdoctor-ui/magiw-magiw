"use client";

import { useHydrated, useStoredState } from "@/lib/hooks/useStoredState";
import type { ProductDetail } from "@/lib/types/database";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "magiw-cart-v1";

export type CartLine = {
  id: string;
  productSlug: string;
  productName: string;
  size: string;
  color?: string;
  price_cents: number;
  currency: string;
  imageUrl?: string;
};

type AddLineOptions = {
  openCart?: boolean;
  color?: string;
};

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  addLine: (line: Omit<CartLine, "id">, options?: AddLineOptions) => void;
  addLines: (lines: Omit<CartLine, "id">[], options?: AddLineOptions) => void;
  addProduct: (
    product: ProductDetail,
    size: string,
    options?: AddLineOptions,
  ) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
  count: number;
  subtotalCents: number;
  currency: string;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  openCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: CartLine[] = [];

function parseStoredCart(raw: string): CartLine[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return EMPTY_CART;
  return parsed.filter(
    (line): line is CartLine =>
      Boolean(line) &&
      typeof line === "object" &&
      typeof (line as CartLine).id === "string" &&
      typeof (line as CartLine).productSlug === "string" &&
      typeof (line as CartLine).price_cents === "number",
  );
}

function newLineId(slug: string, size: string) {
  return `${slug}-${size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useStoredState<CartLine[]>(STORAGE_KEY, EMPTY_CART, {
    parse: parseStoredCart,
  });
  const hydrated = useHydrated();
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);

  const addLine = useCallback(
    (line: Omit<CartLine, "id">, options?: AddLineOptions) => {
      setLines((prev) => [...prev, { ...line, id: newLineId(line.productSlug, line.size) }]);
      if (options?.openCart !== false) setCartOpen(true);
    },
    [setLines],
  );

  const addLines = useCallback(
    (newLines: Omit<CartLine, "id">[], options?: AddLineOptions) => {
      setLines((prev) => [
        ...prev,
        ...newLines.map((line) => ({
          ...line,
          id: newLineId(line.productSlug, line.size),
        })),
      ]);
      if (options?.openCart !== false) setCartOpen(true);
    },
    [setLines],
  );

  const addProduct = useCallback(
    (product: ProductDetail, size: string, options?: AddLineOptions) => {
      addLine(
        {
          productSlug: product.slug,
          productName: product.name,
          size,
          color: options?.color,
          price_cents: product.price_cents,
          currency: product.currency,
          imageUrl: product.images[0],
        },
        options,
      );
    },
    [addLine],
  );

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, [setLines]);

  const clearCart = useCallback(() => setLines(EMPTY_CART), [setLines]);

  const currency = lines[0]?.currency ?? "EUR";
  const subtotalCents = lines.reduce((sum, line) => sum + line.price_cents, 0);

  const value = useMemo(
    () => ({
      lines,
      hydrated,
      addLine,
      addLines,
      addProduct,
      removeLine,
      clearCart,
      count: lines.length,
      subtotalCents,
      currency,
      cartOpen,
      setCartOpen,
      openCart,
    }),
    [
      lines,
      hydrated,
      addLine,
      addLines,
      addProduct,
      removeLine,
      clearCart,
      subtotalCents,
      currency,
      cartOpen,
      openCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
