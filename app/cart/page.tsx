"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import {
  CartContext,
  CartContextType,
  CartItem,
  MAX_PER_PRODUCT,
} from "../contexts/CartContext";
import { SERVER_URL } from "../lib/constants";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

const toCartKey = (item: CartItem) =>
  (item.documentId ?? item.id).toString();

function CartPage() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart } = useContext(
    CartContext
  ) as CartContextType;

  const groups = useMemo(() => {
    const map = new Map<string, { item: CartItem; quantity: number }>();

    cart.forEach((item) => {
      if (!item) {
        return;
      }

      const key = toCartKey(item);
      const entry = map.get(key);
      if (entry) {
        entry.quantity += 1;
      } else {
        map.set(key, { item, quantity: 1 });
      }
    });

    return Array.from(map.values());
  }, [cart]);

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState<
    { code: string; reduction: number } | null
  >(null);
  const [promotionError, setPromotionError] = useState<string | null>(null);
  const [applyingPromotion, setApplyingPromotion] = useState(false);
  const activePromotion = !promotionError ? appliedPromotion : null;
  const hasActivePromotion = Boolean(activePromotion);
  const reductionAmount = hasActivePromotion
    ? Math.max(subtotal - total, 0)
    : 0;

  const calculateTotalWithPromotion = (
    amount: number,
    promotion: { reduction: number } | null
  ) => {
    if (!promotion) {
      return amount;
    }

    const reduction = Number(promotion.reduction);
    if (!Number.isFinite(reduction) || reduction <= 0) {
      return amount;
    }

    const discounted = amount * (1 - reduction / 100);
    return discounted >= 0 ? discounted : 0;
  };

  useEffect(() => {
    const items = groups
      .map(({ item, quantity }) => {
        const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
        if (safeQuantity <= 0) {
          return null;
        }

        const { id } = item;
        if (typeof id !== "string" && typeof id !== "number") {
          return null;
        }

        return {
          id: id.toString(),
          quantity: Math.min(safeQuantity, MAX_PER_PRODUCT),
        };
      })
      .filter(
        (
          entry
        ): entry is { id: string; quantity: number } => entry !== null
      );

    if (items.length === 0) {
      setSubtotal(0);
      return;
    }

    (async () => {
      try {
        setLoadingTotal(true);
        const res = await fetch("/api/cart-total", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        if (!res.ok) {
          console.error("Failed to calculate total", await res.text());
          setSubtotal(0);
          return;
        }

        const data = await res.json();
        const parsedTotal = Number(data.total);
        setSubtotal(Number.isFinite(parsedTotal) ? parsedTotal : 0);
      } catch (err) {
        console.error("Failed to calculate total", err);
        setSubtotal(0);
      } finally {
        setLoadingTotal(false);
      }
    })();
  }, [groups]);

  useEffect(() => {
    setTotal(calculateTotalWithPromotion(subtotal, appliedPromotion));
  }, [appliedPromotion, subtotal]);

  const handleApplyPromotion = async () => {
    const trimmedCode = coupon.trim();
    if (!trimmedCode) {
      setPromotionError("Veuillez entrer un code promotionnel.");
      setAppliedPromotion(null);
      return;
    }

    try {
      setApplyingPromotion(true);
      setPromotionError(null);

      const response = await fetch("/api/promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmedCode }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setPromotionError(
          typeof data?.error === "string"
            ? data.error
            : "Code promotionnel invalide."
        );
        setAppliedPromotion(null);
        return;
      }

      const reduction = Number(data.reduction);
      setAppliedPromotion({
        code: data.code,
        reduction: Number.isFinite(reduction) ? reduction : 0,
      });
    } catch (error) {
      console.error("Failed to apply promotion", error);
      setPromotionError(
        "Une erreur est survenue lors de l'application du code promotionnel."
      );
      setAppliedPromotion(null);
    } finally {
      setApplyingPromotion(false);
    }
  };


  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Mon panier</h1>
            <p className="text-sm text-slate-600">Vérifiez vos articles avant de passer au paiement.</p>
          </div>
          <Link href="/shop" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-4 h-4 mr-1" /> Continuer mes achats
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
            <p className="text-slate-600">Votre panier est vide.</p>
            <Link href="/shop" className="btn btn-success text-white flex items-center gap-2 mt-4">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {groups.map(({ item, quantity }) => {
                    const numericQuantity = Number.isFinite(quantity) ? quantity : 0;
                    const displayQuantity = Math.min(numericQuantity, MAX_PER_PRODUCT);
                    const canIncrease = displayQuantity < MAX_PER_PRODUCT;
                    const unitPrice = Number(item.price) || 0;
                    const lineTotal = (unitPrice * displayQuantity).toFixed(2);

                    return (
                      <li key={toCartKey(item)} className="p-4 sm:p-5 flex items-center gap-4">
                        {item.banner?.url && (
                          <img
                            src={`${SERVER_URL}${item.banner.url}`}
                            alt={item.title}
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-md object-cover bg-gray-50 border"
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-medium text-slate-900 line-clamp-1">{item.title}</h3>
                              {item.price !== undefined && (
                                <p className="mt-0.5 text-xs text-slate-600">{unitPrice.toFixed(2)} €</p>
                              )}
                            </div>
                            <button
                              type="button"
                              aria-label="Supprimer l'article"
                              onClick={() => {
                                // remove all quantities of this item
                                for (let i = 0; i < displayQuantity; i += 1) {
                                  removeFromCart(item.id);
                                }
                              }}
                              className="p-2 rounded-md hover:bg-gray-100 text-slate-500 hover:text-slate-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="inline-flex items-center rounded-md border border-gray-300 bg-white">
                              <button
                                type="button"
                                aria-label="Diminuer la quantité"
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 min-w-[3rem] text-center text-sm">{displayQuantity}</span>
                              <button
                                type="button"
                                aria-label="Augmenter la quantité"
                                onClick={() => {
                                  if (canIncrease) addToCart(item);
                                }}
                                disabled={!canIncrease}
                                className="p-2 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-slate-500">Total</p>
                              <p className="text-base font-semibold text-slate-900">{lineTotal} €</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Récapitulatif */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sticky top-24">
                <h2 className="text-base font-semibold text-slate-900">Récapitulatif</h2>

                <div className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Code promo"
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                        if (promotionError) {
                          setPromotionError(null);
                        }
                      }}
                      className="w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleApplyPromotion}
                    disabled={applyingPromotion}
                  >
                    {applyingPromotion ? "…" : "Appliquer"}
                  </button>
                </div>

                {promotionError && (
                  <p className="mt-2 text-sm text-red-600">{promotionError}</p>
                )}
                {activePromotion && (
                  <p className="mt-2 text-sm text-emerald-600">
                    Code {activePromotion.code} appliqué (-
                    {activePromotion.reduction}%).
                    </p>
                )}

                <dl className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <dt>Sous-total</dt>
                    <dd>{loadingTotal ? "…" : `${subtotal.toFixed(2)} €`}</dd>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <dt>Réduction</dt>
                    <dd
                      className={
                        hasActivePromotion && reductionAmount > 0
                          ? "text-emerald-600 line-through"
                          : "text-slate-400 line-through"
                      }
                    >
                      {loadingTotal
                        ? "…"
                        : hasActivePromotion && reductionAmount > 0
                          ? `-${reductionAmount.toFixed(2)} €`
                          : "0,00 €"}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-semibold text-slate-900">
                    <dt>Total</dt>
                    <dd>{loadingTotal ? "…" : `${total.toFixed(2)} €`}</dd>
                  </div>
                </dl>

                <div className="space-y-3 mt-5">
                  <button
                    onClick={() => router.push("/checkout/address")}
                    disabled={groups.length === 0}
                    className="btn btn-soft btn-primary btn-block btn-lg disabled:opacity-50"
                  >
                    Continuer
                  </button>
                  <Link 
                    href="/shop" 
                    className="btn btn-outline btn-block btn-lg"
                  >
                    Retour à la boutique
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartPage;