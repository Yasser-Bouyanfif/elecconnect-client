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
    <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* En-tête */}
          <div className="bg-green-50 px-6 py-8 text-center border-b border-green-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Commande confirmée !</h1>
            <p className="text-green-600 text-lg mb-2">Merci pour votre commande !</p>
            <p className="text-gray-600">Un email de confirmation vous a été envoyé à {user?.emailAddresses?.[0]?.emailAddress}</p>
          </div>

          {/* Détails de la commande */}
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Récapitulatif de la commande</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">N° de commande</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date</span>
                  <span>{orderDate}</span>
                </div>
                {order.orderStatus !== 'pending' && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Statut</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.orderStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Adresse de livraison */}
            {order.address && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Adresse de livraison</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{order.address.fullName}</p>
                  {order.address.company && <p>{order.address.company}</p>}
                  <p>{order.address.address1}</p>
                  {order.address.address2 && <p>{order.address.address2}</p>}
                  <p>{order.address.postalCode} {order.address.city}</p>
                  <p>{order.address.country}</p>
                  {order.address.phone && <p className="mt-2">Tél: {order.address.phone}</p>}
                </div>
              </div>
            )}

            {/* Livraison */}
            {order.shipping && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Livraison</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{order.shipping.carrier || 'Livraison standard'}</p>
                  <p>Frais de port: {order.shipping.price ? `${order.shipping.price.toFixed(2)} €` : 'Offerts'}</p>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between text-lg font-medium text-gray-900 mb-4">
                <span>Total</span>
                <span>{order.total.toFixed(2)} €</span>
              </div>
              <p className="text-sm text-gray-500">TVA incluse</p>
            </div>
          </div>

          {/* Pied de page */}
          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Vous avez des questions concernant votre commande ?<br />
              Contactez-nous à <a href="mailto:contact@elecconnect.com" className="text-blue-600 hover:underline">contact@elecconnect.com</a>
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuccessPage;
