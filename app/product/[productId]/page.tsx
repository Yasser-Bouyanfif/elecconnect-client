"use client";

import React, { useEffect, useState } from "react";
import productApi from "@/app/_utils/productApis";
import { useParams, useRouter } from "next/navigation";
import { SERVER_URL } from "@/app/lib/constants";
import { ShoppingCart, Truck, Shield, ArrowLeft, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  weight?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  banner?: { url?: string; name?: string };
  images?: Array<{ url?: string; name?: string }>;
  features?: string[];
}

export default function ProductDetails() {
  const params = useParams<{ productId: string | string[] }>();
  const productIdParam = params.productId;
  const productId = Array.isArray(productIdParam)
    ? productIdParam[0]
    : productIdParam;

  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    if (!productId) return;

    let alive = true;
    (async () => {
      try {
        const res = await productApi.getProductById(productId);
        const data: Product | undefined =
          res?.data?.data?.[0] ?? res?.data?.data;
        if (!alive) return;

        if (!data?.id) {
          router.push("/404");
          return;
        }
        setProduct(data);
      } catch (e) {
        console.error("Erreur API:", e);
        router.push("/404");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [productId, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h2>
      <Link href="/" className="text-blue-600 hover:underline flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" /> Retour à l'accueil
      </Link>
    </div>
  );

  const addToCart = () => {
    // Logique d'ajout au panier
    console.log('Ajout au panier:', { product, quantity: qty });
    // Ici, vous pourriez ajouter une notification ou une alerte
    alert(`${qty} × ${product.title} a été ajouté au panier!`);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Galerie d'images */}
            <div className="w-full">
              <div className="w-full overflow-hidden rounded-lg">
                <Image
                  src={`${SERVER_URL}${product.banner?.url}`}
                  alt={product.banner?.name || product.title}
                  width={1000}
                  height={800}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <Image
                        src={`${SERVER_URL}${image.url}`}
                        alt={image.name || `${product.title} - Vue ${index + 1}`}
                        width={200}
                        height={200}
                        className="h-20 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Détails du produit */}
            <div className="w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

              {/* Prix */}
              <div className="mb-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{product.price.toFixed(2)} €</p>
                {product.weight && (
                  <p className="text-sm text-gray-500 mt-1">Poids: {product.weight} kg</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Caractéristiques */}
              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base font-medium text-gray-900 mb-2">Caractéristiques</h3>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantité + Bouton d'ajout au panier */}
              <div className="mt-2 space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Quantité</span>
                  <div className="inline-flex items-center rounded-md border border-gray-300 shadow-sm">
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="px-4 py-2 min-w-[3rem] text-center select-none">
                      {qty}
                    </div>
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      onClick={() => setQty((q) => Math.min(99, q + 1))}
                      className="p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={addToCart}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </button>
              </div>

              {/* Garanties */}
              <div className="mt-3 border-t border-gray-200 pt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Truck className="w-6 h-6 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Livraison rapide</p>
                      <p className="text-xs text-gray-500">Sous 48h</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Garantie</p>
                      <p className="text-xs text-gray-500">1 an</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}