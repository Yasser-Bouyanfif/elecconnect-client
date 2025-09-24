"use client";

import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Mail, PackageCheck } from "lucide-react";
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
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <div className="flex flex-col items-center gap-4 bg-white/80 px-8 py-10 rounded-2xl shadow-lg shadow-emerald-100/40 backdrop-blur-sm">
          <div className="h-14 w-14 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-600">Finalisation de votre commande</p>
          <p className="text-slate-600">Nous confirmons votre paiement et préparons votre espace client…</p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-16">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_55%)]" />
        <div className="relative max-w-xl w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-emerald-100/50 p-10 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
            <PackageCheck className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-semibold text-slate-800">Commande introuvable</h2>
          <p className="text-slate-600">
            Nous n’avons pas pu récupérer les détails de votre commande. Vérifiez votre email de confirmation ou contactez notre équipe pour obtenir de l’aide.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
          >
            Retourner à l’accueil
          </Link>
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
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 py-16 sm:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-xl shadow-emerald-100/60 backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-sky-50 opacity-60" />
            <div className="relative space-y-8">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Commande validée</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                    Merci pour votre confiance, {order.address?.fullName?.split(" ")[0] || user?.firstName || ""} !
                  </h1>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">
                    Votre paiement a été validé et nos équipes préparent déjà votre commande. Vous recevrez toutes les informations de suivi par email très prochainement.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 rounded-2xl border border-emerald-100/70 bg-white/70 p-6 shadow-sm shadow-emerald-100/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">Email de confirmation</p>
                    <p className="text-sm text-slate-600">Envoyé à {user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white">
                  <h2 className="text-lg font-semibold">Prochaines étapes</h2>
                  <ul className="mt-4 space-y-3 text-sm text-emerald-50/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold">1</span>
                      Vérifiez votre boîte mail pour retrouver le récapitulatif complet de votre commande.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold">2</span>
                        Préparez les informations nécessaires à la livraison pour faciliter l’intervention de nos techniciens.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-semibold">3</span>
                        Nous vous contacterons sous 48h ouvrées pour planifier l’installation ou la livraison.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 text-sm text-slate-600">
                Besoin d’aide ? Écrivez-nous à
                {" "}
                <a href="mailto:contact@elecconnect.com" className="font-semibold text-emerald-600 underline-offset-4 hover:underline">
                  contact@elecconnect.com
                </a>
                {" "}
                ou appelez-nous du lundi au vendredi, de 9h à 18h.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-emerald-100/40 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Récapitulatif</p>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">#{order.orderNumber}</span>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Date de commande</span>
                  <span className="font-medium text-slate-900">{orderDate}</span>
                </div>
                {order.orderStatus !== "pending" && (
                  <div className="flex items-center justify-between">
                    <span>Statut</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-600">
                      {order.orderStatus}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-6">
                {order.address && (
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Adresse de livraison</p>
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">{order.address.fullName}</p>
                      {order.address.company && <p>{order.address.company}</p>}
                      <p>{order.address.address1}</p>
                      {order.address.address2 && <p>{order.address.address2}</p>}
                      <p>
                        {order.address.postalCode} {order.address.city}
                      </p>
                      <p>{order.address.country}</p>
                      {order.address.phone && <p className="pt-1 text-xs text-slate-500">Tél. {order.address.phone}</p>}
                    </div>
                  </div>
                )}

                {order.shipping && (
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Livraison</p>
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">{order.shipping.carrier || "Livraison standard"}</p>
                      <p>Frais de port : {order.shipping.price ? `${order.shipping.price.toFixed(2)} €` : "Offerts"}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
                <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                  <span>Total TTC</span>
                  <span>{order.total.toFixed(2)} €</span>
                </div>
                <p className="mt-2 text-xs text-emerald-600">TVA incluse &mdash; Merci de soutenir la mobilité électrique.</p>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-full border border-transparent bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Continuer sur le site
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuccessPage;
