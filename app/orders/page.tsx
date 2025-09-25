'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Package, 
  CheckCircle2, 
  Clock as ClockIcon, 
  Truck, 
  ArrowRight, 
  Loader2,
  ArrowLeft,
  Home,
  ChevronRight,
  Calendar,
  CreditCard,
  PackageCheck,
  RefreshCw
} from 'lucide-react';

type Order = {
  id: number;
  orderNumber: string;
  orderStatus: string;
  subtotal: number;
  total: number;
  createdAt: string;
  shipping?: {
    price: number;
    carrier: string;
  };
  shippingAddress?: {
    id: number;
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    createdAt: string;
  };
};

export default function OrdersPage() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoaded) return;
      
      try {
        const response = await fetch('/api/order');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des commandes');
        }
        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoaded]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
        <p className="mb-4">Veuillez vous connecter pour voir vos commandes.</p>
        <Link href="/sign-in" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-stone-500 mb-8">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Accueil</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-stone-400" />
          <span className="text-stone-700 font-medium">Mes commandes</span>
        </nav>
        
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight bg-clip-text">
                Mes commandes
              </h1>
              <p className="mt-2 text-lg text-stone-600 max-w-2xl">
                Retrouvez l'historique et le suivi de vos commandes passées sur ElecConnect
              </p>
            </div>
            <Link 
              href="/shop" 
              className="group inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <ShoppingBag className="h-5 w-5 mr-2 flex-shrink-0" />
              Découvrir la boutique
            </Link>
          </div>
        </div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-24 bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-100 shadow-sm"
          >
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-5" />
            <p className="text-stone-700 font-medium text-lg">Chargement de vos commandes</p>
            <p className="text-sm text-stone-500 mt-2">Veuillez patienter un instant...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">
                  Oups, une erreur est survenue
                </h3>
                <div className="mt-1 text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-12 border border-stone-100 max-w-2xl mx-auto"
          >
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-50/50 mb-8">
              <Package className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">Aucune commande pour le moment</h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Votre historique de commandes est vide. Découvrez nos produits et trouvez l'équipement qui vous correspond.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <ShoppingBag className="h-5 w-5 mr-2 -ml-1" />
                Explorer la boutique
              </Link>
              <Link
                href="/solar-solution"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-stone-200 text-base font-medium rounded-lg shadow-sm text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <svg className="h-5 w-5 mr-2 -ml-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Solutions solaires
              </Link>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.03,
                    type: "spring",
                    stiffness: 120,
                    damping: 12
                  }}
                  whileHover={{ y: -2 }}
                  className="relative group overflow-hidden rounded-3xl border border-stone-100 bg-white/80 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl transition-colors duration-500 group-hover:bg-emerald-500/20" />
                  <div className="relative p-6 md:p-8">
                    {/* En-tête */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-inner">
                            <Package className="h-5 w-5" />
                          </div>
                          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                            Commande #{order.orderNumber}
                          </h2>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${
                              order.orderStatus === 'completed'
                                ? 'border-emerald-200/70 bg-emerald-50/80 text-emerald-700'
                                : 'border-amber-200/70 bg-amber-50/80 text-amber-700'
                            }`}
                          >
                            {order.orderStatus === 'completed' ? (
                              <CheckCircle2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            ) : (
                              <ClockIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            )}
                            {order.orderStatus === 'completed' ? 'Livrée' : 'En cours'}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-stone-500">
                          <Calendar className="h-4 w-4 mr-1.5 text-stone-400 flex-shrink-0" />
                          <span>Passée le {formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 md:mt-0">
                        <Link 
                          href={`/orders/${order.id}`}
                          className="group inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                          <span className="border-b border-transparent group-hover:border-emerald-700 transition-colors">
                            Voir les détails
                          </span>
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                        </Link>
                      </div>
                    </div>

                    {/* Détails de la commande */}
                    <div className="mt-8 pt-6 border-t border-stone-100">
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Montant total */}
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100/70 bg-white/80 p-5 shadow-sm">
                          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />
                          <div className="mb-4 flex items-center">
                            <div className="mr-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600/80">Montant total</p>
                              <p className="text-sm text-stone-500">Synthèse de votre achat</p>
                            </div>
                          </div>
                          <div className="pl-14">
                            <p className="text-3xl font-bold text-stone-900">
                              {formatPrice(order.total)}
                            </p>
                            {order.shipping && (
                              <p className="mt-2 text-sm text-stone-600">
                                <span className="font-semibold text-stone-700">Frais de port :</span> {formatPrice(order.shipping.price)}
                              </p>
                            )}
                            <p className="mt-1 text-sm text-stone-500">
                              <span className="font-semibold text-stone-600">Méthode :</span> Carte bancaire
                            </p>
                          </div>
                        </div>

                        {/* Statut de livraison */}
                        <div className="relative overflow-hidden rounded-2xl border border-amber-100/70 bg-gradient-to-br from-white via-amber-50/60 to-white p-5 shadow-sm">
                          <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-amber-400/20 blur-3xl" />
                          <div className="relative mb-4 flex items-center">
                            <div className="mr-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                              <Truck className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-600/80">Statut</p>
                              <p className="text-sm text-stone-500">Suivi de la livraison</p>
                            </div>
                          </div>
                          <div className="relative pl-14">
                            <div className="flex items-center">
                              <div
                                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                                  order.orderStatus === 'completed'
                                    ? 'bg-emerald-500/15 text-emerald-600'
                                    : 'bg-amber-500/15 text-amber-600'
                                }`}
                              >
                                {order.orderStatus === 'completed' ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <ClockIcon className="h-4 w-4" />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-base font-semibold text-stone-900">
                                  {order.orderStatus === 'completed' ? 'Commande terminée' : 'En cours de traitement'}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-wide text-stone-500">
                                  {order.orderStatus === 'completed'
                                    ? 'Terminé le ' + new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : 'Votre commande est en préparation'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions rapides */}
                        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-gradient-to-br from-white via-stone-50 to-white p-5 shadow-sm">
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
                          <div className="relative mb-4 flex items-center">
                            <div className="mr-3 flex h-11 w-11 items-center justify-center rounded-xl bg-stone-200/50 text-stone-700">
                              <PackageCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Livraison</p>
                              <p className="text-sm text-stone-500">Informations pratiques</p>
                            </div>
                          </div>
                          <div className="relative mt-auto space-y-4 rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-stone-100/80">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Adresse de livraison</p>
                              {order.shippingAddress ? (
                                <div className="mt-3 space-y-1 text-sm">
                                  <p className="font-semibold text-stone-800">{order.shippingAddress.fullName}</p>
                                  <p className="text-stone-600">{order.shippingAddress.address1}</p>
                                  {order.shippingAddress.address2 && (
                                    <p className="text-stone-600">{order.shippingAddress.address2}</p>
                                  )}
                                  <p className="text-stone-600">
                                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                  </p>
                                  <p className="text-stone-600">{order.shippingAddress.country}</p>
                                  <p className="text-stone-600">{order.shippingAddress.phone}</p>
                                </div>
                              ) : (
                                <p className="mt-3 text-sm italic text-stone-500">Aucune adresse de livraison renseignée</p>
                              )}
                            </div>
                            <Link
                              href={`/orders/${order.id}`}
                              className="group inline-flex w-full items-center justify-between rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-500/20"
                            >
                              <span>Suivre ma commande</span>
                              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="relative h-1.5 overflow-hidden bg-stone-100">
                    <motion.div 
                      className={`h-full ${
                        order.orderStatus === 'completed' 
                          ? 'w-full bg-emerald-500' 
                          : 'w-2/3 bg-amber-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: order.orderStatus === 'completed' ? '100%' : '66%',
                        backgroundColor: order.orderStatus === 'completed' 
                          ? 'rgb(16, 185, 129)' 
                          : 'rgb(251, 191, 36)'
                      }}
                      transition={{ 
                        duration: 0.8, 
                        ease: 'easeOut',
                        backgroundColor: { duration: 0.3 }
                      }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
