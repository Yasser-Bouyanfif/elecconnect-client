"use client";

import { useContext, useEffect, useMemo, useState } from "react";

import {
  CartContext,
  CartContextType,
  CartItem,
} from "../contexts/CartContext";
import { SERVER_URL } from "../lib/constants";

type ShippingMethod = {
  id: string | number;
  name: string;
  price: number;
  currency: string;
  carrier?: string;
  service?: string;
  deliveryEstimate?: string;
};

const DEFAULT_CURRENCY = "EUR";

const formatCurrency = (value: number, currency = DEFAULT_CURRENCY) => {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
};

async function createCheckoutSession(
  items: {
    title?: string;
    price?: number;
    quantity: number;
  }[],
  shippingMethod: ShippingMethod
) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, shippingMethod }),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Impossible de démarrer le paiement.";
    if (text) {
      try {
        const data = JSON.parse(text) as { error?: string; message?: string };
        message = data.error || data.message || message;
      } catch {
        message = text;
      }
    }
    throw new Error(message);
  }

  return (await res.json()) as { url?: string };
}

function CartPage() {
  const { cart, addToCart, removeFromCart } = useContext(
    CartContext
  ) as CartContextType;

  const groupedItems = useMemo(() => {
    const result: { [key: string]: { item: CartItem; quantity: number } } = {};
    cart.forEach((item) => {
      const key = item.id.toString();
      if (result[key]) {
        result[key].quantity += 1;
      } else {
        result[key] = { item, quantity: 1 };
      }
    });
    return result;
  }, [cart]);

  const [subTotal, setSubTotal] = useState(0);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(
    null
  );
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const hasItems = cart.length > 0;

  useEffect(() => {
    const map: { [key: string]: number } = {};
    cart.forEach((item) => {
      const key = item.id.toString();
      map[key] = (map[key] || 0) + 1;
    });

    const items = Object.entries(map).map(([id, quantity]) => ({
      id,
      quantity,
    }));

    if (items.length === 0) {
      setSubTotal(0);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/cart-total", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();
        setSubTotal(data.total || 0);
      } catch (err) {
        console.error("Failed to calculate total", err);
        setSubTotal(0);
      }
    })();
  }, [cart]);

  useEffect(() => {
    let cancelled = false;

    const loadShippingMethods = async () => {
      setShippingLoading(true);
      setShippingError(null);
      try {
        const response = await fetch("/api/shipping-methods", {
          cache: "no-store",
        });
        const text = await response.text();
        if (!response.ok) {
          let errorMessage = "Impossible de charger les modes de livraison.";
          if (text) {
            try {
              const data = JSON.parse(text) as {
                error?: string;
                message?: string;
              };
              errorMessage = data.error || data.message || errorMessage;
            } catch {
              errorMessage = text;
            }
          }
          throw new Error(errorMessage);
        }

        const parsed = text
          ? (JSON.parse(text) as { shippingMethods?: ShippingMethod[] })
          : { shippingMethods: [] };

        if (cancelled) {
          return;
        }

        const methods = Array.isArray(parsed.shippingMethods)
          ? parsed.shippingMethods
          : [];

        setShippingMethods(methods);
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Impossible de charger les modes de livraison.";
          setShippingError(message);
          setShippingMethods([]);
          setSelectedShippingId(null);
        }
      } finally {
        if (!cancelled) {
          setShippingLoading(false);
        }
      }
    };

    if (!hasItems) {
      setShippingMethods([]);
      setSelectedShippingId(null);
      setShippingLoading(false);
      setShippingError(null);
      return () => {
        cancelled = true;
      };
    }

    loadShippingMethods();

    return () => {
      cancelled = true;
    };
  }, [hasItems]);

  useEffect(() => {
    if (shippingMethods.length === 0) {
      setSelectedShippingId(null);
      return;
    }

    setSelectedShippingId((previous) => {
      if (
        previous &&
        shippingMethods.some((method) => String(method.id) === previous)
      ) {
        return previous;
      }

      return String(shippingMethods[0].id);
    });
  }, [shippingMethods]);

  const selectedShipping = shippingMethods.find(
    (method) => String(method.id) === selectedShippingId
  );

  const shippingCost = selectedShipping?.price ?? 0;
  const orderTotal = subTotal + shippingCost;
  const currency = selectedShipping?.currency || DEFAULT_CURRENCY;
  const isCheckoutDisabled =
    isProcessingCheckout || !hasItems || shippingLoading || !selectedShipping;

  const handleCheckout = async () => {
    if (!selectedShipping) {
      setCheckoutError(
        "Veuillez sélectionner un mode de livraison avant de continuer."
      );
      return;
    }

    const items = Object.values(groupedItems).map(({ item, quantity }) => ({
      title: item.title,
      price: item.price,
      quantity,
    }));

    setCheckoutError(null);
    setIsProcessingCheckout(true);

    try {
      const { url } = await createCheckoutSession(items, selectedShipping);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Impossible de démarrer le paiement."
      );
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Cart
            </h1>
          </header>

          {cart.length === 0 ? (
            <p className="mt-8 text-center text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <div className="mt-8">
              <ul className="space-y-4">
                {Object.values(groupedItems).map(({ item, quantity }) => (
                  <li key={item.id} className="flex items-center gap-4">
                    {item.banner?.url && (
                      <img
                        src={`${SERVER_URL}${item.banner.url}`}
                        alt={item.title}
                        className="size-16 rounded-sm object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="text-sm text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      {item.price !== undefined && (
                        <p className="mt-0.5 text-xs text-gray-600">
                          {item.price} €
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-2 text-sm"
                        aria-label="Decrease quantity"
                        onClick={() => removeFromCart(item.id)}
                      >
                        -
                      </button>
                      <span className="text-sm">{quantity}</span>
                      <button
                        type="button"
                        className="px-2 text-sm"
                        aria-label="Increase quantity"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                <div className="w-screen max-w-lg space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code de réduction"
                      className="w-full border px-2 py-1 text-sm"
                    />
                    <button className="rounded-sm bg-gray-700 px-3 py-1 text-sm text-gray-100">
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-3 rounded-sm border border-gray-200 p-4">
                    <h2 className="text-sm font-medium text-gray-900">
                      Mode de livraison
                    </h2>

                    {shippingLoading ? (
                      <p className="text-sm text-gray-500">
                        Chargement des transporteurs...
                      </p>
                    ) : shippingError ? (
                      <p className="text-sm text-red-600">{shippingError}</p>
                    ) : shippingMethods.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Aucun mode de livraison disponible pour le moment.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {shippingMethods.map((method) => {
                          const methodId = String(method.id);
                          const details = [method.carrier, method.service]
                            .filter(Boolean)
                            .join(" • ");
                          const priceLabel =
                            method.price > 0
                              ? formatCurrency(method.price, method.currency)
                              : "Gratuit";
                          return (
                            <li key={methodId}>
                              <label className="flex cursor-pointer items-start justify-between gap-3 rounded-sm border border-gray-200 p-3 transition hover:border-gray-300">
                                <span className="flex items-start gap-3">
                                  <input
                                    type="radio"
                                    name="shipping-method"
                                    value={methodId}
                                    checked={selectedShippingId === methodId}
                                    onChange={() =>
                                      setSelectedShippingId(methodId)
                                    }
                                    className="mt-1 h-4 w-4"
                                  />
                                  <span>
                                    <span className="block text-sm font-medium text-gray-900">
                                      {method.name}
                                    </span>
                                    {details && (
                                      <span className="block text-xs text-gray-500">
                                        {details}
                                      </span>
                                    )}
                                    {method.deliveryEstimate && (
                                      <span className="block text-xs text-gray-500">
                                        Livraison estimée : {method.deliveryEstimate}
                                      </span>
                                    )}
                                  </span>
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {priceLabel}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {!shippingLoading &&
                      !shippingError &&
                      shippingMethods.length > 0 &&
                      !selectedShipping && (
                        <p className="text-xs text-orange-600">
                          Veuillez sélectionner un mode de livraison pour
                          continuer.
                        </p>
                      )}
                  </div>

                  <dl className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <dt>Sous-total</dt>
                      <dd>{formatCurrency(subTotal, currency)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Livraison</dt>
                      <dd>
                        {selectedShipping
                          ? shippingCost > 0
                            ? formatCurrency(shippingCost, currency)
                            : "Gratuit"
                          : "--"}
                      </dd>
                    </div>
                    <div className="flex justify-between !text-base font-medium">
                      <dt>Total</dt>
                      <dd>{formatCurrency(orderTotal, currency)}</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckoutDisabled}
                      className="block rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessingCheckout ? "Patientez..." : "Checkout"}
                    </button>
                  </div>

                  {checkoutError && (
                    <p className="text-sm text-red-600">{checkoutError}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CartPage;
