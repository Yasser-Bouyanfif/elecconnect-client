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

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    if (stored) {
      try {
        const parsed: CartItem[] = JSON.parse(stored);
        const merged = parsed.reduce<CartItem[]>((acc, item) => {
          const existing = acc.find((i) => i.id === item.id);
          if (existing) {
            existing.qty = (existing.qty || 1) + (item.qty || 1);
          } else {
            acc.push({ ...item, qty: item.qty || 1 });
          }
          return acc;
        }, []);
        setCart(merged);
      } catch {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i
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
