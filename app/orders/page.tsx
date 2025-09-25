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
  RefreshCw,
  Info,
  PackageOpen,
  Box,
  Check,
  CircleDashed,
  Wallet,
  ReceiptText
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

const getStatusDetails = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return {
        text: 'En attente de paiement',
        description: 'En attente de confirmation du paiement.',
        color: 'text-yellow-700 bg-yellow-50',
        icon: ClockIcon,
        progress: 20,
        progressColor: 'bg-yellow-400',
        showTracking: false
      };
    case 'paid':
      return {
        text: 'Payée',
        description: 'Paiement confirmé, préparation en cours.',
        color: 'text-blue-700 bg-blue-50',
        icon: CheckCircle2,
        progress: 40,
        progressColor: 'bg-blue-400',
        showTracking: false
      };
    case 'processing':
      return {
        text: 'En préparation',
        description: 'Votre commande est en cours de préparation.',
        color: 'text-indigo-700 bg-indigo-50',
        icon: PackageCheck,
        progress: 60,
        progressColor: 'bg-indigo-400',
        showTracking: false
      };
    case 'shipped':
      return {
        text: 'Expédiée',
        description: 'Votre commande est en cours de livraison.',
        color: 'text-sky-700 bg-sky-50',
        icon: Truck,
        progress: 80,
        progressColor: 'bg-sky-500',
        showTracking: true
      };
    case 'delivered':
      return {
        text: 'Livrée',
        description: 'Votre commande a été livrée avec succès.',
        color: 'text-green-700 bg-green-50',
        icon: Check,
        progress: 100,
        progressColor: 'bg-green-500',
        showTracking: true
      };
    case 'canceled':
      return {
        text: 'Annulée',
        description: 'Cette commande a été annulée.',
        color: 'text-red-700 bg-red-50',
        icon: Info,
        progress: 0,
        progressColor: 'bg-red-400',
        showTracking: false
      };
    case 'refunded':
      return {
        text: 'Remboursée',
        description: 'Cette commande a été remboursée.',
        color: 'text-purple-700 bg-purple-50',
        icon: RefreshCw,
        progress: 100,
        progressColor: 'bg-purple-400',
        showTracking: false
      };
    default:
      return {
        text: 'Statut inconnu',
        description: 'Statut de commande non reconnu.',
        color: 'text-stone-700 bg-stone-50',
        icon: CircleDashed,
        progress: 0,
        progressColor: 'bg-stone-300',
        showTracking: false
      };
  }
};

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

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-stone-500">Chargement...</div>;
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
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-stone-500 mb-8">
          <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center">
            <Home className="h-4 w-4 mr-1" /> Accueil
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-stone-400" />
          <span className="text-stone-700 font-medium">Mes commandes</span>
        </nav>
        
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
                Mes commandes
              </h1>
              <p className="mt-2 text-lg text-stone-600 max-w-2xl">
                Retrouvez l'historique et le suivi de vos commandes passées sur ElecConnect
              </p>
            </div>
            <Link 
              href="/shop" 
              className="group inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
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
            className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-stone-200 shadow-md"
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
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-md"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Info className="h-5 w-5 text-red-500" />
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
            className="text-center bg-white rounded-2xl shadow-md p-12 border border-stone-200 max-w-2xl mx-auto"
          >
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-50/50 mb-8">
              <PackageOpen className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">Aucune commande pour le moment</h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Votre historique de commandes est vide. Découvrez nos produits et trouvez l'équipement qui vous correspond.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2 -ml-1" />
                Explorer la boutique
              </Link>
              <Link
                href="/solar-solution"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-stone-300 text-base font-medium rounded-lg shadow-sm text-stone-700 bg-white hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
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
              {orders.map((order, index) => {
                const statusDetails = getStatusDetails(order.orderStatus);
                const StatusIcon = statusDetails.icon;

                return (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 120,
                      damping: 14
                    }}
                    whileHover={{ y: -4, scale: 1.005, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                    className="group bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden"
                  >
                    <div className="p-6 md:p-8 flex flex-col lg:flex-row md:items-start gap-8">
                      {/* Section 1: Infos principales */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
                            Commande #{order.orderNumber}
                          </h2>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusDetails.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            {statusDetails.text}
                          </span>
                        </div>
                        <p className="flex items-center text-sm text-stone-500 mb-6">
                          <Calendar className="h-4 w-4 mr-1.5 text-stone-400 flex-shrink-0" />
                          Passée le {formatDate(order.createdAt)}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Détails du Paiement */}
                          <div className="bg-stone-50/50 p-5 rounded-xl border border-stone-200">
                            <div className="flex items-center mb-2">
                              <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mr-2">
                                <ReceiptText className="h-4 w-4" />
                              </div>
                              <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                                Paiement
                              </h3>
                            </div>
                            <div className="pl-8 text-sm">
                              <p className="font-medium text-stone-900">{formatPrice(order.total)}</p>
                              <p className="text-stone-500 mt-1">Total payé</p>
                              <p className="text-stone-500 mt-1">via Carte bancaire</p>
                            </div>
                          </div>
                          
                          {/* Détails de la Livraison */}
                          <div className="bg-stone-50/50 p-5 rounded-xl border border-stone-200">
                            <div className="flex items-center mb-2">
                              <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mr-2">
                                <Truck className="h-4 w-4" />
                              </div>
                              <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                                Livraison
                              </h3>
                            </div>
                            <div className="pl-8 text-sm">
                              {order.shipping?.carrier ? (
                                <>
                                  <p className="font-medium text-stone-900">{order.shipping.carrier}</p>
                                  <p className="text-stone-500 mt-1">
                                    Frais de port : {formatPrice(order.shipping.price)}
                                  </p>
                                  {statusDetails.showTracking && (
                                    <button className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center">
                                      Suivre mon colis
                                      <ArrowRight className="h-3 w-3 ml-1" />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <p className="text-stone-500">Aucune information de livraison</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Adresse et Actions */}
                      <div className="w-full lg:w-80">
                        <div className="bg-stone-50/50 p-5 rounded-xl border border-stone-200 h-full flex flex-col">
                          <div className="flex items-center mb-4">
                            <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mr-3">
                              <Box className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
                              Adresse de Livraison
                            </h3>
                          </div>
                          
                          <div className="pl-11 flex-grow">
                            {order.shippingAddress ? (
                              <div className="space-y-1 text-sm text-stone-700">
                                <p className="font-medium">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address1}</p>
                                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                <p>{order.shippingAddress.postalCode} {order.shippingAddress.city}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p className="text-sm text-stone-500 mt-2">{order.shippingAddress.phone}</p>
                              </div>
                            ) : (
                              <p className="text-sm text-stone-500 italic">Aucune adresse de livraison renseignée</p>
                            )}
                          </div>
                          
                          <Link 
                            href={`/orders/${order.id}`}
                            className="mt-6 w-full inline-flex items-center justify-between px-4 py-2.5 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-sm"
                          >
                            <span>Suivre ma commande</span>
                            <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="h-1.5 bg-stone-200 overflow-hidden">
                      <motion.div 
                        className={`h-full ${statusDetails.progressColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${statusDetails.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      ></motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}