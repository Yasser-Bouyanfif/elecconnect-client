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
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f9ebe3,_#fdf7f3)]">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-16 w-16 rounded-full border-4 border-emerald-200/60" />
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-500/80 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f9ebe3,_#fdf7f3)] p-6">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-100/60 bg-white/80 p-10 text-center shadow-xl backdrop-blur">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">Commande introuvable</h2>
          <p className="mt-3 text-sm text-slate-500">
            Nous n&apos;avons pas pu récupérer les détails de votre commande. Notre équipe reste disponible pour vous aider à retrouver votre achat.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Retour à l&apos;accueil
            <ArrowRight className="h-4 w-4" />
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
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f8ede7,_#fdfbf9)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-emerald-200/40 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-24 -z-10 hidden h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl sm:block" />
      <div className="pointer-events-none absolute -right-20 bottom-10 -z-10 hidden h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl lg:block" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100/50 bg-white/70 shadow-[0_35px_60px_-15px_rgba(16,24,40,0.08)] backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),transparent_55%)]" />
          <div className="absolute -top-16 left-12 hidden size-28 items-center justify-center rounded-full border border-emerald-200/60 bg-white/80 text-emerald-600 shadow-lg shadow-emerald-200/40 lg:flex">
            <CheckCircle2 className="h-12 w-12" strokeWidth={1.6} />
          </div>

          <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-10 p-8 sm:p-12 lg:p-14">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100/80 bg-emerald-50/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Commande validée
                </div>
                <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                  Merci pour votre confiance !
                </h1>
                <p className="max-w-xl text-sm text-slate-500 sm:text-base">
                  Un email de confirmation a été envoyé à {user?.emailAddresses?.[0]?.emailAddress}. Nous vous préviendrons dès que votre commande sera prête à être expédiée.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100/80 bg-white/80 p-5 shadow-sm shadow-emerald-100/40">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Commande #{order.orderNumber}</p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays className="h-4 w-4" />
                        {orderDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 bg-white/80 p-5 shadow-sm shadow-emerald-100/40">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Montant total</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{order.total} €</p>
                      <p className="mt-1 text-xs text-slate-400">TVA incluse et frais éventuels déjà calculés.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100/80 bg-white/80 p-5 shadow-sm shadow-emerald-100/40">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Confirmation</p>
                      <p className="mt-2 text-sm text-slate-600">Un récapitulatif vous a été envoyé par email.</p>
                    </div>
                  </div>
                </div>

                {order.shipping && (
                  <div className="rounded-2xl border border-emerald-100/80 bg-white/80 p-5 shadow-sm shadow-emerald-100/40">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Livraison</p>
                        <p className="mt-2 text-sm font-medium text-slate-900">
                          {order.shipping.carrier || "Livraison standard"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Frais de port : {order.shipping.price ? `${order.shipping.price} €` : "Offerts"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-emerald-100/80 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/60 p-6 text-sm text-slate-600 shadow-inner">
                <h2 className="text-base font-semibold text-slate-900">Suivi personnalisé</h2>
                <p>
                  Une question sur votre installation ou sur la suite du projet&nbsp;? Nos spécialistes vous répondent dans les meilleurs délais.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="mailto:contact@elecconnect.com"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800"
                  >
                    <Mail className="h-4 w-4" /> contact@elecconnect.com
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Retour à l&apos;accueil
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative flex h-full flex-col gap-8 rounded-[2rem] border border-emerald-100/80 bg-gradient-to-br from-white via-white/80 to-emerald-50/50 p-8 sm:p-12 lg:p-14">
              <div className="absolute inset-x-10 top-10 h-[1px] bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Adresse de livraison</p>
                    {order.address ? (
                      <div className="mt-4 space-y-1 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">{order.address.fullName}</p>
                        {order.address.company && <p className="text-slate-500">{order.address.company}</p>}
                        <p>{order.address.address1}</p>
                        {order.address.address2 && <p>{order.address.address2}</p>}
                        <p>
                          {order.address.postalCode} {order.address.city}
                        </p>
                        <p>{order.address.country}</p>
                        {order.address.phone && (
                          <p className="pt-2 text-xs uppercase tracking-wide text-slate-400">
                            Tél&nbsp;:
                            <span className="pl-1 font-medium text-slate-600 normal-case">{order.address.phone}</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500">
                        Votre adresse sera confirmée avec notre équipe avant l&apos;expédition pour garantir une installation en toute sérénité.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100/70 bg-white/70 p-6 text-sm text-slate-500 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Prochaines étapes</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600">1</span>
                    <p>Validation de votre commande et préparation des équipements.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600">2</span>
                    <p>Prise de contact avec nos techniciens pour convenir d&apos;une date d&apos;installation.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-600">3</span>
                    <p>Accompagnement personnalisé jusqu&apos;à la mise en service de votre borne.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuccessPage;
