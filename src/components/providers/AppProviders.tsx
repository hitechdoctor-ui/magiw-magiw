"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </LocaleProvider>
  );
}
