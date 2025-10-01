'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  CheckCircle2,
  Truck,
  Loader2,
  Home,
  ChevronRight,
  Calendar,
  RefreshCw,
  Info,
  PackageOpen,
  Box,
  CircleDashed,
  Wallet,
  ReceiptText
} from 'lucide-react';

interface Address {
  fullName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

interface OrderLine {
  id: number;
  quantity: number;
  unitPrice: number;
  productTitle: string;
  productPrice: number;
}

type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'refunded';

type Order = {
  id: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  subtotal: number;
  total: number;
  createdAt: string;
  shipping?: {
    price: number;
    carrier?: string;
  };
  shippingAddress?: Address;
  billingAddress?: Address;
  lines: OrderLine[];
};

type ApiAddress = {
  fullName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
};

type ApiShipping = {
  carrier?: string | null;
  price?: number | string | null;
};

type ApiOrderLine = {
  id?: number;
  quantity?: number | null;
  unitPrice?: number | string | null;
  product?: {
    title?: string | null;
    price?: number | string | null;
  } | null;
};

type ApiOrder = {
  id?: number | string;
  orderNumber?: string | null;
  orderStatus?: string | null;
  subtotal?: number | string | null;
  total?: number | string | null;
  createdAt?: string | null;
  shipping?: ApiShipping | null;
  shippingAddress?: ApiAddress | null;
  billingAddress?: ApiAddress | null;
  order_lines?: ApiOrderLine[] | null;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const mapAddress = (address?: ApiAddress | null): Address | undefined => {
  if (!address) {
    return undefined;
  }

  const fields: Address = {
    fullName: address.fullName ?? undefined,
    company: address.company ?? undefined,
    address1: address.address1 ?? undefined,
    address2: address.address2 ?? undefined,
    city: address.city ?? undefined,
    postalCode: address.postalCode ?? undefined,
    country: address.country ?? undefined,
    phone: address.phone ?? undefined
  };

  const hasContent = Object.values({
    address1: fields.address1,
    city: fields.city,
    postalCode: fields.postalCode,
    country: fields.country
  }).some((value) => typeof value === 'string' && value.trim() !== '');

  return hasContent ? fields : undefined;
};

const mapShipping = (shipping?: ApiShipping | null): Order['shipping'] | undefined => {
  if (!shipping) {
    return undefined;
  }

  const price = toNumber(shipping.price, 0);
  const carrier = typeof shipping.carrier === 'string' && shipping.carrier.trim() ? shipping.carrier : undefined;

  if (!carrier && price === 0) {
    return undefined;
  }

  return { price, carrier };
};

const mapOrderLine = (line?: ApiOrderLine | null): OrderLine | null => {
  if (!line || typeof line !== 'object') {
    return null;
  }

  const id = typeof line.id === 'number' ? line.id : Number.parseInt(String(line.id ?? ''), 10);

  if (!Number.isFinite(id)) {
    return null;
  }

  const quantity = typeof line.quantity === 'number' ? line.quantity : toNumber(line.quantity, 0);
  const unitPrice = toNumber(line.unitPrice, 0);
  const productPrice = toNumber(line.product?.price, unitPrice);
  const productTitle = typeof line.product?.title === 'string' && line.product.title.trim()
    ? line.product.title
    : 'Produit';

  return {
    id,
    quantity,
    unitPrice,
    productPrice,
    productTitle
  };
};

const mapOrder = (order?: ApiOrder | null): Order | null => {
  if (!order) {
    return null;
  }

  const id = typeof order.id === 'number' ? order.id : Number.parseInt(String(order.id ?? ''), 10);

  if (!Number.isFinite(id)) {
    return null;
  }

  const status = order.orderStatus ?? 'processing';
  const allowedStatus: OrderStatus[] = ['paid', 'processing', 'shipped', 'delivered', 'canceled', 'refunded'];
  const orderStatus = allowedStatus.includes(status as OrderStatus) ? (status as OrderStatus) : 'processing';

  const createdAt = typeof order.createdAt === 'string' && order.createdAt ? order.createdAt : new Date().toISOString();

  const lines = (order.order_lines ?? [])
    .map((line) => mapOrderLine(line))
    .filter((line): line is OrderLine => line !== null);

  return {
    id,
    orderNumber: typeof order.orderNumber === 'string' && order.orderNumber ? order.orderNumber : String(id),
    orderStatus,
    subtotal: toNumber(order.subtotal, 0),
    total: toNumber(order.total, 0),
    createdAt,
    shipping: mapShipping(order.shipping),
    shippingAddress: mapAddress(order.shippingAddress),
    billingAddress: mapAddress(order.billingAddress),
    lines
  };
};

const getStatusDetails = (status: Order['orderStatus']) => {
  switch (status) {
    case 'paid':
      return {
        text: 'Payée',
        description: 'Votre commande est confirmée et en attente de préparation.',
        color: 'text-blue-700 bg-blue-50',
        icon: Wallet,
        progress: 20,
        progressColor: 'bg-blue-500'
      };
    case 'processing':
      return {
        text: 'En préparation',
        description: 'Votre commande est en cours de préparation.',
        color: 'text-yellow-700 bg-yellow-50',
        icon: Package,
        progress: 40,
        progressColor: 'bg-yellow-400'
      };
    case 'shipped':
      return {
        text: 'Expédiée',
        description: 'Votre commande est en cours de livraison.',
        color: 'text-sky-700 bg-sky-50',
        icon: Truck,
        progress: 75,
        progressColor: 'bg-sky-500'
      };
    case 'delivered':
      return {
        text: 'Livrée',
        description: 'Votre commande a été livrée avec succès.',
        color: 'text-green-700 bg-green-50',
        icon: CheckCircle2,
        progress: 100,
        progressColor: 'bg-green-500'
      };
    case 'canceled':
      return {
        text: 'Annulée',
        description: 'Cette commande a été annulée.',
        color: 'text-red-700 bg-red-50',
        icon: Info,
        progress: 0,
        progressColor: 'bg-stone-300'
      };
    case 'refunded':
      return {
        text: 'Remboursée',
        description: 'Cette commande a été remboursée.',
        color: 'text-purple-700 bg-purple-50',
        icon: RefreshCw,
        progress: 100,
        progressColor: 'bg-purple-500'
      };
    default:
      return {
        text: 'Inconnu',
        description: 'Statut de la commande inconnu.',
        color: 'text-stone-700 bg-stone-50',
        icon: CircleDashed,
        progress: 0,
        progressColor: 'bg-stone-300'
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

const fetchUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch('/api/order', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }
    const payload = await response.json();
    const rawOrders: ApiOrder[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    return rawOrders
      .map((order) => mapOrder(order))
      .filter((order): order is Order => order !== null);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    throw error;
  }
};

export default function OrdersPage() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoaded || !user?.id) return;

      try {
        setLoading(true);
        const data = await fetchUserOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoaded, user?.id]);

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
                Retrouvez l’historique et le suivi de vos commandes passées sur ElecConnect
              </p>
            </div>
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
              Votre historique de commandes est vide. Découvrez nos produits et trouvez l&apos;équipement qui vous correspond.
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
                Solution solaire
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
                    <div className="p-6 md:p-8 flex flex-col gap-8">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-4 mb-3">
                            <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
                              Commande #{order.orderNumber}
                            </h2>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusDetails.color}`}>
                              <StatusIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                              {statusDetails.text}
                            </span>
                          </div>
                          <p className="flex items-center text-sm text-stone-500">
                            <Calendar className="h-4 w-4 mr-1.5 text-stone-400 flex-shrink-0" />
                            Passée le {formatDate(order.createdAt)}
                          </p>
                        </div>

                      </div>

                      <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-2">
                          <div className="bg-stone-50/50 p-5 rounded-xl border border-stone-200">
                            <div className="flex items-center mb-3">
                              <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mr-3">
                                <Package className="h-4 w-4" />
                              </div>
                              <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                                Articles commandés
                              </h3>
                            </div>
                            {order.lines.length > 0 ? (
                              <ul className="space-y-3">
                                {order.lines.map((line) => (
                                  <li
                                    key={line.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white/60 border border-stone-200 rounded-lg px-4 py-3"
                                  >
                                    <div>
                                      <p className="font-medium text-stone-900">{line.productTitle}</p>
                                      <p className="text-sm text-stone-500">
                                        {line.quantity} × {formatPrice(line.unitPrice)}
                                      </p>
                                    </div>
                                    <p className="text-sm font-semibold text-stone-900">
                                      {formatPrice(line.quantity * line.unitPrice)}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-stone-500 italic">
                                Aucun article n&apos;est associé à cette commande.
                              </p>
                            )}
                          </div>

                          <div className="bg-stone-50/50 p-5 rounded-xl border border-stone-200">
                            <div className="flex items-center mb-3">
                              <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mr-3">
                                <ReceiptText className="h-4 w-4" />
                              </div>
                              <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wide">
                                Résumé du paiement
                              </h3>
                            </div>
                            <div className="pl-9 text-sm space-y-2">
                              <div className="flex items-center justify-between text-stone-600">
                                <span>Sous-total</span>
                                <span className="font-medium text-stone-900">{formatPrice(order.subtotal)}</span>
                              </div>
                              <div className="flex items-center justify-between text-stone-600">
                                <span>
                                  Livraison
                                  {order.shipping?.carrier ? ` · ${order.shipping.carrier}` : ''}
                                </span>
                                <span className="font-medium text-stone-900">{formatPrice(order.shipping?.price ?? 0)}</span>
                              </div>
                              <div className="flex items-center justify-between text-stone-900 font-semibold text-base pt-1 border-t border-stone-200">
                                <span>Total payé</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-stone-50/50 p-5 rounded-xl border border-stone-200">
                            <div className="flex items-center mb-3">
                              <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mr-3">
                                <Box className="h-5 w-5" />
                              </div>
                              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
                                Adresse de livraison
                              </h3>
                            </div>
                            {order.shippingAddress ? (
                              <div className="pl-11 space-y-1 text-sm text-stone-700">
                                {order.shippingAddress.fullName && <p className="font-medium">{order.shippingAddress.fullName}</p>}
                                {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                                {order.shippingAddress.address1 && <p>{order.shippingAddress.address1}</p>}
                                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                {(order.shippingAddress.postalCode || order.shippingAddress.city) && (
                                  <p>
                                    {[order.shippingAddress.postalCode, order.shippingAddress.city].filter(Boolean).join(' ')}
                                  </p>
                                )}
                                {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                                {order.shippingAddress.phone && (
                                  <p className="text-sm text-stone-500 mt-2">{order.shippingAddress.phone}</p>
                                )}
                              </div>
                            ) : (
                              <p className="pl-11 text-sm text-stone-500 italic">
                                Aucune adresse de livraison renseignée
                              </p>
                            )}
                          </div>

                          <div className="bg-stone-50/50 p-5 rounded-xl border border-stone-200">
                            <div className="flex items-center mb-3">
                              <div className="p-2 rounded-lg bg-stone-100 text-stone-600 mr-3">
                                <Wallet className="h-5 w-5" />
                              </div>
                              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
                                Adresse de facturation
                              </h3>
                            </div>
                            {order.billingAddress ? (
                              <div className="pl-11 space-y-1 text-sm text-stone-700">
                                {order.billingAddress.fullName && <p className="font-medium">{order.billingAddress.fullName}</p>}
                                {order.billingAddress.company && <p>{order.billingAddress.company}</p>}
                                {order.billingAddress.address1 && <p>{order.billingAddress.address1}</p>}
                                {order.billingAddress.address2 && <p>{order.billingAddress.address2}</p>}
                                {(order.billingAddress.postalCode || order.billingAddress.city) && (
                                  <p>
                                    {[order.billingAddress.postalCode, order.billingAddress.city].filter(Boolean).join(' ')}
                                  </p>
                                )}
                                {order.billingAddress.country && <p>{order.billingAddress.country}</p>}
                                {order.billingAddress.phone && (
                                  <p className="text-sm text-stone-500 mt-2">{order.billingAddress.phone}</p>
                                )}
                              </div>
                            ) : (
                              <p className="pl-11 text-sm text-stone-500 italic">
                                Aucune adresse de facturation renseignée
                              </p>
                            )}
                          </div>
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