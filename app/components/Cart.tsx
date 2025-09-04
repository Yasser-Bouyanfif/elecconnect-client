"use client";
import React, { useContext, useMemo } from "react";
import Image from "next/image";
import { CartContext, CartContextType, CartItem } from "../contexts/CartContext";

export default function Cart() {
  const { cart } = useContext(CartContext) as CartContextType;

  // Regrouper les articles par id et sommer les quantités
  const items = useMemo(() => {
    const acc: CartItem[] = [];
    (cart ?? []).forEach((item) => {
      const idx = acc.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        acc[idx].qty = (acc[idx].qty ?? 1) + (item.qty ?? 1);
      } else {
        acc.push({ ...item, qty: item.qty ?? 1 });
      }
    });
    return acc;
  }, [cart]);

  // Totaux
  const totalQty = useMemo(
    () => items.reduce((sum, i) => sum + (i.qty ?? 1), 0),
    [items]
  );

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + Number(i.price ?? 0) * (i.qty ?? 1),
        0
      ),
    [items]
  );

  if (!items.length) {
    return (
      <div className="h-[300px] w-[250px] bg-gray-100 z-10 rounded-md border shadow-sm absolute mx-10 right-10 top-12 p-5">
        <p className="text-sm text-gray-600">Votre panier est vide.</p>
      </div>
    );
  }

  const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL ?? "").replace(
    /^http:/,
    "https:"
  );

  return (
    <div className="h-[300px] w-[250px] bg-gray-100 z-10 rounded-md border shadow-sm absolute mx-10 right-10 top-12 p-5 overflow-auto">
      <div className="mt-2">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              {item.image ? (() => {
                const src = item.image.startsWith("http")
                  ? item.image.startsWith(serverUrl)
                    ? item.image
                    : ""
                  : `${serverUrl}${item.image}`;
                return src ? (
                  <Image
                    src={src}
                    alt={item.title ?? "Product image"}
                    width={56}
                    height={56}
                    className="size-14 rounded-sm object-cover"
                  />
                ) : null;
              })() : null}

              <div className="min-w-0">
                <h3 className="text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                {(item.price != null || item.qty != null) && (
                  <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                    {item.price != null && (
                      <div>
                        <dt className="inline">Prix:</dt>{" "}
                        <dd className="inline">{Number(item.price).toFixed(2)} €</dd>
                      </div>
                    )}
                    <div>
                      <dt className="inline">Quantité:</dt>{" "}
                      <dd className="inline">{item.qty ?? 1}</dd>
                    </div>
                  </dl>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Résumé */}
        <div className="mt-4 flex items-center justify-between border-t pt-2 text-sm">
          <span className="text-gray-700">Articles:</span>
          <span className="font-medium">{totalQty}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-gray-700">Total:</span>
          <span className="font-semibold">{totalAmount.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
}
