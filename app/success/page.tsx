"use client";

import { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { CartContext, CartContextType } from "../contexts/CartContext";
import orderApis from "../_utils/orderApis";

function SuccessPage() {
  const { user } = useUser();
  const { cart, clearCart } = useContext(CartContext) as CartContextType;

  useEffect(() => {
    const createOrder = async () => {
      if (!cart.length) return;

      const subtotal = cart.reduce(
        (acc, item) => acc + (item.price || 0),
        0
      );
      const shipping = { type: "standard", price: 10 };

      try {
        await orderApis.createOrder({
          data: {
            userId: user?.id,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            products: cart.map((item) => item.id),
            address: {
              line1: "123 Demo Street",
              city: "Paris",
              country: "FR",
              postalCode: "75000",
            },
            shipping,
            subtotal,
            total: subtotal + shipping.price,
            orderStatus: "pending",
          },
        });
        clearCart();
      } catch (error) {
        console.error("Failed to create order", error);
      }
    };

    createOrder();
  }, [cart, clearCart, user]);

  return (
    <section className="p-8 text-center">
      <h1 className="text-xl font-bold">Payment successful</h1>
      <p className="mt-4">Thank you for your purchase.</p>
    </section>
  );
}

export default SuccessPage;
