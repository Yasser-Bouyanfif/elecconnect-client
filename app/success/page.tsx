"use client";

import { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import orderApis from "../_utils/orderApis";
import { CartContext, CartContextType } from "../contexts/CartContext";
import axiosClient from "../_utils/axiosClient";

export default function SuccessPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();

  useEffect(() => {
    const createOrder = async () => {
      try {
        const products = cart.map((item) => item.id);
        const prices = await Promise.all(
          products.map(async (id) => {
            const res = await axiosClient.get(`/products/${id}`);
            return res.data?.data?.attributes?.price || 0;
          })
        );
        const subtotal = prices.reduce((a, b) => a + b, 0);
        await orderApis.createOrder({
          data: {
            userId: user?.id,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            products,
            address: user?.unsafeMetadata?.address,
            subtotal,
            total: subtotal,
            paymentStatus: "paid",
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        clearCart();
      }
    };
    if (cart.length) createOrder();
  }, [cart, clearCart, user]);

  return (
    <section className="mx-auto max-w-screen-md px-4 py-8 text-center">
      <h1 className="mb-4 text-2xl font-bold">Paiement réussi</h1>
      <p>Merci pour votre achat.</p>
    </section>
  );
}
