"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import {
  CartContext,
  CartContextType,
  CartItem,
  MAX_PER_PRODUCT,
} from "../contexts/CartContext";
import { SERVER_URL } from "../lib/constants";

async function createCheckoutSession(items: {
  title?: string;
  price?: number;
  quantity: number;
}[]) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return (await res.json()) as { url?: string };
}

const toCartKey = (item: CartItem) =>
  (item.documentId ?? item.id).toString();

function CartPage() {
  const { cart, addToCart, removeFromCart } = useContext(
    CartContext
  ) as CartContextType;

  const groups = useMemo(() => {
    const map = new Map<string, { item: CartItem; quantity: number }>();

    cart.forEach((item) => {
      if (!item) {
        return;
      }

      const key = toCartKey(item);
      const entry = map.get(key);
      if (entry) {
        entry.quantity += 1;
      } else {
        map.set(key, { item, quantity: 1 });
      }
    });

    return Array.from(map.values());
  }, [cart]);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const items = groups
      .map(({ item, quantity }) => {
        const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
        if (safeQuantity <= 0) {
          return null;
        }

        const { id } = item;
        if (typeof id !== "string" && typeof id !== "number") {
          return null;
        }

        return {
          id: id.toString(),
          quantity: Math.min(safeQuantity, MAX_PER_PRODUCT),
        };
      })
      .filter(
        (
          entry
        ): entry is { id: string; quantity: number } => entry !== null
      );

    if (items.length === 0) {
      setTotal(0);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/cart-total", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (!res.ok) {
          console.error("Failed to calculate total", await res.text());
          setTotal(0);
          return;
        }

        const data = await res.json();
        const parsedTotal = Number(data.total);
        setTotal(Number.isFinite(parsedTotal) ? parsedTotal : 0);
      } catch (err) {
        console.error("Failed to calculate total", err);
        setTotal(0);
      }
    })();
  }, [groups]);

  const handleCheckout = async () => {
    const items = groups
      .map(({ item, quantity }) => {
        const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
        if (safeQuantity <= 0) {
          return null;
        }

        return {
          title: item.title,
          price: item.price,
          quantity: Math.min(safeQuantity, MAX_PER_PRODUCT),
        };
      })
      .filter(
        (
          entry
        ): entry is { title?: string; price?: number; quantity: number } =>
          entry !== null
      );
    if (items.length === 0) {
      return;
    }
    const { url } = await createCheckoutSession(items);
    if (url) {
      window.location.href = url;
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
            <p className="mt-8 text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="mt-8">
              <ul className="space-y-4">
                {groups.map(({ item, quantity }) => {
                  const numericQuantity = Number.isFinite(quantity)
                    ? quantity
                    : 0;
                  const displayQuantity = Math.min(
                    numericQuantity,
                    MAX_PER_PRODUCT
                  );
                  const canIncrease = displayQuantity < MAX_PER_PRODUCT;

                  return (
                    <li key={toCartKey(item)} className="flex items-center gap-4">
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
                      <span className="text-sm">{displayQuantity}</span>
                      <button
                        type="button"
                        className="px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                        onClick={() => {
                          if (canIncrease) {
                            addToCart(item);
                          }
                        }}
                        disabled={!canIncrease}
                      >
                        +
                      </button>
                    </div>
                  </li>
                  );
                })}
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

                  <dl className="space-y-0.5 text-sm text-gray-700">
                    <div className="flex justify-between !text-base font-medium">
                      <dt>Total</dt>
                      <dd>{total} €</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <button
                      onClick={handleCheckout}
                      className="block rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                    >
                      Checkout
                    </button>
                  </div>
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