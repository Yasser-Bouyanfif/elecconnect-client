"use client";

import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  PackageCheck,
  Truck,
  Wallet,
} from "lucide-react";
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
            stripeSessionId,
            userEmail: user?.emailAddresses?.[0]?.emailAddress
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Commande non trouvée</h2>
          <p className="text-gray-600 mb-6">Nous n&apos;avons pas pu récupérer les détails de votre commande.</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-rose-50 to-white py-16 px-4 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-amber-100 blur-3xl" />
        <div className="absolute -left-10 top-40 h-72 w-72 rounded-full bg-orange-100 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-pink-100/70 blur-[160px]" />
      </div>
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-orange-100/80 bg-white/70 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="absolute -top-24 left-1/2 hidden -translate-x-1/2 sm:block">
            <div className="rounded-full border border-white/70 bg-gradient-to-br from-orange-400 via-amber-300 to-rose-300 p-[1px] shadow-[0_25px_60px_-25px_rgba(217,119,6,0.55)]">
              <div className="flex size-28 items-center justify-center rounded-full bg-white text-orange-500 shadow-xl shadow-orange-200/70">
                <CheckCircle2 className="h-14 w-14" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-t-[2.5rem] bg-gradient-to-br from-orange-200 via-amber-100 to-rose-100 px-8 pb-16 pt-20 text-center text-slate-800 sm:pt-32">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
              Commande validée
            </span>
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Merci pour votre confiance !
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Un email de confirmation a été envoyé à {user?.emailAddresses?.[0]?.emailAddress}. Vous recevrez une notification dès que votre commande sera expédiée.
            </p>
          </div>

          <div className="px-6 pb-12 pt-10 sm:px-10 sm:pb-14 sm:pt-12">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-orange-100/80 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(217,119,6,0.5)]">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Commande #{order.orderNumber}</p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="h-4 w-4" />
                        {orderDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-orange-100/80 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(217,119,6,0.5)]">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Montant total</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-900">{order.total} €</p>
                      <p className="mt-1 text-sm text-slate-500">TVA incluse et frais éventuels déjà calculés.</p>
                    </div>
                  </div>
                </div>

                {order.shipping && (
                  <div className="rounded-3xl border border-orange-100/80 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(217,119,6,0.5)]">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Livraison</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                          {order.shipping.carrier || "Livraison standard"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Frais de port : {order.shipping.price ? `${order.shipping.price} €` : "Offerts"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {order.address && (
                <div className="flex h-full flex-col justify-between gap-6 rounded-[2.25rem] border border-rose-100/80 bg-white/70 p-6 shadow-[0_25px_80px_-55px_rgba(190,18,60,0.35)]">
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-rose-50/60 p-6">
                    <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-1/4 -translate-y-1/4 rounded-full bg-white/40 blur-2xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Adresse de livraison</p>
                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                          <p className="font-semibold text-slate-900">{order.address.fullName}</p>
                          {order.address.company && <p className="text-slate-500">{order.address.company}</p>}
                          <p>{order.address.address1}</p>
                          {order.address.address2 && <p>{order.address.address2}</p>}
                          <p>
                            {order.address.postalCode} {order.address.city}
                          </p>
                          <p>{order.address.country}</p>
                          {order.address.phone && (
                            <p className="pt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                              Tél : <span className="font-medium text-slate-600 normal-case">{order.address.phone}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col items-center gap-6 rounded-[2rem] border border-orange-100/80 bg-orange-50/70 px-6 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                Une question sur votre commande ? Notre équipe est à votre écoute pour vous accompagner dans l&apos;installation et le suivi de votre solution de recharge.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <a
                  href="mailto:contact@elecconnect.com"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-orange-500 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600"
                >
                  <Mail className="h-4 w-4" /> contact@elecconnect.com
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Retour à l&apos;accueil
                  <ArrowRight className="h-4 w-4" />
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
