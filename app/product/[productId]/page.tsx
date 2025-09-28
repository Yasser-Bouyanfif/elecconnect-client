"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SERVER_URL } from "@/app/lib/constants";
import { ShoppingCart, Truck, Shield, ArrowLeft, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  CartContext,
  CartContextType,
  CartItem,
} from "@/app/contexts/CartContext";

const IMAGE_FALLBACK = "/borne2.png";

type ImageFormatKey = "thumbnail" | "small" | "medium" | "large";

interface BannerImageFormat {
  url: string;
}

interface BannerImage {
  id: number;
  url: string;
  formats?: {
    thumbnail?: BannerImageFormat;
    small?: BannerImageFormat;
    medium?: BannerImageFormat;
    large?: BannerImageFormat;
  };
  alternativeText?: string | null;
  caption?: string | null;
}

interface Product {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  weight?: string;
  banner?: BannerImage[] | BannerImage | null;
  productSection: [];
}

interface SectionItemEntry { label?: string; value?: string }
interface SectionContentItem { value?: string; label?: string; items?: SectionItemEntry[] }
interface ProductSection { id?: number; title?: string; content?: SectionContentItem[] }

function extractSections(p?: Product | null): ProductSection[] {
  if (!p) return [];

  const record = p as unknown as Record<string, unknown>;

  const candidates = [
    record.ProductSection,
    record.productSection,
    record.product_sections,
    record.ProductSections,
    record.sections,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return (candidate as ProductSection[]).filter(Boolean);
    }
  }

  return [];
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const cartContext = useContext(CartContext) as CartContextType | undefined;

  const clampQuantity = (value: number) => {
    if (Number.isNaN(value)) {
      return 1;
    }
    return Math.min(4, Math.max(1, value));
  };

  useEffect(() => {
    if (!productId) return;

    let alive = true;
    const controller = new AbortController();

    (async () => {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/404");
            return;
          }
          throw new Error(`Statut ${response.status}`);
        }

        const { data } = await response.json();
        if (!alive) return;

        setProduct(data);
      } catch (e) {
        console.error("Erreur lors de l'appel à l'API :", e);
        router.push("/404");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [productId, router]);

  const productImages = useMemo(() => {
    const bannerData = product?.banner;

    if (Array.isArray(bannerData)) {
      const validImages = bannerData.filter(
        (image): image is BannerImage =>
          Boolean(image) &&
          typeof image === "object" &&
          typeof (image as BannerImage).url === "string" &&
          (image as BannerImage).url.length > 0
      );

      return validImages.slice().reverse();
    }

    if (
      bannerData &&
      typeof bannerData === "object" &&
      typeof (bannerData as BannerImage).url === "string" &&
      (bannerData as BannerImage).url.length > 0
    ) {
      return [bannerData as BannerImage];
    }

    return [];
  }, [product]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?.documentId]);

  useEffect(() => {
    if (selectedImageIndex >= productImages.length) {
      setSelectedImageIndex(productImages.length > 0 ? productImages.length - 1 : 0);
    }
  }, [productImages.length, selectedImageIndex]);

  const getImagePath = (
    image: BannerImage | null,
    order: ImageFormatKey[] = ["large", "medium", "small", "thumbnail"],
    options?: { includeOriginal?: boolean }
  ): string => {
    if (!image) return "";

    const includeOriginal = options?.includeOriginal !== false;

    if (includeOriginal && image.url) {
      return image.url;
    }

    for (const key of order) {
      const candidate = image.formats?.[key]?.url;
      if (candidate) {
        return candidate;
      }
    }

    return image.url ?? "";
  };

  const ensureAbsoluteUrl = (url: string): string => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    return `${SERVER_URL}${url}`;
  };

  const selectedImage = productImages[selectedImageIndex] ?? null;
  const mainImagePath = getImagePath(selectedImage, ["large", "medium", "small", "thumbnail"]);
  const mainImageSrc = ensureAbsoluteUrl(mainImagePath) || IMAGE_FALLBACK;
  const mainImageAlt =
    selectedImage?.alternativeText ||
    selectedImage?.caption ||
    product?.title ||
    "Image produit";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h2>
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const quantity = clampQuantity(qty);
    setQty(quantity);
    if (!product) {
      return;
    }

    if (!cartContext?.addToCart) {
      console.error("Cart context non disponible pour ajouter un produit.");
      return;
    }

    const primaryImage = productImages[0] ?? null;
    const primaryImagePath = getImagePath(primaryImage);

    const cartItem: CartItem = {
      id: product.id,
      documentId: product.documentId,
      title: product.title,
      price: product.price,
      banner: primaryImagePath ? { url: primaryImagePath } : undefined,
    };

    for (let index = 0; index < quantity; index += 1) {
      cartContext.addToCart(cartItem);
    }

  };

  const sections = extractSections(product);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 md:[grid-template-columns:1.2fr_1fr] gap-6 md:gap-8 items-start">
            {/* Galerie d'images */}
            <div className="w-full">
              <div className="w-full overflow-hidden rounded-lg border border-gray-100 bg-white">
                <Image
                  src={mainImageSrc}
                  alt={mainImageAlt}
                  width={1000}
                  height={800}
                  className="h-full w-full object-contain bg-white"
                />
              </div>
              {productImages.length > 1 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {productImages.map((image, index) => {
                    const thumbPath = getImagePath(image, ["thumbnail", "small", "medium", "large"], {
                      includeOriginal: false,
                    });
                    const thumbSrc = ensureAbsoluteUrl(thumbPath) || mainImageSrc;
                    const isActive = index === selectedImageIndex;

                    return (
                      <button
                        key={image.id ?? index}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square overflow-hidden rounded-md border transition ${
                          isActive
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        aria-label={`Afficher l&apos;image ${index + 1}`}
                        aria-pressed={isActive}
                      >
                        <Image
                          src={thumbSrc}
                          alt={
                            image.alternativeText || image.caption || `Image ${index + 1} du produit`
                          }
                          width={200}
                          height={200}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
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


              {/* Quantité + Bouton d'ajout au panier */}
              <div className="mt-2 space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Quantité</span>
                  <div className="inline-flex items-center rounded-md border border-gray-300 shadow-sm">
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      onClick={() => setQty((q) => clampQuantity(q - 1))}
                      className="p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={qty}
                      onChange={(event) => {
                        const value = Number.parseInt(event.target.value, 10);
                        setQty(clampQuantity(value));
                      }}
                      className="px-4 py-2 min-w-[3rem] text-center border-l border-r border-gray-300 focus:outline-none"
                      aria-label="Quantité du produit"
                    />
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      onClick={() => setQty((q) => clampQuantity(q + 1))}
                      className="p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
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

          </div>
        </div>
        </div>
      </div>
    </div>
  );
}