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
        const productMap: Record<
          string,
          { quantity: number; unitPrice: number; documentId: string }
        > = {};

        cart.forEach((item) => {
          const key = String(item.id);
          const existing = productMap[key];

          const resolvedUnitPrice =
            existing?.unitPrice ??
            (typeof item.price === "number"
              ? item.price
              : Number(item.price ?? 0) || 0);

          productMap[key] = {
            documentId: existing?.documentId ?? item.documentId,
            quantity: (existing?.quantity ?? 0) + 1,
            unitPrice: resolvedUnitPrice,
          };
        });

        const items = Object.entries(productMap).map(([id, { quantity }]) => ({
          id,
          quantity,
        }));

        const orderLineInputs = Object.values(productMap)
          .map(({ documentId, quantity, unitPrice }) => ({
            productDocumentId: documentId,
            quantity,
            unitPrice,
          }))
          .filter(({ productDocumentId }) => Boolean(productDocumentId));

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

        const orderResponse = await orderApis.createOrder({
          data: {
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
          },
        });

        const extractDocumentId = (payload: unknown): string | undefined => {
          if (!payload || typeof payload !== "object") {
            return undefined;
          }

          const candidateValues = [
            (payload as { documentId?: unknown }).documentId,
            (payload as { data?: { documentId?: unknown } }).data?.documentId,
            (
              payload as {
                data?: { data?: { documentId?: unknown; attributes?: { documentId?: unknown } } };
              }
            ).data?.data?.documentId,
            (
              payload as {
                data?: { data?: { attributes?: { documentId?: unknown } } };
              }
            ).data?.data?.attributes?.documentId,
            (payload as { data?: { attributes?: { documentId?: unknown } } }).data?.attributes
              ?.documentId,
          ];

          for (const value of candidateValues) {
            if (typeof value === "string" && value.trim().length > 0) {
              return value;
            }
          }

          return undefined;
        };

        const orderDocumentId = extractDocumentId(orderResponse?.data);

        if (!orderDocumentId) {
          console.error("Order created without documentId", orderResponse?.data);
        }

        if (orderDocumentId && orderLineInputs.length > 0) {
          await Promise.all(
            orderLineInputs.map(
              ({ productDocumentId, quantity, unitPrice }) =>
                orderApis.createOrderLine({
                  data: {
                    quantity,
                    unitPrice,
                    order: {
                      connect: [
                        {
                          documentId: orderDocumentId,
                        },
                      ],
                    },
                    product: {
                      connect: [
                        {
                          documentId: productDocumentId,
                        },
                      ],
                    },
                  },
                })
            )
          );
        }
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
