"use client";

import { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { CartContext, CartContextType } from "../contexts/CartContext";
import productApi from "../_utils/productApis";
import orderApi from "../_utils/orderApis";

export default function SuccessPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();

  useEffect(() => {
    const recordOrder = async () => {
      try {
        if (!user || cart.length === 0) return;

        const quantities = new Map<string | number, number>();
        cart.forEach((item) => {
          quantities.set(item.id, (quantities.get(item.id) || 0) + 1);
        });

        let subtotal = 0;
        const products: { product: string | number; quantity: number }[] = [];
        for (const [id, quantity] of quantities) {
          try {
            const res = await productApi.getProductById(String(id));
            const product = res.data?.data?.[0];
            const price = product?.attributes?.price ?? 0;
            subtotal += price * quantity;
            products.push({ product: id, quantity });
          } catch (err) {
            console.error(`Failed to fetch product ${id}`, err);
          }
        }

        const shipping = { carrier: "standard", price: 0 };
        const total = subtotal + shipping.price;

        const unsafe = user.unsafeMetadata as Record<string, unknown> | undefined;

        await orderApi.createOrder({
          data: {
            userId: user.id,
            userEmail: user.primaryEmailAddress?.emailAddress,
            products,
            shipping,
            subtotal,
            total,
            paymentStatus: "paid",
            address: {
              fullName: user.fullName,
              email: user.primaryEmailAddress?.emailAddress,
              address: (unsafe?.shippingAddress as string) ?? "",
            },
          },
        });
      } catch (err) {
        console.error("Failed to record order", err);
      } finally {
        clearCart();
      }
    };

    if (cart.length) {
      recordOrder();
    }
  }, [cart, clearCart, user]);

  return (
    <section className="mx-auto max-w-md p-4 text-center">
      <h1 className="mb-4 text-2xl font-bold">Paiement confirmé</h1>
      <p>Merci pour votre achat. Votre commande a été enregistrée.</p>
    </section>
  );
}
