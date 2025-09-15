"use client";

import { useContext, useEffect } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";
import orderApis from "../_utils/orderApis";

function SuccessPage() {
  const { clearCart } = useContext(CartContext) as CartContextType;

  useEffect(() => {
    const sendOrder = async () => {
      try {
        await orderApis.createOrder({
          data: {
            orderNumber: "271545510232532",
            userId: "clerk_user_12345",
            userEmail: "client@example.com",
            products: [3],
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
            shipping: { carrier: "DHL", price: 9.99 },
            subtotal: 120.5,
            total: 130.49,
            orderStatus: "pending",
          },
        });
      } catch (error) {
        console.error("Failed to create order", error);
      } finally {
        clearCart();
      }
    };

    sendOrder();
  }, [clearCart]);

  return (
    <section className="p-8 text-center">
      <h1 className="text-xl font-bold">Payment successful</h1>
      <p className="mt-4">Thank you for your purchase.</p>
    </section>
  );
}

export default SuccessPage;
