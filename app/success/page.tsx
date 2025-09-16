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
        const orderLineMap: Record<
          string,
          {
            quantity: number;
            unitPrice: number;
            productDocumentId?: string;
            productId?: string | number;
          }
        > = {};
        cart.forEach((item) => {
          const key = String(item.id);
          if (!orderLineMap[key]) {
            const parsedPrice = Number(item.price ?? 0);
            orderLineMap[key] = {
              quantity: 0,
              unitPrice: Number.isFinite(parsedPrice) ? parsedPrice : 0,
              productDocumentId: item.documentId,
              productId: item.id,
            };
          }
          orderLineMap[key].quantity += 1;
        });

        const items = Object.entries(orderLineMap).map(([id, { quantity }]) => ({
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

        const orderLineData = Object.values(orderLineMap).reduce(
          (
            acc,
            { quantity, unitPrice, productDocumentId, productId }
          ): Array<{
            quantity: number;
            unitPrice: number;
            product: {
              connect: Array<{ documentId?: string; id?: number }>;
            };
          }> => {
            if (!quantity) {
              return acc;
            }

            let connectEntry: { documentId?: string; id?: number } | undefined;

            if (productDocumentId) {
              connectEntry = { documentId: productDocumentId };
            } else if (productId !== undefined && productId !== null) {
              const parsedId = Number.parseInt(String(productId), 10);
              if (!Number.isNaN(parsedId)) {
                connectEntry = { id: parsedId };
              }
            }

            if (!connectEntry) {
              return acc;
            }

            acc.push({
              quantity,
              unitPrice,
              product: { connect: [connectEntry] },
            });

            return acc;
          },
          []
        );

        await orderApis.createOrder({
          data: {
            orderNumber: crypto.randomUUID(),
            userId: user?.id,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            order_line: {
              create: orderLineData,
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
