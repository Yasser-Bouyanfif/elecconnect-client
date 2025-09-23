"use client";

import { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { CartContext, CartContextType } from "../contexts/CartContext";

function SuccessPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();

  useEffect(() => {
    const createOrder = async () => {
      try {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            cart: cart.map(({ id, documentId }) => ({ id, documentId })),
          }),
        });

        if (!response.ok) {
          console.error("Failed to create order", await response.text());
        }
      } catch (error) {
        console.error("Failed to create order", error);
      } finally {
        clearCart();
      }
    };

    if (user && cart.length > 0) {
      createOrder();
    }
  }, [cart, clearCart, user]);

  return (
    <section className="p-8 text-center">
      <h1 className="text-xl font-bold">Payment successful</h1>
      <p className="mt-4">Thank you for your purchase.</p>
    </section>
  );
}

export default SuccessPage;
