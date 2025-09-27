"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { SERVER_URL } from "@/app/lib/constants";

const IMAGE_FALLBACK = "/borne2.png";

type ImageFormat = {
  url?: string | null;
};

type BannerImage = {
  id?: number;
  url?: string | null;
  name?: string | null;
  alternativeText?: string | null;
  caption?: string | null;
  formats?: Record<string, ImageFormat | undefined> | null;
  data?: { attributes?: unknown } | null;
};

type ProductAttributes = {
  id?: number | string;
  documentId?: string;
  title?: string;
  description?: string;
  price?: number;
  banner?: BannerImage[] | BannerImage | null;
};

type Product = ProductAttributes & {
  attributes?: ProductAttributes | null;
};

type Pagination = {
  page?: number;
  pageCount?: number;
  total?: number;
};

type ProductsPayload = {
  data?: unknown;
  meta?: {
    pagination?: Pagination;
  } | null;
};

const IMAGE_FORMAT_PRIORITY = ["large", "medium", "small", "thumbnail"] as const;

function normalizeBannerImage(value: unknown): BannerImage | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as BannerImage;

  if (typeof candidate.url === "string" && candidate.url.length > 0) {
    return candidate;
  }

  if (candidate.formats && typeof candidate.formats === "object") {
    return candidate;
  }

  if ("data" in candidate && candidate.data && typeof candidate.data === "object") {
    const data = candidate.data as { attributes?: unknown };
    if (data.attributes && typeof data.attributes === "object") {
      return normalizeBannerImage(data.attributes);
    }
  }

  return null;
}

function selectPrimaryBannerImage(banner: ProductAttributes["banner"]): BannerImage | null {
  if (Array.isArray(banner)) {
    const normalized = banner
      .map((image) => normalizeBannerImage(image))
      .filter((image): image is BannerImage => Boolean(image));

    if (normalized.length > 0) {
      return normalized[normalized.length - 1];
    }
    return null;
  }

  return normalizeBannerImage(banner);
}

function resolveImageUrl(image: BannerImage | null): string {
  if (!image) {
    return "";
  }

  if (typeof image.url === "string" && image.url.length > 0) {
    return image.url;
  }

  if (image.formats && typeof image.formats === "object") {
    for (const key of IMAGE_FORMAT_PRIORITY) {
      const candidate = image.formats?.[key]?.url;
      if (candidate) {
        return candidate;
      }
    }

    for (const value of Object.values(image.formats)) {
      if (value?.url) {
        return value.url;
      }
    }
  }

  return "";
}

function getImageUrl(product: Product): { src: string; alt: string } {
  const attributes = product.attributes ?? product;
  const primaryImage = selectPrimaryBannerImage(attributes?.banner ?? null);
  const fallbackAlt = attributes?.title ?? "Produit";

  const rawUrl = resolveImageUrl(primaryImage);
  const alt =
    primaryImage?.alternativeText ??
    primaryImage?.caption ??
    primaryImage?.name ??
    fallbackAlt;

  if (!rawUrl) {
    return { src: IMAGE_FALLBACK, alt };
  }

  if (/^https?:\/\//i.test(rawUrl)) {
    return { src: rawUrl, alt };
  }

  const prefix = SERVER_URL ?? "";
  return { src: `${prefix}${rawUrl}`, alt };
}

function normalizeProducts(data: unknown): Product[] {
  if (Array.isArray(data)) {
    return data as Product[];
  }
  if (data && typeof data === "object") {
    return [data as Product];
  }
  return [];
}

function extractPagination(meta: unknown): Pagination | null {
  if (meta && typeof meta === "object" && "pagination" in meta) {
    const { pagination } = meta as { pagination?: Pagination };
    if (pagination && typeof pagination === "object") {
      return pagination;
    }
  }
  return null;
}

function getProductData(product: Product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
  };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products?page=${page}`, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Statut ${response.status}`);
        }

        const payload: ProductsPayload = await response.json();
        if (!active) return;

        setProducts(normalizeProducts(payload?.data));

        const pagination = extractPagination(payload?.meta ?? null);
        const nextPageCount = pagination?.pageCount;
        const safePageCount =
          Number.isFinite(nextPageCount) && typeof nextPageCount === "number"
            ? Math.max(1, Math.floor(nextPageCount))
            : 1;

        setPageCount(safePageCount);

        if (page > safePageCount) {
          setPage(safePageCount);
        }
      } catch (err) {
        if (!active) return;
        if ((err as Error).name === "AbortError") return;
        console.error("Erreur lors de la récupération des produits:", err);
        setError("Impossible de charger les produits pour le moment.");
        setProducts([]);
        setPageCount(1);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page]);

  const hasProducts = products.length > 0;

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Boutique</h1>
          <p className="text-slate-600">Découvrez nos produits disponibles.</p>
        </div>

        <div className="min-h-[200px]">
          {loading ? (
            <p className="text-slate-500">Chargement des produits…</p>
          ) : error ? (
            <p className="text-slate-500">{error}</p>
          ) : !hasProducts ? (
            <p className="text-slate-500">Aucun produit disponible pour le moment.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => {
                  const { id, title, description, price } = getProductData(product);
                  const { src, alt } = getImageUrl(product);
                  const formattedPrice =
                    typeof price === "number" ? price.toLocaleString() : null;
                  const href = id ? `/product/${id}` : "#";

                  return (
                    <div
                      key={id || `product-${index}`}
                      className="m-0 h-full min-h-[560px] flex flex-col border rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="relative h-[400px] bg-gray-50">
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          unoptimized
                          sizes="(max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col">
                        {formattedPrice && (
                          <p className="text-base font-semibold text-slate-900">
                            {formattedPrice}€ <span className="text-xs text-slate-500">TTC</span>
                          </p>
                        )}
                        <h3 className="text-slate-800 font-medium text-sm md:text-base line-clamp-1">
                          {title}
                        </h3>
                        {description && (
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {description}
                          </p>
                        )}
                        <div className="mt-auto pt-3">
                          <Link
                            href={href}
                            className="btn btn-outline btn-sm md:btn-md w-full"
                            aria-disabled={!id}
                          >
                            Voir le produit
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`btn btn-sm md:btn-md min-w-[40px] ${
                      page === pageNumber ? 'bg-black text-white' : 'bg-transparent text-black border border-black hover:bg-gray-100'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
