"use client";

import { createContext, useCallback, useEffect, useState } from "react";

export type CartItem = {
  id: string | number;
  documentId: string;
  title?: string;
  price?: number;
  banner?: {
    url: string;
  };
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
};

export type ShippingAddress = {
  fullName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
};

export type ShippingRate = {
  objectId: string;
  amount: number;
  currency: string;
  provider: string;
  serviceLevelName: string;
  serviceLevelToken?: string;
  estimatedDays?: number | null;
  durationTerms?: string | null;
  shipmentId?: string;
  providerImage75?: string;
};

export type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress | null) => void;
  selectedShippingRate: ShippingRate | null;
  setSelectedShippingRate: (rate: ShippingRate | null) => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddressState] =
    useState<ShippingAddress | null>(null);
  const [selectedShippingRate, setSelectedShippingRateState] =
    useState<ShippingRate | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart) as CartItem[]);
      } catch {
        // ignore malformed data
      }
    }

    const storedShippingAddress = localStorage.getItem("shippingAddress");
    if (storedShippingAddress) {
      try {
        setShippingAddressState(
          JSON.parse(storedShippingAddress) as ShippingAddress
        );
      } catch {
        // ignore malformed data
      }
    }

    const storedShippingRate = localStorage.getItem("shippingRate");
    if (storedShippingRate) {
      try {
        setSelectedShippingRateState(
          JSON.parse(storedShippingRate) as ShippingRate
        );
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => [...prev, item]);
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

  const setShippingAddress = useCallback((address: ShippingAddress | null) => {
    setShippingAddressState(address);

    if (address) {
      localStorage.setItem("shippingAddress", JSON.stringify(address));
    } else {
      localStorage.removeItem("shippingAddress");
    }
  }, []);

  const setSelectedShippingRate = useCallback((rate: ShippingRate | null) => {
    setSelectedShippingRateState(rate);

    if (rate) {
      localStorage.setItem("shippingRate", JSON.stringify(rate));
    } else {
      localStorage.removeItem("shippingRate");
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setShippingAddressState(null);
    setSelectedShippingRateState(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("shippingRate");
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        shippingAddress,
        setShippingAddress,
        selectedShippingRate,
        setSelectedShippingRate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
