"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string | number;
  documentId: string;
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

export const MAX_PER_PRODUCT = 4;

const getCartKey = (item: Pick<CartItem, "id" | "documentId">) =>
  (item.documentId ?? item.id).toString();

const sanitizeCartItems = (items: CartItem[]): CartItem[] => {
  const counts = new Map<string, number>();

  return items.reduce<CartItem[]>((acc, current) => {
    if (!current) {
      return acc;
    }

    const { id } = current;
    if (typeof id !== "string" && typeof id !== "number") {
      return acc;
    }

    const key = getCartKey(current);
    const quantity = counts.get(key) ?? 0;
    if (quantity >= MAX_PER_PRODUCT) {
      return acc;
    }

    counts.set(key, quantity + 1);
    acc.push({ ...current, id });
    return acc;
  }, []);
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (!storedCart) {
      return;
    }

    try {
      const parsed = JSON.parse(storedCart);
      if (Array.isArray(parsed)) {
        setCart(sanitizeCartItems(parsed as CartItem[]));
      }
    } catch {
      // ignore malformed data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: CartItem) => {
    if (!item || (typeof item.id !== "string" && typeof item.id !== "number")) {
      return;
    }

    setCart((prev) => sanitizeCartItems([...prev, item]));
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("cart");
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
