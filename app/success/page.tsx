"use client";

import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartContext, CartContextType } from "../contexts/CartContext";

interface Address {
  fullName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
}

interface Shipping {
  carrier?: string;
  price?: number;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  orderStatus: string;
  createdAt: string;
  address?: Address;
  shipping?: Shipping;
}

function SuccessPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);


  useEffect(() => {
    const stripeSessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!stripeSessionId) {
      router.push("/cart");
      return;
    }

    const createOrder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: cart.map(({ id, documentId }) => ({ id, documentId })),
            stripeSessionId
          }),
        });

        if (!response.ok) {
          console.error("Failed to create order", await response.text());
          router.push("/cart");
          return;
        }

        const response2 = await fetch('/api/order/by-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stripeSessionId }),
        });
        
        if (response2.ok) {
          const data = await response2.json();
          setOrder(data.order);
        }

        clearCart();
      } catch (error) {
        console.error("Failed to create order", error);
        router.push("/cart");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && cart.length > 0) {
      createOrder();
    }
  }, [cart, clearCart, router, user]);
  
  useEffect(() => {
    console.log(order);
  }, [order]);

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-white px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] h-64 w-64 rounded-full bg-emerald-100 opacity-40 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-5%] h-72 w-72 rounded-full bg-emerald-200 opacity-20 blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-emerald-200" />
            <div className="absolute inset-0 m-auto h-16 w-16 animate-spin rounded-full border-t-4 border-emerald-500" />
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-emerald-600">Validation en cours</p>
          <p className="max-w-sm text-center text-slate-600">
            Nous confirmons votre commande et préparons le récapitulatif personnalisé.
          </p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-white px-4 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-12%] left-[10%] h-64 w-64 rounded-full bg-emerald-100 opacity-40 blur-3xl" />
          <div className="absolute bottom-[-18%] right-[6%] h-72 w-72 rounded-full bg-emerald-200 opacity-20 blur-3xl" />
        </div>
        <div className="relative max-w-xl w-full bg-white/80 backdrop-blur border border-emerald-100 shadow-xl rounded-3xl p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-9-9"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 01-9 9 8.96 8.96 0 01-4.803-1.4L3 21l1.4-4.197A8.96 8.96 0 013.002 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Commande introuvable</h2>
          <p className="mt-3 text-slate-600">
            Nous n’avons pas pu récupérer les détails de votre commande. Vous pouvez réessayer ou revenir à l’accueil.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Retour à l’accueil
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Voir mon panier
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-white px-4 py-16 sm:px-6 lg:px-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-12%] right-[-10%] h-80 w-80 rounded-full bg-emerald-100 opacity-40 blur-3xl" />
        <div className="absolute bottom-[-25%] left-[-8%] h-96 w-96 rounded-full bg-emerald-200 opacity-25 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 shadow-[0_25px_60px_-30px_rgba(16,185,129,0.45)] backdrop-blur">
          <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 px-8 py-12 text-center text-white">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-10 w-10"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.55em] text-emerald-100">Merci pour votre confiance</p>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Commande confirmée</h1>
            <p className="mt-4 text-base text-emerald-50 sm:text-lg">
              Un email détaillé a été envoyé à {user?.emailAddresses?.[0]?.emailAddress}. Nous préparons votre solution de recharge avec soin.
            </p>
          </div>

          <div className="grid gap-8 px-6 py-10 sm:px-10">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Commande</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{order.orderNumber}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Date</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{orderDate}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Total TTC</p>
                <p className="mt-3 text-2xl font-bold text-emerald-600">{order.total.toFixed(2)} €</p>
              </div>
            </div>

            {order.orderStatus !== "pending" && (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Statut de la commande</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-700">{order.orderStatus}</p>
                </div>
                <span className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1 text-sm font-medium text-emerald-600 shadow-sm">
                  Mise à jour en temps réel
                </span>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              {order.address && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Livraison</p>
                      <h2 className="text-lg font-semibold text-slate-900">Adresse de destination</h2>
                    </div>
                  </div>
                  <div className="mt-5 space-y-1 text-slate-600">
                    <p className="font-semibold text-slate-900">{order.address.fullName}</p>
                    {order.address.company && <p>{order.address.company}</p>}
                    <p>{order.address.address1}</p>
                    {order.address.address2 && <p>{order.address.address2}</p>}
                    <p>
                      {order.address.postalCode} {order.address.city}
                    </p>
                    <p>{order.address.country}</p>
                    {order.address.phone && (
                      <p className="pt-2 text-sm font-medium text-slate-500">Tél : {order.address.phone}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {order.shipping && (
                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.5V5.25A2.25 2.25 0 015.25 3h9A2.25 2.25 0 0116.5 5.25V13.5M3 13.5h13.5M3 13.5l-1.286 3.858A1.125 1.125 0 002.78 18.75h1.72M16.5 13.5l1.795-4.188a1.125 1.125 0 011.037-.687H21a.75.75 0 01.75.75v4.875a2.25 2.25 0 01-2.25 2.25h-.428M16.5 13.5V18m0 0a3 3 0 01-6 0"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Expédition</p>
                        <h2 className="text-lg font-semibold text-slate-900">{order.shipping.carrier || "Livraison standard"}</h2>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">
                      Frais de port : {order.shipping.price ? `${order.shipping.price.toFixed(2)} €` : "Offerts"}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-slate-700">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Prochaines étapes</p>
                  <p className="mt-3 text-sm leading-relaxed">
                    Vous recevrez un suivi personnalisé de notre équipe dans les prochaines 24 heures pour planifier l’installation ou l’expédition de votre matériel.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                Besoin d’aide ? Contactez-nous à
                {" "}
                <a
                  href="mailto:contact@elecconnect.com"
                  className="font-semibold text-emerald-600 underline-offset-4 transition hover:text-emerald-700 hover:underline"
                >
                  contact@elecconnect.com
                </a>
                .
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/orders"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Suivre ma commande
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuccessPage;
