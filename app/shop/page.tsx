"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { SERVER_URL } from "@/app/lib/constants";

const IMAGE_FALLBACK = "/borne2.png";

type Product = {
  id?: number | string;
  documentId?: string;
  title?: string;
  description?: string;
  price?: number;
  banner?: {
    url?: string;
    name?: string;
    alternativeText?: string;
    data?: { attributes?: { url?: string; alternativeText?: string; name?: string } };
  } | null;
  attributes?: Product;
};

function getImageUrl(product: Product): { src: string; alt: string } {
  const attributes = product.attributes ?? product;
  const banner = attributes?.banner ?? null;

  const url =
    (typeof banner?.url === "string" && banner.url) ||
    banner?.data?.attributes?.url ||
    "";

  const alt =
    banner?.name ||
    banner?.alternativeText ||
    banner?.data?.attributes?.alternativeText ||
    banner?.data?.attributes?.name ||
    attributes?.title ||
    "Produit";

  if (!url) {
    return { src: IMAGE_FALLBACK, alt };
  }

  if (url.startsWith("http")) {
    return { src: url, alt };
  }

  const prefix = SERVER_URL ?? "";
  return { src: `${prefix}${url}`, alt };
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

function getProductData(product: Product) {
  const attributes = product.attributes ?? product;
  const price = Number(attributes?.price);
  const rawId =
    attributes?.documentId ??
    product.documentId ??
    attributes?.id ??
    product.id ??
    "";

  return {
    id: rawId ? String(rawId) : "",
    title: attributes?.title ?? "Produit",
    description: attributes?.description ?? "",
    price: Number.isFinite(price) ? price : null,
  };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setError(null);

        const response = await fetch("/api/products", {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Statut ${response.status}`);
        }

        const data = await response.json();
        if (!active) return;

        setProducts(normalizeProducts(data));
      } catch (err) {
        if (!active) return;
        if ((err as Error).name === "AbortError") return;
        console.error("Erreur lors de la récupération des produits:", err);
        setError("Impossible de charger les produits pour le moment.");
        setProducts([]);
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
  }, []);

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
                          {formattedPrice}€ <span className="text-xs text-slate-500">HT</span>
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
          )}
        </div>
      </div>
    </div>
  );
}
