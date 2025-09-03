"use client"

import { createContext, useEffect, useState } from "react";

export type CartItem = {
  id: string | number;
  title?: string;
  price?: number;
  qty?: number;
  image?: string;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cart";

function mergeById(items: CartItem[]): CartItem[] {
  const map = new Map<string | number, CartItem>();
  for (const it of items) {
    const id = it.id;
    const prev = map.get(id);
    const qty = (prev?.qty ?? 0) + (it.qty ?? 1);
    map.set(id, { ...prev, ...it, qty: qty || 1 });
  }
  return Array.from(map.values());
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage once
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CartItem[] | unknown;
      const array = Array.isArray(parsed) ? parsed : [];
      const normalized = array.map((i) => ({ ...i, qty: i.qty ?? 1 }));
      setCart(mergeById(normalized));
    } catch {
      setCart([]);
    }
  }, []);

  // Persist on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: (i.qty ?? 1) + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
