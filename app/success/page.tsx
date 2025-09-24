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
  }, [cart, clearCart, user]);
  
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
          <p className="text-gray-600 mb-6">Nous n'avons pas pu récupérer les détails de votre commande.</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Retour à l'accueil
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
    <section className="min-h-screen bg-gradient-to-br from-stone-100 via-white to-rose-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-emerald-200/40 blur-2xl" aria-hidden />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-200/40">
              <svg
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Commande confirmée !
          </h1>
          <p className="mt-3 text-lg text-stone-600 sm:text-xl">
            Merci pour votre confiance. Votre commande est en cours de préparation.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Un email de confirmation a été envoyé à {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-stone-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">Récapitulatif</h2>
                  <p className="mt-1 text-sm text-stone-500">Retrouvez l'essentiel de votre commande.</p>
                </div>
                {order.orderStatus !== 'pending' && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {order.orderStatus}
                  </span>
                )}
              </div>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-100/70 px-5 py-4">
                  <dt className="text-xs uppercase tracking-wide text-stone-500">N° de commande</dt>
                  <dd className="mt-1 font-medium text-stone-900">{order.orderNumber}</dd>
                </div>
                <div className="rounded-2xl bg-stone-100/70 px-5 py-4">
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Date</dt>
                  <dd className="mt-1 font-medium text-stone-900">{orderDate}</dd>
                </div>
              </dl>

              <div className="mt-6 rounded-2xl border border-dashed border-stone-200 px-5 py-6">
                <div className="flex items-center justify-between text-base font-medium text-stone-900">
                  <span>Total TTC</span>
                  <span>{order.total.toFixed(2)} €</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">TVA incluse — payable à la livraison.</p>
              </div>
            </div>

            {order.address && (
              <div className="rounded-3xl border border-stone-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
                <h3 className="text-lg font-medium text-stone-900">Adresse de livraison</h3>
                <div className="mt-4 space-y-1 text-sm text-stone-600">
                  <p className="font-medium text-stone-800">{order.address.fullName}</p>
                  {order.address.company && <p>{order.address.company}</p>}
                  <p>{order.address.address1}</p>
                  {order.address.address2 && <p>{order.address.address2}</p>}
                  <p>{order.address.postalCode} {order.address.city}</p>
                  <p>{order.address.country}</p>
                  {order.address.phone && <p className="pt-2 text-sm text-stone-500">Tél : {order.address.phone}</p>}
                </div>
              </div>
            )}

            {order.shipping && (
              <div className="rounded-3xl border border-stone-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
                <h3 className="text-lg font-medium text-stone-900">Livraison</h3>
                <p className="mt-3 text-sm text-stone-600">
                  {order.shipping.carrier || 'Livraison standard'}
                </p>
                <p className="mt-1 text-sm font-medium text-stone-700">
                  Frais de port : {order.shipping.price ? `${order.shipping.price.toFixed(2)} €` : 'Offerts'}
                </p>
              </div>
            )}
          </div>

          <aside className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-stone-200/70 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm sm:p-8">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Besoin d'aide ?</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Notre équipe est disponible pour répondre à toutes vos questions concernant votre commande ou son suivi.
              </p>
              <a
                href="mailto:contact@elecconnect.com"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                contact@elecconnect.com
              </a>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-stone-400/30 transition hover:-translate-y-0.5 hover:bg-stone-800"
            >
              Retour à l'accueil
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default SuccessPage;
