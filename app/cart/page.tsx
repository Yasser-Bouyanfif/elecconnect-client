"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: string | number;
  title?: string;
  price?: number;
  qty?: number;
  image?: string;
};

const STORAGE_KEY = "cart";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      const array = Array.isArray(parsed) ? parsed : [];
      setItems(array);
    } catch {
      setItems([]);
    }
  }, []);

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Your Cart</h1>
          </header>

          <div className="mt-8">
            {items.length === 0 ? (
              <p className="text-center text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="size-16 rounded-sm object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-sm text-gray-900">{item.title}</h3>
                      <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                        <div>
                          <dt className="inline">Prix:&nbsp;</dt>
                          <dd className="inline">{(item.price ?? 0).toFixed(2)}€</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-2">
                      <span className="text-xs text-gray-700">x{item.qty ?? 1}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
              <div className="w-screen max-w-lg space-y-4">
                <dl className="space-y-0.5 text-sm text-gray-700">
                  <div className="flex justify-between !text-base font-medium">
                    <dt>Total</dt>
                    <dd>{total.toFixed(2)}€</dd>
                  </div>
                </dl>

                <input
                  type="text"
                  placeholder="Code promo"
                  className="w-full rounded-sm border border-gray-300 p-2 text-sm"
                />

                <div className="flex justify-end">
                  <a
                    href="#"
                    className="block rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                  >
                    Checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

