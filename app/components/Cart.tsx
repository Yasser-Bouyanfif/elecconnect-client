"use client"
import React, { useContext } from "react";
import { CartContext, CartContextType, CartItem } from "../contexts/CartContext";

function Cart() {
  const { cart } = useContext(CartContext) as CartContextType;
  return (
    <div className="h-[300px] w-[250px] bg-gray-100 z-10 rounded-md border shadow-sm absolute mx-10 right-10 top-12 p-5 overflow-auto">
      <div className="mt-4 space-y-6">
        <ul className="space-y-4">
          {cart?.map((item: CartItem) => (
            <li key={item.id} className="flex items-center gap-4">
              {item.image && (
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`}
                  alt={item.title}
                  className="size-16 rounded-sm object-cover"
                />
              )}
              <div>
                <h3 className="text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                {item.price && (
                  <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                    <div>
                      <dt className="inline">Prix:</dt>
                      <dd className="inline">{item.price} €</dd>
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
          View my cart ({cart?.length})
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
