"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { CartContext, CartContextType } from "../contexts/CartContext";

type OrderStatus = "idle" | "creating" | "success" | "error" | "unauthorized";

function SuccessPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const hasAttemptedOrder = useRef(false);

  useEffect(() => {
    if (!user || cart.length === 0 || hasAttemptedOrder.current) {
      return;
    }

    hasAttemptedOrder.current = true;
    setOrderStatus("creating");

    const createOrder = async () => {
      try {
        const response = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: cart.map(({ id }) => ({ id })),
          }),
        });

        if (response.status === 401) {
          setOrderStatus("unauthorized");
          console.error("Failed to create order: unauthorized");
          return;
        }

        if (!response.ok) {
          setOrderStatus("error");
          console.error("Failed to create order", await response.text());
          return;
        }

        const payload = (await response.json().catch(() => null)) as
          | { success?: boolean }
          | null;

        if (payload?.success) {
          setOrderStatus("success");
          clearCart();
        } else {
          setOrderStatus("error");
          console.error("Order API did not confirm success", payload);
        }
      } catch (error) {
        setOrderStatus("error");
        console.error("Failed to create order", error);
      }
    };

    void createOrder();
  }, [cart, clearCart, user]);

  return (
    <section className="p-8 text-center">
      <h1 className="text-xl font-bold">Payment successful</h1>
      <p className="mt-4">Thank you for your purchase.</p>

      {orderStatus === "creating" && (
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;re finalising your order details.
        </p>
      )}

      {orderStatus === "success" && (
        <p className="mt-2 text-sm text-muted-foreground">
          A confirmation email will arrive shortly.
        </p>
      )}

      {orderStatus === "unauthorized" && (
        <p className="mt-2 text-sm text-red-600">
          We couldn&apos;t verify your session. Please sign in again so we can
          record your order.
        </p>
      )}

      {orderStatus === "error" && (
        <p className="mt-2 text-sm text-red-600">
          Something went wrong while registering your order. Our support team
          has been notified.
        </p>
      )}
    </section>
  );
}

export default SuccessPage;
