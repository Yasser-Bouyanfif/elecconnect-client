"use client"
import React, { useContext } from "react";
import { CartContext, CartContextType, CartItem } from "../contexts/CartContext";

function Cart() {
  const { cart } = useContext(CartContext) as CartContextType;

  // Regrouper les articles identiques
  const items = (cart ?? []).reduce<CartItem[]>((acc, item) => {
    const found = acc.find((i) => i.id === item.id);
    if (found) {
      found.qty = (found.qty ?? 1) + (item.qty ?? 1);
    } else {
      acc.push({ ...item, qty: item.qty ?? 1 });
    }
    return acc;
  }, []);

  // Total d’articles (qty par item, défaut = 1)
  const totalQty = items.reduce((sum, item) => sum + (item.qty ?? 1), 0);

  return (
    <div className="h-[300px] w-[250px] bg-gray-100 z-10 rounded-md border shadow-sm absolute mx-10 right-10 top-12 p-5 overflow-auto">
      <div className="mt-4 space-y-6">
        <ul className="space-y-4">
          {items.map((item: CartItem, index: number) => (
            <li key={String(item.id ?? index)} className="flex items-center gap-4">
              {item.image && (
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`}
                  alt={item.title ?? "Product image"}
                  className="size-16 rounded-sm object-cover"
                />
              )}
              <div>
                <h3 className="text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                {(item.price != null || item.qty != null) && (
                  <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                    {item.price != null && (
                      <div>
                        <dt className="inline">Prix:</dt>{" "}
                        <dd className="inline">{item.price} €</dd>
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
      </div>

      <div className="mt-5 space-y-4 text-center">
        <a
          href="/cart"
          className="block rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
        >
          View my cart ({totalQty})
        </a>
        <a
          href="#"
          className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
        >
          Continue shopping
        </a>
      </div>
    </div>
  );
}

export default Cart;
