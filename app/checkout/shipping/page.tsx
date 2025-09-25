"use client";

import { useContext, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartContext,
  type CartItem,
  MAX_PER_PRODUCT,
} from "@/app/contexts/CartContext";

const SHIPPING_COSTS: Record<string, number> = {
  standard: 0,
  express: 12.9,
};

type GroupedCartItem = {
  item: CartItem;
  quantity: number;
};

const groupCartItems = (cart: CartItem[]): GroupedCartItem[] => {
  const map = new Map<string, GroupedCartItem>();

  cart.forEach((entry) => {
    if (!entry) {
      return;
    }

    const key = (entry.documentId ?? entry.id).toString();
    const existing = map.get(key);
    if (existing) {
      existing.quantity += 1;
      return;
    }

    map.set(key, { item: entry, quantity: 1 });
  });

  return Array.from(map.values());
};

async function createCheckoutSession(
  items: { title?: string; price: number; quantity: number }[]
): Promise<{ url?: string }> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export default function ShippingStepPage() {
  const router = useRouter();
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Cart context is unavailable");
  }

  const {
    cart,
    cartSubtotal,
    cartTotal,
    cartTotalsUpdatedAt,
    shippingMethod,
    setShippingMethod,
  } = cartContext;

  const groupedCart = useMemo(() => groupCartItems(cart), [cart]);

  useEffect(() => {
    if (groupedCart.length === 0) {
      router.replace("/cart");
    }
  }, [groupedCart, router]);

  const subtotalFromCart = useMemo(
    () =>
      groupedCart.reduce((sum, { item, quantity }) => {
        const unitPrice = Number(item.price) || 0;
        return sum + unitPrice * quantity;
      }, 0),
    [groupedCart]
  );

  const hasSyncedTotals = cartTotalsUpdatedAt > 0;
  const subtotal = hasSyncedTotals ? cartSubtotal : subtotalFromCart;
  const baseTotal = hasSyncedTotals ? cartTotal : subtotal;
  const shippingCost = SHIPPING_COSTS[shippingMethod] ?? 0;
  const total = baseTotal + shippingCost;
  const reductionAmount = Math.max(subtotal - baseTotal, 0);

  const handleProceedToPayment = async () => {
    const items = groupedCart.reduce<
      { title?: string; price: number; quantity: number }[]
    >((acc, { item, quantity }) => {
      const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
      if (safeQuantity <= 0) {
        return acc;
      }

      const normalizedQuantity = Math.min(safeQuantity, MAX_PER_PRODUCT);
      const unitPrice = Number(item.price) || 0;
      const payload = { price: unitPrice, quantity: normalizedQuantity };
      if (item.title !== undefined) {
        payload.title = item.title;
      }

      acc.push(payload);
      return acc;
    }, []);

    if (shippingMethod === "express") {
      items.push({ title: "Livraison express", price: 12.9, quantity: 1 });
    }

    const { url } = await createCheckoutSession(items);
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Étape 2 : Livraison
        </h1>
        <p className="mt-1 text-slate-600">
          Choisissez votre mode de livraison, puis procédez au paiement.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6">
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Mode de livraison
            </h2>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50">
                <input
                  type="radio"
                  name="shipping"
                  className="radio"
                  checked={shippingMethod === "standard"}
                  onChange={() => setShippingMethod("standard")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">
                      Colissimo Standard (2 à 3 jours ouvrés)
                    </span>
                    <span className="font-semibold text-emerald-600">
                      Offerte
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Livraison sans frais supplémentaires.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50">
                <input
                  type="radio"
                  name="shipping"
                  className="radio"
                  checked={shippingMethod === "express"}
                  onChange={() => setShippingMethod("express")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">
                      Chronopost Express (le lendemain avant 13h)
                    </span>
                    <span className="font-semibold text-slate-900">
                      12,90 €
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Livraison rapide avec supplément.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Récapitulatif</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd>{subtotal.toFixed(2)} €</dd>
              </div>
              <div className="flex justify-between text-slate-500">
                <dt>Réduction</dt>
                <dd
                  className={
                    reductionAmount > 0
                      ? "text-emerald-600 line-through"
                      : "text-slate-400 line-through"
                  }
                >
                  {reductionAmount > 0
                    ? `-${reductionAmount.toFixed(2)} €`
                    : "0,00 €"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Livraison</dt>
                <dd>
                  {shippingCost === 0 ? "Offerte" : `${shippingCost.toFixed(2)} €`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold text-slate-900">
                <dt>Total</dt>
                <dd>{total.toFixed(2)} €</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/checkout/address"
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Retour aux adresses
              </Link>
              <button onClick={handleProceedToPayment} className="btn btn-primary">
                Procéder au paiement
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
