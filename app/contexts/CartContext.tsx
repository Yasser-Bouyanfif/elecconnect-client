"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  documentId: string;
  title?: string;
  price?: number;
  quantity?: number;
  banner?: {
    url: string;
  };
};

export type CartContextType = {
  cart: CartItem[];
  cartSubtotal: number;
  cartTotal: number;
  cartTotalsUpdatedAt: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateCartItemQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  syncCartTotals: (totals: { subtotal: number; total: number }) => void;
  clearCartTotals: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const MAX_PER_PRODUCT = 4;

const getCartKey = (item: Pick<CartItem, "id" | "documentId">) =>
  (item.documentId ?? item.id).toString();

const clampStoredQuantity = (value: unknown): number | null => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const whole = Math.floor(value);
  if (whole <= 0) {
    return 0;
  }

  return Math.min(whole, MAX_PER_PRODUCT);
};

const sanitizeCartItems = (items: Array<CartItem & { quantity?: unknown }>): CartItem[] => {
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
    const existing = counts.get(key) ?? 0;
    if (existing >= MAX_PER_PRODUCT) {
      return acc;
    }

    const { quantity: rawQuantity, ...rest } = current as CartItem & {
      quantity?: unknown;
    };

    const parsedQuantity =
      rawQuantity !== undefined ? clampStoredQuantity(rawQuantity) : null;

    if (parsedQuantity === 0) {
      return acc;
    }

    const desired = parsedQuantity ?? 1;
    const remaining = MAX_PER_PRODUCT - existing;
    const copies = Math.min(remaining, desired);

    if (copies <= 0) {
      return acc;
    }

    for (let index = 0; index < copies; index += 1) {
      acc.push({ ...rest, id });
    }

    counts.set(key, existing + copies);
    return acc;
  }, []);
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartTotalsUpdatedAt, setCartTotalsUpdatedAt] = useState(0);

  const clearCartTotals = useCallback(() => {
    setCartSubtotal(0);
    setCartTotal(0);
    setCartTotalsUpdatedAt(0);
  }, []);

  const syncCartTotals = useCallback(
    (totals: { subtotal: number; total: number }) => {
      const sanitize = (value: number) =>
        Number.isFinite(value) ? Math.max(value, 0) : 0;

      setCartSubtotal(sanitize(totals.subtotal));
      setCartTotal(sanitize(totals.total));
      setCartTotalsUpdatedAt(Date.now());
    },
    []
  );

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (!storedCart) {
      return;
    }

    try {
      const parsed = JSON.parse(storedCart);
      if (Array.isArray(parsed)) {
        setCart(
          sanitizeCartItems(parsed as Array<CartItem & { quantity?: unknown }>)
        );
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
    clearCartTotals();
  }, [clearCartTotals]);

  const updateCartItemQuantity = useCallback((id: string | number, quantity: number) => {
    setCart(prev => {
      const itemIndex = prev.findIndex(item => item.id === id);
      if (itemIndex === -1) return prev;

      const updatedCart = [...prev];
      updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity };
      return updatedCart;
    });
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      cartSubtotal,
      cartTotal,
      cartTotalsUpdatedAt,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      syncCartTotals,
      clearCartTotals
    }}>
      {children}
    </CartContext.Provider>
  );
}