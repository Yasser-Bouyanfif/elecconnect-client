"use client";

import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Truck,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-emerald-50/30">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-14 w-14 rounded-full border-4 border-emerald-500/40 border-t-emerald-500 animate-spin" />
          <div>
            <p className="text-lg font-semibold text-slate-800">Validation de votre commande…</p>
            <p className="text-sm text-slate-500">Merci de patienter pendant que nous finalisons les détails.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 px-4 py-16">
        <div className="max-w-xl w-full bg-white/90 backdrop-blur rounded-3xl border border-slate-200 shadow-xl p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <Receipt className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Commande introuvable</h2>
          <p className="mt-3 text-base text-slate-600">
            Nous n’avons pas pu récupérer les détails de votre commande. Notre équipe est à votre écoute pour vous aider.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              <Home className="h-4 w-4" />
              Retour à l’accueil
            </Link>
            <a
              href="mailto:contact@elecconnect.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-slate-700 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/60"
            >
              <Mail className="h-4 w-4" />
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-emerald-50/20 px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 shadow-inner shadow-emerald-200">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Merci pour votre confiance !
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Votre commande est confirmée. Un récapitulatif vient d’être envoyé à <span className="font-semibold text-slate-800">{user?.emailAddresses?.[0]?.emailAddress}</span>.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-emerald-100/60 bg-white shadow-xl shadow-emerald-600/5">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-8 text-white sm:px-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-emerald-100/90">Commande #{order.orderNumber}</p>
                  <h2 className="mt-2 text-3xl font-semibold">Confirmation enregistrée</h2>
                  <p className="mt-2 text-emerald-100">
                    Passée le {orderDate}
                  </p>
                </div>
                {order.orderStatus !== "pending" && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" aria-hidden />
                    {order.orderStatus}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-10 px-6 py-8 sm:px-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                  <div className="mb-4 flex items-center gap-3 text-slate-700">
                    <Receipt className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Informations commande</span>
                  </div>
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <dt>Numéro</dt>
                      <dd className="font-medium text-slate-900">{order.orderNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Date</dt>
                      <dd>{orderDate}</dd>
                    </div>
                    {order.orderStatus !== "pending" && (
                      <div className="flex justify-between">
                        <dt>Statut</dt>
                        <dd className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                          {order.orderStatus}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {order.shipping && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
                    <div className="mb-4 flex items-center gap-3 text-slate-700">
                      <Truck className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-semibold uppercase tracking-wide">Livraison</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Transporteur : <span className="font-medium text-slate-900">{order.shipping.carrier || "Livraison standard"}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Frais de port : <span className="font-medium text-slate-900">{order.shipping.price ? `${order.shipping.price.toFixed(2)} €` : "Offerts"}</span>
                    </p>
                  </div>
                )}
              </div>

              {order.address && (
                <div className="rounded-2xl border border-slate-100 bg-white/70 p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Adresse de livraison</h3>
                      <p className="text-sm text-slate-500">Nous préparerons votre colis avec soin.</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="font-medium text-slate-900">{order.address.fullName}</p>
                    {order.address.company && <p>{order.address.company}</p>}
                    <p>{order.address.address1}</p>
                    {order.address.address2 && <p>{order.address.address2}</p>}
                    <p>
                      {order.address.postalCode} {order.address.city}
                    </p>
                    <p>{order.address.country}</p>
                    {order.address.phone && (
                      <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Phone className="h-4 w-4 text-emerald-500" />
                        {order.address.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-slate-100 bg-white/70 p-6">
                <h3 className="text-base font-semibold text-slate-900">Total de la commande</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-medium text-slate-900">{order.subtotal.toFixed(2)} €</span>
                  </div>
                  {order.shipping?.price ? (
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span className="font-medium text-slate-900">{order.shipping.price.toFixed(2)} €</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span className="font-medium text-emerald-600">Offerte</span>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-dashed border-slate-200 pt-5">
                  <span className="text-lg font-semibold text-slate-900">Total TTC</span>
                  <span className="text-2xl font-bold text-emerald-600">{order.total.toFixed(2)} €</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">TVA incluse</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-lg shadow-emerald-600/5 backdrop-blur">
              <h3 className="text-xl font-semibold text-slate-900">Prochaines étapes</h3>
              <p className="mt-2 text-sm text-slate-600">
                Nous préparons votre commande. Vous recevrez un email dès qu’elle sera expédiée.
              </p>
              <ul className="mt-6 space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">Confirmation reçue</p>
                    <p>Votre commande est bien enregistrée dans notre système.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Truck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">Préparation & expédition</p>
                    <p>Nous vous notifierons dès que le colis est remis au transporteur.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Home className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">Livraison</p>
                    <p>La réception est prévue sous 3 à 5 jours ouvrés après expédition.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 text-center shadow-inner">
                <h4 className="text-lg font-semibold text-emerald-800">Besoin d’aide ?</h4>
              <p className="mt-2 text-sm text-emerald-700">
                Notre équipe est disponible pour répondre à toutes vos questions sur votre commande.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="mailto:contact@elecconnect.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Mail className="h-4 w-4" />
                  contact@elecconnect.com
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <ArrowRight className="h-4 w-4" />
                  Retourner à l’accueil
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default SuccessPage;
