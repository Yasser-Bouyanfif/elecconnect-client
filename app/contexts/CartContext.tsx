"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number | string;
  documentId?: string;
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

type StoredAddressesPayload = {
  shipping?: Partial<CheckoutAddress>;
  billing?: Partial<CheckoutAddress>;
  useSameForBilling?: boolean;
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

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const MAX_PER_PRODUCT = 4;

const CART_STORAGE_KEY = "cart";
const SHIPPING_METHOD_STORAGE_KEY = "shippingMethod";
const ADDRESSES_STORAGE_KEY = "checkoutAddresses";
const DEFAULT_SHIPPING_METHOD: ShippingMethod = "standard";

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

const sanitizeText = (value: unknown) =>
  typeof value === "string" ? value : "";

const mergeAddress = (
  base: CheckoutAddress,
  updates?: Partial<CheckoutAddress>
): CheckoutAddress => {
  if (!updates) {
    return { ...base };
  }

  return {
    firstName: sanitizeText(updates.firstName ?? base.firstName),
    lastName: sanitizeText(updates.lastName ?? base.lastName),
    company: sanitizeText(updates.company ?? base.company),
    address1: sanitizeText(updates.address1 ?? base.address1),
    address2: sanitizeText(updates.address2 ?? base.address2),
    city: sanitizeText(updates.city ?? base.city),
    postalCode: sanitizeText(updates.postalCode ?? base.postalCode),
    country: sanitizeText(updates.country ?? base.country),
    phone: sanitizeText(updates.phone ?? base.phone),
    email: sanitizeText(updates.email ?? base.email),
  };
};

const getCartKey = (item: Pick<CartItem, "id" | "documentId">): string =>
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

const sanitizeCartItems = (
  items: Array<CartItem | (CartItem & { quantity?: unknown }) | null | undefined>
): CartItem[] => {
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

const persistToStorage = (key: string, value: unknown) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

const removeFromStorage = (key: string) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartTotalsUpdatedAt, setCartTotalsUpdatedAt] = useState(0);
  const [shippingMethod, setShippingMethodState] = useState<ShippingMethod>(
    DEFAULT_SHIPPING_METHOD
  );
  const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>(() =>
    createEmptyAddress()
  );
  const [billingAddress, setBillingAddress] = useState<CheckoutAddress>(() =>
    createEmptyAddress()
  );
  const [useSameAddressForBilling, setUseSameAddressForBillingState] =
    useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedCartRaw = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCartRaw) {
        const parsed = JSON.parse(storedCartRaw);
        if (Array.isArray(parsed)) {
          setCart(
            sanitizeCartItems(
              parsed as Array<CartItem | (CartItem & { quantity?: unknown })>
            )
          );
        }
      }
    } catch {
      // ignore malformed cart data
    }

    try {
      const storedMethod = localStorage.getItem(SHIPPING_METHOD_STORAGE_KEY);
      if (storedMethod === "express" || storedMethod === "standard") {
        setShippingMethodState(storedMethod);
      }
    } catch {
      // ignore malformed shipping method
    }

    try {
      const storedAddressesRaw = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (!storedAddressesRaw) {
        return;
      }

      const parsed = JSON.parse(storedAddressesRaw) as StoredAddressesPayload;
      setShippingAddress((prev) => mergeAddress(prev, parsed.shipping));
      setBillingAddress((prev) => mergeAddress(prev, parsed.billing));
      if (typeof parsed.useSameForBilling === "boolean") {
        setUseSameAddressForBillingState(parsed.useSameForBilling);
        if (parsed.useSameForBilling) {
          setBillingAddress((prev) => mergeAddress(prev, parsed.shipping));
        }
      }
    } catch {
      // ignore malformed address payload
    }
  }, []);

  useEffect(() => {
    persistToStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  useEffect(() => {
    persistToStorage(SHIPPING_METHOD_STORAGE_KEY, shippingMethod);
  }, [shippingMethod]);

  useEffect(() => {
    const payload: StoredAddressesPayload = {
      shipping: shippingAddress,
      billing: useSameAddressForBilling ? shippingAddress : billingAddress,
      useSameForBilling: useSameAddressForBilling,
    };
    persistToStorage(ADDRESSES_STORAGE_KEY, payload);
  }, [billingAddress, shippingAddress, useSameAddressForBilling]);

  const updateShippingMethod = useCallback((method: ShippingMethod) => {
    setShippingMethodState(method);
  }, []);

  const updateShippingAddress = useCallback(
    (updates: Partial<CheckoutAddress>) => {
      setShippingAddress((prev) => {
        const next = mergeAddress(prev, updates);
        if (useSameAddressForBilling) {
          setBillingAddress(next);
        }
        return next;
      });
    },
    [useSameAddressForBilling]
  );

  const updateBillingAddress = useCallback(
    (updates: Partial<CheckoutAddress>) => {
      setBillingAddress((prev) => mergeAddress(prev, updates));
    },
    []
  );

  const setUseSameAddressForBilling = useCallback(
    (useSame: boolean) => {
      setUseSameAddressForBillingState(useSame);
      if (useSame) {
        setBillingAddress(
          mergeAddress(createEmptyAddress(), shippingAddress)
        );
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

  const addToCart = useCallback((item: CartItem) => {
    if (!item || (typeof item.id !== "string" && typeof item.id !== "number")) {
      return;
    }

    setCart((prev) => sanitizeCartItems([...prev, item]));
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    setCart((prev) => {
      const key = id.toString();
      const index = prev.findIndex(
        (item) => getCartKey(item) === key || item.id.toString() === key
      );
      if (index === -1) {
        return prev;
      }

      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, []);

  const updateCartItemQuantity = useCallback(
    (id: string | number, quantity: number) => {
      setCart((prev) => {
        const key = id.toString();
        const template = prev.find(
          (item) => getCartKey(item) === key || item.id.toString() === key
        );

        if (!template) {
          return prev;
        }

        const sanitizedQuantity = clampStoredQuantity(quantity) ?? 1;
        if (sanitizedQuantity <= 0) {
          return prev.filter(
            (item) => getCartKey(item) !== getCartKey(template)
          );
        }

        const others = prev.filter(
          (item) => getCartKey(item) !== getCartKey(template)
        );

        const nextItems = [...others];
        for (let index = 0; index < sanitizedQuantity; index += 1) {
          nextItems.push({ ...template });
        }

        return sanitizeCartItems(nextItems);
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
    clearCartTotals();
    setShippingMethodState(DEFAULT_SHIPPING_METHOD);
    setShippingAddress(createEmptyAddress());
    setBillingAddress(createEmptyAddress());
    setUseSameAddressForBillingState(true);
    removeFromStorage(CART_STORAGE_KEY);
    removeFromStorage(SHIPPING_METHOD_STORAGE_KEY);
    removeFromStorage(ADDRESSES_STORAGE_KEY);
  }, [clearCartTotals]);

  const contextValue = useMemo<CartContextType>(
    () => ({
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
      clearCartTotals,
    }),
    [
      cart,
      cartSubtotal,
      cartTotal,
      cartTotalsUpdatedAt,
      shippingMethod,
      shippingAddress,
      billingAddress,
      useSameAddressForBilling,
      updateShippingMethod,
      updateShippingAddress,
      updateBillingAddress,
      setUseSameAddressForBilling,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      syncCartTotals,
      clearCartTotals,
    ]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
