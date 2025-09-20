"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import productApi from "@/app/_utils/productApis";
import { SERVER_URL } from "@/app/lib/constants";

interface Product {
  id: number;
  title?: string;
  price?: number;
  description?: string;
  banner?: { url?: string; name?: string } | null;
}

const IMAGE_FALLBACK = "/borne2.png";

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await productApi.getProducts();
        if (!alive) return;
        const data = res?.data?.data;
        const items = Array.isArray(data) ? data : data ? [data] : [];
        setAllProducts(items);
      } catch (e) {
        console.error("Erreur lors du chargement des produits", e);
        if (alive) setAllProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Boutique</h1>
          <p className="text-slate-600">Découvrez nos produits disponibles.</p>
        </div>

        {loading ? (
          <p className="py-10 text-center text-slate-500">Chargement…</p>
        ) : allProducts.length === 0 ? (
          <p className="py-10 text-center text-slate-500">Aucun produit disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => {
              const price = Number(product.price) || 0;
              const imageSrc = product.banner?.url
                ? `${SERVER_URL ?? ""}${product.banner.url}`
                : IMAGE_FALLBACK;
              const productTitle = product.title ?? "Produit";
              const description = product.description
                ? product.description.substring(0, 100)
                : "";
              return (
                <div key={product.id} className="m-0 h-full min-h-[560px] flex flex-col border rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow">
                  <div className="relative h-[400px] bg-gray-50">
                    <Image
                      src={imageSrc}
                      alt={product.banner?.name || productTitle}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <p className="text-base font-semibold text-slate-900">
                      {price.toLocaleString()}€ <span className="text-xs text-slate-500">TT</span>
                    </p>
                    <h3 className="text-slate-800 font-medium text-sm md:text-base line-clamp-1">{productTitle}</h3>
                    {description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{description}</p>
                    )}
                    <div className="mt-auto pt-3">
                      <Link href={`/product/${product.id}`} className="btn btn-outline btn-sm md:btn-md w-full">
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
  );
}
