"use client";

import { useContext, useEffect } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";
import orderApi from "../_utils/orderApis";
import { useUser } from "@clerk/nextjs";

function SuccessPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();

  useEffect(() => {
    if (!user || cart.length === 0) {
      clearCart();
      return;
    }

    const submitOrder = async () => {
      try {
        const shippingPrice = 5;
        const subtotal = cart.reduce(
          (sum, item) => sum + (item.price || 0),
          0
        );

        const order = {
          data: {
            userId: user.id,
            userEmail: user.primaryEmailAddress?.emailAddress,
            products: cart.map((item) => item.id),
            address: {
              fullName: "John Doe",
              company: "ACME",
              address1: "123 Main St",
              address2: "",
              postalCode: 75001,
              city: "Paris",
              country: "France",
              phone: "0102030405",
            },
            shipping: {
              carrier: "UPS",
              price: shippingPrice,
            },
            subtotal,
            total: subtotal + shippingPrice,
            orderStatus: "pending",
          },
        };

        await orderApi.createOrder(order);
      } catch (err) {
        console.error("Failed to create order", err);
      } finally {
        clearCart();
      }
    };

    submitOrder();
  }, [cart, clearCart, user]);

  return (
    <section className="p-8 text-center">
      <h1 className="text-xl font-bold">Payment successful</h1>
      <p className="mt-4">Thank you for your purchase.</p>
    </section>
  );
}

export default SuccessPage;
