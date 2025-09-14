"use client";

import { useContext, useEffect } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";
import orderApis from "../_utils/orderApis";
import { useUser } from "@clerk/nextjs";

function SuccessPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();

  useEffect(() => {
    const createOrder = async () => {
      const orderData = {
        data: {
          orderNumber: "271545510232532",
          userId: user?.id ?? "clerk_user_12345",
          userEmail: user?.primaryEmailAddress?.emailAddress ?? "client@example.com",
          products: cart.map((item) => item.id),
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
      };

      try {
        await orderApis.createOrder(orderData);
      } catch (error) {
        console.error("Order creation failed", error);
      } finally {
        clearCart();
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
