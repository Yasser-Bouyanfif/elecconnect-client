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
        const lineMap: Record<string, { quantity: number; unitPrice: number; documentId: string }> = {};
        cart.forEach((item) => {
          const key = String(item.documentId);
          if (!lineMap[key]) {
            lineMap[key] = {
              quantity: 0,
              unitPrice: item.price || 0,
              documentId: item.documentId,
            };
          }
          lineMap[key].quantity += 1;
        });

        const orderLinesData = Object.values(lineMap).map(
          ({ quantity, unitPrice, documentId }) => ({
            quantity,
            unitPrice,
            product: { connect: [documentId] },
          })
        );

        const subtotal = orderLinesData.reduce(
          (sum, line) => sum + line.quantity * line.unitPrice,
          0
        );
        const shipping = { carrier: "DHL", price: 9.99 };
        const total = subtotal + shipping.price;

        await orderApis.createOrder({
          data: {
            orderNumber: crypto.randomUUID(),
            userId: user?.id,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            orderLines: { create: orderLinesData },
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
