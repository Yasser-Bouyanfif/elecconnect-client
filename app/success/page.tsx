"use client";

import { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  CartContext,
  CartContextType,
  ShippingAddress,
  ShippingRate,
} from "../contexts/CartContext";
import orderApis from "../_utils/orderApis";
import { getPublicStoreAddress } from "../lib/store-address";

function SuccessPage() {
  const { cart, clearCart, shippingAddress, selectedShippingRate } =
    useContext(CartContext) as CartContextType;
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

        const defaultAddress = getPublicStoreAddress();

        const resolvedAddress: ShippingAddress = {
          fullName: shippingAddress?.fullName || defaultAddress.fullName || "",
          company: shippingAddress?.company || defaultAddress.company,
          address1: shippingAddress?.address1 || defaultAddress.address1 || "",
          address2: shippingAddress?.address2 || defaultAddress.address2,
          city: shippingAddress?.city || defaultAddress.city || "",
          state: shippingAddress?.state,
          postalCode:
            shippingAddress?.postalCode || defaultAddress.postalCode || "",
          country: shippingAddress?.country || defaultAddress.country || "FR",
          phone: shippingAddress?.phone || defaultAddress.phone,
          email: shippingAddress?.email,
        };

        const fallbackShipping: ShippingRate = {
          objectId: "",
          amount: 0,
          currency: "EUR",
          provider: "Standard",
          serviceLevelName: "",
        };

        const shippingSelection: ShippingRate = selectedShippingRate
          ? {
              ...selectedShippingRate,
              amount:
                typeof selectedShippingRate.amount === "number"
                  ? selectedShippingRate.amount
                  : 0,
              currency:
                selectedShippingRate.currency || fallbackShipping.currency,
            }
          : fallbackShipping;

        const total = subtotal + (shippingSelection.amount || 0);

        const orderResponse = await orderApis.createOrder({
          data: {
            orderNumber: crypto.randomUUID(),
            userId: user?.id,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            address: {
              fullName: resolvedAddress.fullName,
              company: resolvedAddress.company,
              address1: resolvedAddress.address1,
              address2: resolvedAddress.address2,
              postalCode: resolvedAddress.postalCode,
              city: resolvedAddress.city,
              country: resolvedAddress.country,
              phone: resolvedAddress.phone,
            },
            shipping: {
              carrier: shippingSelection.provider,
              service: shippingSelection.serviceLevelName,
              price: shippingSelection.amount,
              currency: shippingSelection.currency,
              estimatedDays: shippingSelection.estimatedDays,
              rateId: shippingSelection.objectId,
              shipmentId: shippingSelection.shipmentId,
            },
            subtotal,
            total,
            orderStatus: "pending",
          },
        });

        const orderDocumentId =
          orderResponse?.data?.data?.documentId ??
          orderResponse?.data?.documentId ??
          orderResponse?.data?.data?.id ??
          orderResponse?.data?.id;

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
                      connect: [orderDocumentId],
                    },
                    product: {
                      connect: [productDocumentId],
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
  }, [
    cart,
    clearCart,
    selectedShippingRate,
    shippingAddress,
    user,
  ]);

  return (
    <section className="p-8 text-center">
      <h1 className="text-xl font-bold">Payment successful</h1>
      <p className="mt-4">Thank you for your purchase.</p>
    </section>
  );
}

export default SuccessPage;
