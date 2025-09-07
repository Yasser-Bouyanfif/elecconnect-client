"use client";

import { createContext, useEffect, useState } from "react";

export type CartItem = {
  id: string | number;
  title?: string;
  price?: number;
  banner?: {
    url: string;
  };
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

///

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          return JSON.parse(storedCart) as CartItem[];
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
