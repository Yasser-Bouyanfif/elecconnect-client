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
        type AggregatedCartItem = {
          id: string;
          documentId: string;
          quantity: number;
        };

        const quantityMap = new Map<string, AggregatedCartItem>();

        cart.forEach((item) => {
          const id = String(item.id);
          const existing = quantityMap.get(id);
          if (existing) {
            existing.quantity += 1;
          } else {
            quantityMap.set(id, {
              id,
              documentId: item.documentId,
              quantity: 1,
            });
          }
        });

        const aggregatedItems = Array.from(quantityMap.values());

        const itemsForPricing = aggregatedItems.map(({ id, quantity }) => ({
          id,
          quantity,
        }));

        let subtotal = 0;
        let lineItemsPricing: Array<{
          id: string;
          unitPrice: number;
        }> = [];

        if (itemsForPricing.length > 0) {
          try {
            const res = await fetch("/api/cart-total", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: itemsForPricing }),
            });
            const data = await res.json();
            subtotal = data.total || 0;
            if (Array.isArray(data.items)) {
              lineItemsPricing = data.items.map(
                (item: { id: string | number; unitPrice: number }) => ({
                  id: String(item.id),
                  unitPrice: Number(item.unitPrice) || 0,
                })
              );
            }
          } catch (err) {
            console.error("Failed to calculate subtotal", err);
          }
        }

        const shipping = { carrier: "DHL", price: 9.99 };
        const total = subtotal + shipping.price;

        const unitPriceMap = new Map(
          lineItemsPricing.map((item) => [item.id, item.unitPrice])
        );

        const orderLinesPayload =
          aggregatedItems.length > 0
            ? {
                create: aggregatedItems.map(({ id, documentId, quantity }) => {
                  const payload: {
                    quantity: number;
                    unitPrice: number;
                    product?: {
                      connect: {
                        documentId: string;
                      };
                    };
                  } = {
                    quantity,
                    unitPrice: unitPriceMap.get(id) ?? 0,
                  };

                  if (documentId) {
                    payload.product = {
                      connect: {
                        documentId,
                      },
                    };
                  }

                  return payload;
                }),
              }
            : undefined;

        const orderData: Record<string, unknown> = {
          orderNumber: crypto.randomUUID(),
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
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
        };

        if (orderLinesPayload) {
          orderData.orderLines = orderLinesPayload;
        }

        await orderApis.createOrder({
          data: orderData,
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
