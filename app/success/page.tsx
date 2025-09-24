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
      <div className="min-h-screen bg-gradient-to-br from-[#fdf8f3] via-[#f6ede4] to-[#fdf8f3] flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-2 border-[#d7b9a5]/40 border-t-[#c38b66] animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef9f5] via-white to-[#f4ebe4] flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-[32px] border border-[#f1dfd3] bg-white/80 p-10 text-center shadow-[0_30px_80px_-60px_rgba(104,72,51,0.65)] backdrop-blur">
          <h2 className="text-2xl font-semibold text-[#6b4a37]">Commande introuvable</h2>
          <p className="mt-3 text-sm text-[#8c6a55]">Nous n&apos;avons pas pu récupérer les détails de votre commande. Réessayez depuis votre espace client ou contactez-nous pour obtenir de l&apos;aide.</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#2f2a28] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2f2a28]/20 transition hover:-translate-y-0.5 hover:bg-[#1f1c1a]"
          >
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fdf8f3] via-[#f7ede4] to-[#f9f1ea] py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#f1e0d5] blur-3xl" />
        <div className="absolute -left-24 bottom-16 h-64 w-64 rounded-full bg-[#f6e9df] blur-3xl" />
        <div className="absolute -right-10 top-1/3 h-80 w-80 rounded-full bg-[#f2dfd2]/70 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-[#f0dfd3]/80 bg-white/70 shadow-[0_40px_120px_-60px_rgba(106,64,35,0.65)] backdrop-blur">
          <div className="absolute -right-10 -top-16 hidden sm:block">
            <div className="rounded-full border border-white/50 bg-gradient-to-br from-[#f1dacc] via-[#f6e7db] to-white p-[1px] shadow-[0_30px_60px_rgba(94,57,31,0.18)]">
              <div className="flex size-32 items-center justify-center rounded-full bg-white text-[#be8256] shadow-[0_15px_40px_-20px_rgba(82,46,22,0.4)]">
                <CheckCircle2 className="h-14 w-14" strokeWidth={1.6} />
              </div>
            </div>
          </div>

          <div className="relative grid gap-12 p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="relative overflow-hidden rounded-[28px] border border-[#f2e1d6]/80 bg-gradient-to-br from-[#f8ede3] via-[#fff8f1] to-white p-10 text-center sm:text-left text-[#6c4c38] shadow-[0_25px_60px_-45px_rgba(104,72,51,0.55)]">
                <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#b6794f]">Commande validée</span>
                <h1 className="mt-6 text-3xl font-semibold leading-tight text-[#3f2d22] sm:text-4xl">Merci pour votre confiance !</h1>
                <p className="mt-4 text-sm text-[#87614a] sm:text-base">
                  Un email de confirmation a été envoyé à {user?.emailAddresses?.[0]?.emailAddress}. Vous serez averti dès que votre commande quittera notre atelier.
                </p>
              </div>

              <div className="rounded-[28px] border border-[#efded2]/70 bg-white/75 p-8 text-[#775640] shadow-[0_20px_50px_-40px_rgba(104,72,51,0.55)]">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f2dfd2]/70 text-[#b6794f]">
                    <PackageCheck className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#b6794f]">Commande #{order.orderNumber}</p>
                    <p className="flex items-center gap-2 text-sm text-[#8c6a55]">
                      <CalendarDays className="h-4 w-4" />
                      {orderDate}
                    </p>
                    <p className="text-sm text-[#9e7b63]">Statut : <span className="font-medium text-[#5c4130]">{order.orderStatus}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-[#f1e0d5] bg-white/70 p-7 text-[#5c4130] shadow-[0_20px_60px_-50px_rgba(94,57,31,0.6)]">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f2dfd2]/70 text-[#b6794f]">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#b6794f]">Montant total</p>
                      <p className="mt-2 text-3xl font-semibold text-[#2c211b]">{order.total} €</p>
                      <p className="mt-2 text-sm text-[#8c6a55]">TVA incluse et frais additionnels déjà pris en compte.</p>
                    </div>
                  </div>
                </div>

                {order.shipping && (
                  <div className="rounded-3xl border border-[#f3e5d9] bg-white/70 p-7 text-[#5c4130] shadow-[0_20px_60px_-50px_rgba(94,57,31,0.6)]">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f2dfd2]/70 text-[#b6794f]">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#b6794f]">Livraison</p>
                        <p className="text-base font-semibold text-[#2c211b]">
                          {order.shipping.carrier || "Livraison standard"}
                        </p>
                        <p className="text-sm text-[#8c6a55]">
                          Frais de port : {order.shipping.price ? `${order.shipping.price} €` : "Offerts"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {order.address && (
                <div className="flex h-full flex-col justify-between gap-6 rounded-[28px] border border-[#efded2] bg-gradient-to-br from-white/80 via-white/70 to-white/60 p-7 text-[#5c4130] shadow-[0_20px_60px_-50px_rgba(94,57,31,0.55)]">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f2dfd2]/70 text-[#b6794f]">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#b6794f]">Adresse de livraison</p>
                      <div className="space-y-1 text-sm text-[#8c6a55]">
                        <p className="font-semibold text-[#2c211b]">{order.address.fullName}</p>
                        {order.address.company && <p>{order.address.company}</p>}
                        <p>{order.address.address1}</p>
                        {order.address.address2 && <p>{order.address.address2}</p>}
                        <p>
                          {order.address.postalCode} {order.address.city}
                        </p>
                        <p>{order.address.country}</p>
                        {order.address.phone && (
                          <p className="pt-2 text-xs uppercase tracking-[0.2em] text-[#b69780]">
                            Tél : <span className="font-medium text-[#5c4130] normal-case">{order.address.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-[#f1e0d5]/80 bg-gradient-to-r from-white/80 via-[#fdf6f1] to-white/80 px-6 py-8 text-center text-[#6c4c38] shadow-inner">
              <p className="mx-auto max-w-2xl text-sm text-[#8c6a55] sm:text-base">
                Une question sur votre commande ? Notre équipe vous accompagne pour la mise en service et le suivi de votre solution de recharge.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:contact@elecconnect.com"
                  className="inline-flex items-center gap-2 rounded-full border border-[#e4cdbf] bg-white/80 px-5 py-2.5 text-sm font-semibold text-[#b6794f] shadow-sm transition hover:-translate-y-0.5 hover:border-[#d7b9a5] hover:text-[#a36a44]"
                >
                  <Mail className="h-4 w-4" /> contact@elecconnect.com
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2f2a28] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2f2a28]/20 transition hover:-translate-y-0.5 hover:bg-[#1f1c1a]"
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
