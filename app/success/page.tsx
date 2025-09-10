"use client";

import React, { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import {
  CartContext,
  CartContextType,
  CartItem,
} from "../contexts/CartContext";
import productApi from "@/app/_utils/productApis";
import orderApis from "@/app/_utils/orderApis";

export default function Success() {
  const { user } = useUser();
  const { clearCart } = useContext(CartContext) as CartContextType;
  const searchParams = useSearchParams();

  useEffect(() => {
    async function finalize() {
      const stored = localStorage.getItem("cart");
      const cart: CartItem[] = stored ? JSON.parse(stored) : [];
      const productIds = cart.map((i) => i.id);
      const sessionId = searchParams.get("session_id");
      if (sessionId) {
        console.log("Stripe session:", sessionId);
      }
      let subtotal = 0;
      for (const id of productIds) {
        try {
          const res = await productApi.getProductById(String(id));
          const data = res?.data?.data?.[0] ?? res?.data?.data;
          subtotal += data?.price ?? 0;
        } catch (e) {
          console.error(e);
        }
      }
      const orderData = {
        data: {
          orderNumber: `ORD-${Date.now()}`,
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          products: productIds,
          address: user?.unsafeMetadata?.address || {},
          shipping: { carrier: "Colissimo", price: 500 },
          subtotal,
          total: subtotal + 500,
          paymentStatus: "paid",
        },
      };
      try {
        await orderApis.createOrder(orderData);
      } catch (err) {
        console.error(err);
      }
      clearCart();
    }
    finalize();
  }, [user, clearCart, searchParams]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Payment Successful</h1>
      <p>Thank you for your purchase.</p>
    </div>
  );
}
