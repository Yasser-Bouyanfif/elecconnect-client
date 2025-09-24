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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d97f64]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fdf7f2] via-[#f7e9de] to-[#f0d7c1] p-8 text-center">
        <div className="max-w-2xl w-full rounded-3xl border border-[#f1d8c6]/70 bg-white/80 p-10 shadow-xl backdrop-blur">
          <h2 className="text-2xl font-semibold text-[#3e241b] mb-4">Commande non trouvée</h2>
          <p className="text-[#6d4a3b] mb-6">Nous n&apos;avons pas pu récupérer les détails de votre commande.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#3e241b] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2e1c16]/20 transition hover:-translate-y-0.5 hover:bg-[#2e1c16]"
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fdf7f2] via-[#f7e9de] to-[#f0d7c1] py-16 px-4 sm:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-[#fbe9dd] blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -right-20 size-[360px] rounded-full bg-[#f6d7c3] blur-3xl opacity-70" />
        <div className="absolute -bottom-32 -left-10 size-[260px] rounded-full bg-[#f8eadb] blur-3xl opacity-70" />
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-[32px] border border-[#f1d8c6]/70 bg-white/75 shadow-[0_35px_120px_-45px_rgba(89,64,47,0.45)] backdrop-blur">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2">
            <div className="rounded-full border border-white/70 bg-gradient-to-br from-[#f6c19a] via-[#f3b18d] to-[#e69d7d] p-[1px] shadow-2xl">
              <div className="flex size-28 items-center justify-center rounded-full bg-white text-[#d97f64] shadow-lg shadow-[#f0c9b6]/80">
                <CheckCircle2 className="h-14 w-14" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-t-[32px] bg-gradient-to-br from-[#e8bca7] via-[#e5b19b] to-[#dca086] px-8 pb-16 pt-32 text-center text-[#2e1c16]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#856050]">
              Commande validée
            </span>
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-[#2e1c16] sm:text-4xl">
              Merci pour votre confiance !
            </h1>
            <p className="mt-4 text-base text-[#4b2e25] sm:text-lg">
              Un email de confirmation a été envoyé à {user?.emailAddresses?.[0]?.emailAddress}. Vous recevrez une notification dès que votre commande sera expédiée.
            </p>
          </div>

          <div className="px-6 pb-12 pt-10 sm:px-10 sm:pb-14 sm:pt-12">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#f3d8c4]/80 bg-white/80 p-6 shadow-sm shadow-[#f5e0d1]/60">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f1c8a8]/25 text-[#d57d60]">
                      <PackageCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a57360]">Commande #{order.orderNumber}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-[#5f3f33]">
                        <CalendarDays className="h-4 w-4" />
                        {orderDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#f3d8c4]/80 bg-white/80 p-6 shadow-sm shadow-[#f5e0d1]/60">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f1c8a8]/25 text-[#d57d60]">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a57360]">Montant total</p>
                      <p className="mt-2 text-2xl font-semibold text-[#3e241b]">{order.total} €</p>
                      <p className="mt-1 text-sm text-[#6d4a3b]">TVA incluse et frais éventuels déjà calculés.</p>
                    </div>
                  </div>
                </div>

                {order.shipping && (
                  <div className="rounded-2xl border border-[#f3d8c4]/80 bg-white/80 p-6 shadow-sm shadow-[#f5e0d1]/60">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f1c8a8]/25 text-[#d57d60]">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a57360]">Livraison</p>
                        <p className="mt-2 text-base font-semibold text-[#3e241b]">
                          {order.shipping.carrier || "Livraison standard"}
                        </p>
                        <p className="mt-1 text-sm text-[#6d4a3b]">
                          Frais de port : {order.shipping.price ? `${order.shipping.price} €` : "Offerts"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {order.address && (
                <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-[#f3d8c4] bg-white/90 p-6 shadow-lg shadow-[#f5ded0]/80">
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f1c8a8]/25 text-[#d57d60]">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a57360]">Adresse de livraison</p>
                        <div className="mt-3 space-y-1 text-sm text-[#6d4a3b]">
                          <p className="font-semibold text-[#3e241b]">{order.address.fullName}</p>
                          {order.address.company && <p className="text-[#8a5c49]">{order.address.company}</p>}
                          <p>{order.address.address1}</p>
                          {order.address.address2 && <p>{order.address.address2}</p>}
                          <p>
                            {order.address.postalCode} {order.address.city}
                          </p>
                          <p>{order.address.country}</p>
                          {order.address.phone && (
                            <p className="pt-2 text-[0.65rem] uppercase tracking-[0.3em] text-[#b1836e]">
                              Tél : <span className="font-medium text-[#5f3f33] normal-case">{order.address.phone}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-[#f0d1bd]/80 bg-[#f9eee6]/80 px-6 py-8 text-center shadow-inner shadow-[#f7e1d3]/70">
              <p className="max-w-2xl text-sm text-[#6d4a3b] sm:text-base">
                Une question sur votre commande ? Notre équipe est à votre écoute pour vous accompagner dans l&apos;installation et le suivi de votre solution de recharge.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <a
                  href="mailto:contact@elecconnect.com"
                  className="inline-flex items-center gap-2 rounded-full border border-[#f0d1bd] bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#8c5a47] shadow-sm transition hover:-translate-y-0.5 hover:border-[#ecbea3] hover:text-[#6f4233]"
                >
                  <Mail className="h-4 w-4" /> contact@elecconnect.com
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-[#3e241b] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2e1c16]/20 transition hover:-translate-y-0.5 hover:bg-[#2e1c16]"
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
