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
  // The API may expose sections under various keys; we'll access them dynamically
  [key: string]: any;
}

// Types for ProductSection rendering (kept permissive to match API)
interface SectionItemEntry { label?: string; value?: string }
interface SectionContentItem { value?: string; label?: string; items?: SectionItemEntry[] }
interface ProductSection { id?: number; title?: string; content?: SectionContentItem[] }

// Extract sections from various possible API keys
function extractSections(p?: Product | null): ProductSection[] {
  if (!p) return [];
  const candidates = [
    (p as any).ProductSection,
    (p as any).productSection,
    (p as any).product_sections,
    (p as any).ProductSections,
    (p as any).sections,
  ];
  const found = candidates.find((c) => Array.isArray(c) && c.length);
  if (!found) return [];
  return (found as any[]).filter(Boolean);
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

  const sections = extractSections(product);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 md:[grid-template-columns:1.2fr_1fr] gap-6 md:gap-8 items-start">
            {/* Galerie d'images */}
            <div className="w-full">
              <div className="w-full overflow-hidden rounded-lg">
                <Image
                  src={`${SERVER_URL}${product.banner?.url}`}
                  alt={product.banner?.name || product.title}
                  width={1000}
                  height={800}
                  className="h-full w-full object-contain bg-white"
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
            <div className="w-full flex flex-col gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

              {/* Prix */}
              <div className="mb-4">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{product.price.toFixed(2)} €</p>
                {product.weight && (
                  <p className="text-sm text-gray-500 mt-1">Poids: {product.weight} kg</p>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Caractéristiques détaillées (depuis l'API ProductSection) */}
              {sections.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">Caractéristiques détaillées</h2>
                  <div className="space-y-4">
                    {sections.map((section, sIdx) => (
                      <div key={section.id ?? sIdx} className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                        {section.title && (
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">{section.title}</h3>
                        )}
                        <div className="space-y-2">
                          {section.content?.map((c, cIdx) => (
                            <div key={cIdx}>
                              {c.items && c.items.length > 0 ? (
                                <ul className="list-disc list-inside space-y-1 marker:text-black">
                                  {c.items.map((it, iIdx) => (
                                    <li key={iIdx} className="text-sm text-gray-700">
                                      {it.label && (
                                        <span className="font-semibold text-gray-800">{it.label}: </span>
                                      )}
                                      <span>{it.value}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <ul className="list-disc list-inside marker:text-black">
                                  <li className="text-sm text-gray-700">
                                    {c.label && (
                                      <span className="font-semibold text-gray-800">{c.label}{c.value ? ": " : ""}</span>
                                    )}
                                    {c.value}
                                  </li>
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Caractéristiques */}
              {product.features && product.features.length > 0 && (
                <div>
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
                  className="btn btn-soft btn-primary btn-block btn-lg"
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
                      <p className="text-xs text-gray-500">Le lendemain</p>
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

              {/* sections moved out to full-width row below */}
            </div>
            {/* sections block moved above, between Description and Quantité */}
          </div>
        </div>
      </div>
    </div>
  );
}