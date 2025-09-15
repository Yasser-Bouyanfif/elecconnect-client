"use client";

import { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { CartContext, CartContextType } from "../contexts/CartContext";
import orderApis from "../_utils/orderApis";

function SuccessPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();

  useEffect(() => {
    const sendOrder = async () => {
      try {
        const quantityMap: Record<string, number> = {};
        cart.forEach((item) => {
          const key = String(item.id);
          quantityMap[key] = (quantityMap[key] || 0) + 1;
        });

        const items = Object.entries(quantityMap).map(([id, quantity]) => ({
          id,
          quantity,
        }));

        let subtotal = 0;
        if (items.length > 0) {
          try {
            const res = await fetch("/api/cart-total", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
            const data = await res.json();
            subtotal = data.total || 0;
          } catch (err) {
            console.error("Failed to calculate subtotal", err);
          }
        }

        const shipping = { carrier: "DHL", price: 9.99 };
        const total = subtotal + shipping.price;

        await orderApis.createOrder({
          data: {
            orderNumber: crypto.randomUUID(),
            userId: user?.id,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            products: {
              connect: Array.from(
                new Set(cart.map((item) => item.documentId))
              ),
            },
            address: {
              fullName: "Jean Dupont",
              company: "Ma Société",
              address1: "12 rue des Fleurs",
              address2: "Appartement 34",
              postalCode: 75001,
              city: "Paris",
              country: "France",
              phone: 33123456789,
            },
            shipping,
            subtotal,
            total,
            orderStatus: "pending",
          },
        });
      } catch (error) {
        console.error("Failed to create order", error);
      } finally {
        clearCart();
      }
    };

    if (user && cart.length > 0) {
      sendOrder();
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
