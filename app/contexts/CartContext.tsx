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

export type ShippingMethod = "standard" | "express";

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
};

export type CartContextType = {
  cart: CartItem[];
  cartSubtotal: number;
  cartTotal: number;
  cartTotalsUpdatedAt: number;
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  useSameAddressForBilling: boolean;
  updateShippingAddress: (updates: Partial<CheckoutAddress>) => void;
  updateBillingAddress: (updates: Partial<CheckoutAddress>) => void;
  setUseSameAddressForBilling: (useSame: boolean) => void;
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

const createEmptyAddress = (): CheckoutAddress => ({
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
  email: "",
});

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
    const sanitizeCartItems = (items: Array<CartItem & { quantity?: unknown }>): Car
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
  const [shippingMethod, setShippingMethodState] = useState<ShippingMethod>(
    "standard"
  );
  const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>(
    () => createEmptyAddress()
  );
  const [billingAddress, setBillingAddress] = useState<CheckoutAddress>(() =>
    createEmptyAddress()
  );
  const [useSameAddressForBilling, setUseSameAddressForBillingState] =
    useState(true);

  const updateShippingMethod = useCallback((method: ShippingMethod) => {
    setShippingMethodState(method);
    localStorage.setItem("shippingMethod", method);
  }, []);

  const updateShippingAddress = useCallback(
    (updates: Partial<CheckoutAddress>) => {
      setShippingAddress((prev) => {
        const next = { ...prev, ...updates };

        if (useSameAddressForBilling) {
          setBillingAddress({ ...next });
        }

        return next;
      });
    },
    [setBillingAddress, useSameAddressForBilling]
  );

  const updateBillingAddress = useCallback(
    (updates: Partial<CheckoutAddress>) => {
      setBillingAddress((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const setUseSameAddressForBilling = useCallback(
    (useSame: boolean) => {
      setUseSameAddressForBillingState(useSame);

      if (useSame) {
        setBillingAddress({ ...shippingAddress });
      }
    },
    [shippingAddress]
  );

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
    const storedShippingMethod = localStorage.getItem("shippingMethod");
    const storedAddressesRaw = localStorage.getItem("checkoutAddresses");

    if (!storedCart) {
      if (storedShippingMethod === "standard" || storedShippingMethod === "express") {
        setShippingMethodState(storedShippingMethod);
      }
      if (storedAddressesRaw) {
        try {
          const parsed = JSON.parse(storedAddressesRaw);
          if (parsed?.shipping && typeof parsed.shipping === "object") {
            setShippingAddress((prev) => ({ ...prev, ...parsed.shipping }));
          }
          if (parsed?.billing && typeof parsed.billing === "object") {
            setBillingAddress((prev) => ({ ...prev, ...parsed.billing }));
          }
          if (typeof parsed?.useSameForBilling === "boolean") {
            setUseSameAddressForBillingState(parsed.useSameForBilling);
          }
        } catch {
          // ignore malformed data
        }
      }
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

    if (storedShippingMethod === "standard" || storedShippingMethod === "express") {
      setShippingMethodState(storedShippingMethod);
    }

    if (storedAddressesRaw) {
      try {
        const parsedAddresses = JSON.parse(storedAddressesRaw);
        if (parsedAddresses?.shipping && typeof parsedAddresses.shipping === "object") {
          setShippingAddress((prev) => ({ ...prev, ...parsedAddresses.shipping }));
        }
        if (parsedAddresses?.billing && typeof parsedAddresses.billing === "object") {
          setBillingAddress((prev) => ({ ...prev, ...parsedAddresses.billing }));
        }
        if (typeof parsedAddresses?.useSameForBilling === "boolean") {
          setUseSameAddressForBillingState(parsedAddresses.useSameForBilling);
        }
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const payload = {
      shipping: shippingAddress,
      billing: useSameAddressForBilling ? shippingAddress : billingAddress,
      useSameForBilling: useSameAddressForBilling,
    };

    localStorage.setItem("checkoutAddresses", JSON.stringify(payload));
  }, [billingAddress, shippingAddress, useSameAddressForBilling]);

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
    setShippingMethodState("standard");
    localStorage.removeItem("shippingMethod");
    setShippingAddress(createEmptyAddress());
    setBillingAddress(createEmptyAddress());
    setUseSameAddressForBillingState(true);
    localStorage.removeItem("checkoutAddresses");
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
      shippingMethod,
      setShippingMethod: updateShippingMethod,
      shippingAddress,
      billingAddress,
      useSameAddressForBilling,
      updateShippingAddress,
      updateBillingAddress,
      setUseSameAddressForBilling,
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