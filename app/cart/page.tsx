"use client";

import { useContext, useEffect, useState } from "react";
import {
  CartContext,
  CartContextType,
  CartItem,
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

function CartPage() {
  const { cart, addToCart, removeFromCart } = useContext(
    CartContext
  ) as CartContextType;

  const groups: { [key: string]: { item: CartItem; quantity: number } } = {};
  cart.forEach((item) => {
    const key = item.id.toString();
    if (groups[key]) {
      groups[key].quantity += 1;
    } else {
      groups[key] = { item, quantity: 1 };
    }
  });

  const [total, setTotal] = useState(0);

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
        const data = await res.json();
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Failed to calculate total", err);
        setTotal(0);
      }
    })();
  }, [cart]);

  const handleCheckout = async () => {
    const items = Object.values(groups).map(({ item, quantity }) => ({
      title: item.title,
      price: item.price,
      quantity,
    }));
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
                {Object.values(groups).map(({ item, quantity }) => (
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