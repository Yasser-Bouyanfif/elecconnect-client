'use client';

import { useEffect, useMemo, useState } from 'react';
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
  Sparkles,
  BarChart3,
  BadgeCheck,
  Timer
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

  const enhancedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  const ordersInsight = useMemo(() => {
    if (enhancedOrders.length === 0) {
      return {
        completed: 0,
        pending: 0,
        totalSpent: 0,
        averageSpent: 0,
        lastOrder: null as Order | null
      };
    }

    const completed = enhancedOrders.filter((order) => order.orderStatus === 'completed').length;
    const pending = enhancedOrders.length - completed;
    const totalSpent = enhancedOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      completed,
      pending,
      totalSpent,
      averageSpent: totalSpent / enhancedOrders.length,
      lastOrder: enhancedOrders[0]
    };
  }, [enhancedOrders]);

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
    <div className="min-h-screen bg-gradient-to-br from-white via-stone-50 to-emerald-50/40">
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-70">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-stone-500 mb-8">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Accueil</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-stone-400" />
          <span className="text-stone-700 font-medium">Mes commandes</span>
        </nav>
        
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-lg shadow-emerald-100/70 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-white to-white/60" />
            <div className="relative p-8 md:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center rounded-full border border-emerald-200/80 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Tableau de bord personnalisé
                  </div>
                  <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
                    Bonjour{user.firstName ? `, ${user.firstName}` : ''}! Suivez vos commandes en un clin d'œil
                  </h1>
                  <p className="mt-3 text-lg text-stone-600 leading-relaxed">
                    Visualisez vos commandes passées et en cours, accédez rapidement au suivi de livraison et découvrez de nouvelles recommandations produits.
                  </p>
                  {ordersInsight.lastOrder && (
                    <div className="mt-6 flex items-center text-sm text-stone-500">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Dernière commande</p>
                        <p className="text-sm font-medium text-stone-800">
                          Passée le {formatDate(ordersInsight.lastOrder.createdAt)} · #{ordersInsight.lastOrder.orderNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-200/50 bg-white/80 p-5 shadow-sm">
                      <div className="flex items-center justify-between text-sm font-medium text-stone-500">
                        <span>Commandes complétées</span>
                        <BadgeCheck className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="mt-2 text-3xl font-bold text-stone-900">{ordersInsight.completed}</p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-emerald-500">Historique confirmé</p>
                    </div>
                    <div className="rounded-2xl border border-amber-200/70 bg-white/80 p-5 shadow-sm">
                      <div className="flex items-center justify-between text-sm font-medium text-stone-500">
                        <span>Commandes en cours</span>
                        <Timer className="h-4 w-4 text-amber-500" />
                      </div>
                      <p className="mt-2 text-3xl font-bold text-stone-900">{ordersInsight.pending}</p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-amber-500">Livraison à suivre</p>
                    </div>
                    <div className="rounded-2xl border border-stone-200/70 bg-white/80 p-5 shadow-sm sm:col-span-2">
                      <div className="flex items-center justify-between text-sm font-medium text-stone-500">
                        <span>Dépenses cumulées</span>
                        <BarChart3 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                        <p className="text-3xl font-bold text-stone-900">
                          {formatPrice(ordersInsight.totalSpent)}
                        </p>
                        <p className="text-sm text-stone-500">
                          En moyenne {formatPrice(ordersInsight.averageSpent || 0)} par commande
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center text-sm text-stone-500">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <p className="ml-3">
                    {enhancedOrders.length > 0
                      ? `${enhancedOrders.length} commande${enhancedOrders.length > 1 ? 's' : ''} enregistrée${enhancedOrders.length > 1 ? 's' : ''}`
                      : 'Aucune commande enregistrée pour le moment'}
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-600 px-5 py-3 text-base font-medium text-white shadow-lg shadow-emerald-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <ShoppingBag className="h-5 w-5 flex-shrink-0" />
                  Découvrir la boutique
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
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
        ) : enhancedOrders.length === 0 ? (
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
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">
                    Vision globale
                  </p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-lg text-stone-600">
                  Continuez de suivre vos équipements et optimisez vos installations énergétiques avec ElecConnect.
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">Support dédié</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <Home className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-lg text-stone-600">
                  Besoin d'aide ? Notre équipe reste disponible pour vous accompagner dans le suivi de vos commandes.
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">
                    Conseils personnalisés
                  </p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-lg text-stone-600">
                  Recevez des recommandations adaptées pour tirer le meilleur parti de votre installation solaire.
                </p>
              </div>
            </motion.div>

            <AnimatePresence>
              <div className="space-y-6">
                {enhancedOrders.map((order, index) => (
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
                              Statut
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
                                  {order.orderStatus === 'completed' ? 'Commande terminée' : 'En cours de traitement'}
                                </p>
                                <p className="text-xs text-stone-500 mt-0.5">
                                  {order.orderStatus === 'completed' 
                                    ? 'Terminé le ' + new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : 'Votre commande est en préparation'}
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
                              Livraison
                            </h3>
                          </div>
                          <div className="pl-11 mt-auto">
                            <div className="space-y-3">
                              <div className="p-3 bg-white border border-stone-200 rounded-lg">
                                <p className="text-xs font-medium text-stone-500 mb-1">Adresse de livraison</p>
                                {order.shippingAddress ? (
                                  <div className="space-y-1">
                                    <p className="text-sm text-stone-800 font-medium">
                                      {order.shippingAddress.fullName}
                                    </p>
                                    <p className="text-sm text-stone-600">
                                      {order.shippingAddress.address1}
                                    </p>
                                    {order.shippingAddress.address2 && (
                                      <p className="text-sm text-stone-600">
                                        {order.shippingAddress.address2}
                                      </p>
                                    )}
                                    <p className="text-sm text-stone-600">
                                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                                    </p>
                                    <p className="text-sm text-stone-600">
                                      {order.shippingAddress.country}
                                    </p>
                                    <p className="text-sm text-stone-600">
                                      {order.shippingAddress.phone}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-stone-500 italic">Aucune adresse de livraison renseignée</p>
                                )}
                              </div>
                              <Link 
                                href={`/orders/${order.id}`}
                                className="group w-full inline-flex items-center justify-between px-4 py-2.5 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors"
                              >
                                <span>Suivre ma commande</span>
                                <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                              </Link>
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
          </>
        )}
      </div>
    </div>
  );
}
