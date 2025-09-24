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
    <section className="relative min-h-screen bg-[radial-gradient(circle_at_top,_#dcfce7,_#f8fafc)] py-16 px-4 sm:px-8">
      <div className="absolute inset-x-0 top-10 -z-10 h-[420px] bg-gradient-to-b from-emerald-200/60 via-white to-transparent blur-3xl" />
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100/70 bg-white/80 shadow-2xl shadow-emerald-200/40 backdrop-blur">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2">
            <div className="rounded-full border border-white/60 bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 p-[1px] shadow-2xl">
              <div className="flex size-28 items-center justify-center rounded-full bg-white text-emerald-600 shadow-lg shadow-emerald-200/60">
                <CheckCircle2 className="h-14 w-14" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-t-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 px-8 pb-16 pt-32 text-center text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
              Commande validée
            </span>
            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
              Merci pour votre confiance !
            </h1>
            <p className="mt-4 text-base text-emerald-50/90 sm:text-lg">
              Un email de confirmation a été envoyé à {user?.emailAddresses?.[0]?.emailAddress}. Vous recevrez une notification dès que votre commande sera expédiée.
            </p>
          </div>

          <div className="px-6 pb-12 pt-10 sm:px-10 sm:pb-14 sm:pt-12">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-100/80 bg-white/80 p-6 shadow-sm shadow-emerald-100/40">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Commande #{order.orderNumber}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="h-4 w-4" />
                        {orderDate}
                      </p>
                      {order.orderStatus !== 'pending' && (
                        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
                          {order.orderStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 bg-white/80 p-6 shadow-sm shadow-emerald-100/40">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Montant total</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{order.total.toFixed(2)} €</p>
                      <p className="mt-1 text-sm text-slate-500">TVA incluse et frais éventuels déjà calculés.</p>
                    </div>
                  </div>
                </div>

                {order.shipping && (
                  <div className="rounded-2xl border border-emerald-100/80 bg-white/80 p-6 shadow-sm shadow-emerald-100/40">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Livraison</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">
                          {order.shipping.carrier || "Livraison standard"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Frais de port : {order.shipping.price ? `${order.shipping.price.toFixed(2)} €` : "Offerts"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {order.address && (
                <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-lg shadow-emerald-100/30">
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Adresse de livraison</p>
                        <div className="mt-3 space-y-1 text-sm text-slate-600">
                          <p className="font-semibold text-slate-900">{order.address.fullName}</p>
                          {order.address.company && <p className="text-slate-500">{order.address.company}</p>}
                          <p>{order.address.address1}</p>
                          {order.address.address2 && <p>{order.address.address2}</p>}
                          <p>
                            {order.address.postalCode} {order.address.city}
                          </p>
                          <p>{order.address.country}</p>
                          {order.address.phone && (
                            <p className="pt-2 text-xs uppercase tracking-wide text-slate-400">Tél : <span className="font-medium text-slate-600 normal-case">{order.address.phone}</span></p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-emerald-100/70 bg-emerald-50/60 px-6 py-8 text-center shadow-inner">
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                Une question sur votre commande ? Notre équipe est à votre écoute pour vous accompagner dans l&apos;installation et le suivi de votre solution de recharge.
            </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <a
                  href="mailto:contact@elecconnect.com"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800"
                >
                  <Mail className="h-4 w-4" /> contact@elecconnect.com
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
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
