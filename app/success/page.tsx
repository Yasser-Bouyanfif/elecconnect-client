"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";
import { CartContext } from "@/app/contexts/CartContext";

type OrderAddress = {
  fullName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
};

type OrderShipping = {
  carrier?: string;
  price?: number;
};

type OrderDetails = {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  orderStatus: string;
  createdAt: string;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  shipping?: OrderShipping;
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get("session_id");
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Cart context is unavailable");
  }

  const {
    cart,
    clearCart,
    shippingMethod,
    shippingAddress,
    billingAddress,
    useSameAddressForBilling,
  } = cartContext;

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasSubmittedRef = useRef(false);

  const resolvedBillingAddress = useSameAddressForBilling
    ? shippingAddress
    : billingAddress;

  useEffect(() => {
    if (!stripeSessionId) {
      router.replace("/cart");
    }
  }, [router, stripeSessionId]);

  useEffect(() => {
    if (!stripeSessionId || !isLoaded) {
      return;
    }

    if (!user) {
      router.replace("/cart");
      return;
    }

    if (hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = true;

    const submitOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (cart.length > 0) {
          const response = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cart: cart.map(({ id, documentId }) => ({ id, documentId })),
              stripeSessionId,
              userEmail: user.emailAddresses?.[0]?.emailAddress,
              shippingMethod,
              shippingAddress,
              billingAddress: resolvedBillingAddress,
            }),
          });

          if (!response.ok && response.status !== 409) {
            const message = await response.text();
            throw new Error(
              message || "Impossible de créer la commande."
            );
          }
        }

        const detailsResponse = await fetch("/api/order/by-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripeSessionId }),
        });

        if (!detailsResponse.ok) {
          const message = await detailsResponse.text();
          throw new Error(
            message || "Impossible de récupérer la commande."
          );
        }

        const data = await detailsResponse.json();
        setOrder(data.order ?? null);
        clearCart();
      } catch (err) {
        console.error("Failed to finalise order", err);
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors de la finalisation de la commande."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void submitOrder();
  }, [
    billingAddress,
    cart,
    clearCart,
    isLoaded,
    resolvedBillingAddress,
    router,
    shippingAddress,
    shippingMethod,
    stripeSessionId,
    user,
  ]);

  const orderDate = useMemo(() => {
    if (!order) {
      return "";
    }

    try {
      return new Date(order.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {error ? "Commande indisponible" : "Commande non trouvée"}
          </h2>
          <p className="mb-6 text-gray-600">
            {error ?? "Nous n'avons pas pu récupérer les détails de votre commande."}
          </p>
          <Link
            href="/"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-12 px-4 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Commande confirmée
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100">
            Un email de confirmation a été envoyé à {user.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5 sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Récapitulatif de la commande
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                N° de commande : <span className="font-medium">{order.orderNumber}</span>
              </p>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Paiement confirmé
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 px-6 py-5">
            <h3 className="mb-4 text-base font-medium text-gray-900">
              Détails de la commande
            </h3>

            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-md bg-emerald-100 p-3">
                  <PackageCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    Préparation en cours
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Votre commande est en cours de préparation. Vous recevrez une notification lorsqu&apos;elle sera expédiée.
                  </p>
                  {orderDate && (
                    <p className="mt-2 text-xs text-gray-500">Date de commande : {orderDate}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Adresse de livraison
                  </h4>
                  <div className="h-full rounded-lg bg-gray-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Truck className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3 space-y-1 text-sm text-gray-500">
                        <p className="font-medium text-gray-900">
                          {order.shippingAddress?.fullName}
                        </p>
                        {order.shippingAddress?.company && (
                          <p>{order.shippingAddress.company}</p>
                        )}
                        <p>{order.shippingAddress?.address1}</p>
                        {order.shippingAddress?.address2 && (
                          <p>{order.shippingAddress.address2}</p>
                        )}
                        <p>
                          {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                        </p>
                        <p>{order.shippingAddress?.country}</p>
                        {order.shippingAddress?.phone && (
                          <p className="mt-2">Tél : {order.shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Adresse de facturation
                  </h4>
                  <div className="h-full rounded-lg bg-gray-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3 space-y-1 text-sm text-gray-500">
                        <p className="font-medium text-gray-900">
                          {order.billingAddress?.fullName}
                        </p>
                        {order.billingAddress?.company && (
                          <p>{order.billingAddress.company}</p>
                        )}
                        <p>{order.billingAddress?.address1}</p>
                        {order.billingAddress?.address2 && (
                          <p>{order.billingAddress.address2}</p>
                        )}
                        <p>
                          {order.billingAddress?.postalCode} {order.billingAddress?.city}
                        </p>
                        <p>{order.billingAddress?.country}</p>
                        {order.billingAddress?.phone && (
                          <p className="mt-2">Tél : {order.billingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {order.shipping && (
                <div className="mt-8">
                  <h4 className="mb-3 text-sm font-medium text-gray-900">
                    Méthode de livraison
                  </h4>
                  <div className="w-full rounded-lg bg-gray-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <PackageCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3 text-sm text-gray-500">
                        <p className="font-medium text-gray-900">
                          {order.shipping.carrier || "Livraison standard"}
                        </p>
                        <p className="mt-1">
                          Frais de port :
                          {" "}
                          {order.shipping.price
                            ? `${order.shipping.price.toFixed(2)} €`
                            : "Offerts"}
                        </p>
                        <p className="mt-2 text-xs">
                          Délai de livraison estimé : 2-5 jours ouvrés
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-gray-200 px-6 py-5">
            <h3 className="mb-4 text-base font-medium text-gray-900">Récapitulatif</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="font-medium text-gray-900">
                  {(order.total - (order.shipping?.price ?? 0)).toFixed(2)} €
                </span>
              </div>
              {order.shipping?.price && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Frais de livraison</span>
                  <span className="font-medium text-gray-900">
                    {order.shipping.price.toFixed(2)} €
                  </span>
                </div>
              )}
              <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-base font-medium text-gray-900">
                <span>Total TTC</span>
                <span>{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-5 text-center sm:px-6">
            <p className="mb-4 text-sm text-gray-500">
              Un problème avec votre commande ?
              <Link
                href="/#contact"
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                {" "}Contactez-nous
                <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
