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
        console.log(data.data)
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
                  className="group bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md border border-stone-100 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    {/* En-tête */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold text-stone-900">
                            Commande #{order.orderNumber}
                          </h2>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.orderStatus === 'completed' 
                              ? 'bg-green-50 text-green-700 border border-green-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
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
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Montant total */}
                        <div className="bg-stone-50/70 p-5 rounded-xl border border-stone-100">
                          <div className="flex items-center mb-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mr-3">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-medium text-stone-700 uppercase tracking-wider">
                              Montant total
                            </h3>
                          </div>
                          <div className="pl-11">
                            <p className="text-2xl font-bold text-stone-900">
                              {formatPrice(order.total)}
                            </p>
                            {order.shipping && (
                              <p className="mt-1.5 text-sm text-stone-500">
                                <span className="font-medium">Frais de port :</span> {formatPrice(order.shipping.price)}
                              </p>
                            )}
                            <p className="mt-1 text-sm text-stone-500">
                              <span className="font-medium">Méthode :</span> Carte bancaire
                            </p>
                          </div>
                        </div>
                        
                        {/* Statut de livraison */}
                        <div className="bg-stone-50/50 p-5 rounded-xl border border-stone-100">
                          <div className="flex items-center mb-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mr-3">
                              <Truck className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-medium text-stone-700 uppercase tracking-wider">
                              Livraison
                            </h3>
                          </div>
                          <div className="pl-11">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                order.orderStatus === 'completed' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-amber-100 text-amber-600'
                              }`}>
                                {order.orderStatus === 'completed' ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <ClockIcon className="h-4 w-4" />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-stone-900">
                                  {order.orderStatus === 'completed' ? 'Livraison effectuée' : 'En cours de préparation'}
                                </p>
                                <p className="text-xs text-stone-500 mt-0.5">
                                  {order.orderStatus === 'completed' 
                                    ? 'Livré le ' + new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : 'En attente de préparation'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions rapides */}
                        <div className="bg-stone-50/30 p-5 rounded-xl border border-stone-100 flex flex-col">
                          <div className="flex items-center mb-3">
                            <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mr-3">
                              <PackageCheck className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-medium text-stone-700 uppercase tracking-wider">
                              Actions
                            </h3>
                          </div>
                          <div className="pl-11 mt-auto">
                            <div className="space-y-3">
                              <Link 
                                href={`/orders/${order.id}`}
                                className="group w-full inline-flex items-center justify-between px-4 py-2.5 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors"
                              >
                                <span>Voir les détails</span>
                                <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                              </Link>
                              <button
                                disabled={order.orderStatus === 'completed'}
                                className={`w-full inline-flex items-center justify-between px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                                  order.orderStatus === 'completed'
                                    ? 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'
                                    : 'border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                <span>Suivre mon colis</span>
                                <Truck className={`h-4 w-4 ${
                                  order.orderStatus === 'completed' ? 'text-stone-300' : 'text-emerald-500'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="h-1.5 bg-stone-100 overflow-hidden">
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
