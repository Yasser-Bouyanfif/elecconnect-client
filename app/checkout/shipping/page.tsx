"use client";

import React, { useMemo, useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartContext, CartContextType, CartItem, MAX_PER_PRODUCT } from "../../contexts/CartContext";

function groupCart(cart: (CartItem | null | undefined)[]) {
  const map = new Map<string, { item: CartItem; quantity: number }>();
  const toKey = (i: CartItem) => (i.documentId ?? i.id).toString();
  cart.forEach((i) => {
    if (!i) return;
    const k = toKey(i);
    const e = map.get(k);
    if (e) e.quantity += 1; else map.set(k, { item: i, quantity: 1 });
  });
  return Array.from(map.values());
}

async function createCheckoutSession(items: { title?: string; price: number; quantity: number }[]) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as { url?: string };
}

export default function ShippingStepPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartTotal, cartTotalsUpdatedAt } = useContext(
    CartContext
  ) as CartContextType;
  const groups = useMemo(() => groupCart(cart), [cart]);

  useEffect(() => {
    if (groups.length === 0) {
      router.replace("/cart");
    }
  }, [groups, router]);

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  const handleProceedToPayment = async () => {
    // Build line items from cart
    type CheckoutItem = { title?: string; price: number; quantity: number };
    const items = groups.reduce<CheckoutItem[]>((acc, { item, quantity }) => {
      const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
      if (safeQuantity <= 0) {
        return acc;
      }

      const checkoutItem: CheckoutItem = {
        price: Number(item.price) || 0,
        quantity: Math.min(safeQuantity, MAX_PER_PRODUCT),
      };

      if (item.title !== undefined) {
        checkoutItem.title = item.title;
      }

      acc.push(checkoutItem);
      return acc;
    }, []);

    // Add shipping fee if needed
    if (shippingMethod === "express") {
      items.push({ title: "Livraison express", price: 9.9, quantity: 1 });
    }

    const { url } = await createCheckoutSession(items);
    if (url) window.location.href = url;
  };

  const computedSubtotal = useMemo(
    () =>
      groups.reduce(
        (sum, { item, quantity }) =>
          sum + (Number(item.price) || 0) * quantity,
        0
      ),
    [groups]
  );
  const hasSyncedTotals = cartTotalsUpdatedAt > 0;
  const subtotal = hasSyncedTotals ? cartSubtotal : computedSubtotal;
  const shippingCost = shippingMethod === "express" ? 9.9 : 0;
  const totalBeforeShipping = hasSyncedTotals ? cartTotal : subtotal;
  const reductionAmount = Math.max(subtotal - totalBeforeShipping, 0);
  const total = totalBeforeShipping + shippingCost;

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Étape 2 : Livraison</h1>
        <p className="mt-1 text-slate-600">Choisissez votre mode de livraison, puis procédez au paiement.</p>

        <div className="mt-8 grid grid-cols-1 gap-6">
          {/* Shipping options */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-900">Mode de livraison</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shipping"
                  className="radio"
                  checked={shippingMethod === "standard"}
                  onChange={() => setShippingMethod("standard")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">Colissimo Standard (2 à 3 jours ouvrés)</span>
                    <span className="text-emerald-600 font-semibold">Offerte</span>
                  </div>
                  <p className="text-sm text-slate-600">Livraison sans frais supplémentaires.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shipping"
                  className="radio"
                  checked={shippingMethod === "express"}
                  onChange={() => setShippingMethod("express")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">Chronopost Express (le lendemain avant 13h)</span>
                    <span className="text-slate-900 font-semibold">9,90 €</span>
                  </div>
                  <p className="text-sm text-slate-600">Livraison rapide avec supplément.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Summary and action */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-900">Récapitulatif</h2>
            <dl className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd>{subtotal.toFixed(2)} €</dd>
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
                    ? `-${reductionAmount.toFixed(2)} €`
                    : "0,00 €"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Livraison</dt>
                <dd>{shippingCost === 0 ? "Offerte" : `${shippingCost.toFixed(2)} €`}</dd>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-semibold text-slate-900">
                <dt>Total</dt>
                <dd>{total.toFixed(2)} €</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between">
              <Link href="/checkout/address" className="text-sm text-slate-600 hover:text-slate-800">Retour aux adresses</Link>
              <button onClick={handleProceedToPayment} className="btn btn-primary">Procéder au paiement</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
