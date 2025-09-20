"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import productApi from "@/app/_utils/productApis";
import { SERVER_URL } from "@/app/lib/constants";

interface Product {
  id: number;
  title?: string;
  price?: number;
  description?: string;
  banner?: { url?: string; name?: string } | null;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

const PAGE_SIZE = 6;
const IMAGE_FALLBACK = "/borne2.png";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageCount = useMemo(() => pagination?.pageCount ?? 1, [pagination]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productApi.getLatestProducts(page, PAGE_SIZE);
        if (!alive) return;
        const data = res?.data?.data ?? [];
        const meta = res?.data?.meta?.pagination ?? null;
        setProducts(Array.isArray(data) ? data : []);
        setPagination(meta);
      } catch (e: any) {
        if (!alive) return;
        setProducts([]);
        setError("Une erreur est survenue lors du chargement des produits.");
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [page]);

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(pageCount, p + 1));

  const renderPagination = () => {
    if (!pagination || pageCount <= 1) return null;

    const buttons: React.ReactElement[] = [];
    const maxPagesToShow = 5;
    const start = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const end = Math.min(pageCount, start + maxPagesToShow - 1);
    const adjustedStart = Math.max(1, end - maxPagesToShow + 1);

    for (let i = adjustedStart; i <= end; i++) {
      const isActive = i === page;
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`btn btn-sm ${isActive ? "btn-neutral" : "btn-outline"}`}
          aria-current={isActive ? "page" : undefined}
          aria-label={`Aller à la page ${i}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="btn btn-sm btn-outline"
          onClick={onPrev}
          disabled={page <= 1}
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {adjustedStart > 1 && <span className="px-2">…</span>}
        {buttons}
        {end < pageCount && <span className="px-2">…</span>}
        <button
          className="btn btn-sm btn-outline"
          onClick={onNext}
          disabled={page >= pageCount}
          aria-label="Page suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <main className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Boutique</h1>
          <p className="text-slate-600 mt-1">Découvrez nos produits. 6 par page.</p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-slate-500">Chargement…</p>
        ) : error ? (
          <p className="py-12 text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-slate-500">
            Aucun produit disponible pour le moment.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {products.map((product) => {
                const price = Number(product.price) || 0;
                const imageSrc = product.banner?.url
                  ? `${SERVER_URL ?? ""}${product.banner.url}`
                  : IMAGE_FALLBACK;
                const productTitle = product.title ?? "Produit";
                const description = product.description
                  ? product.description.substring(0, 140)
                  : "";
                return (
                  <article
                    key={product.id}
                    className="card bg-base-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-2xl overflow-hidden h-full"
                  >
                    <figure className="relative w-full h-72">
                      <Image
                        src={imageSrc}
                        alt={product.banner?.name || productTitle}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                    </figure>
                    <div className="card-body p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="card-title text-lg leading-tight line-clamp-2">
                          {productTitle}
                        </h3>
                        <span className="badge badge-neutral badge-lg whitespace-nowrap">
                          {price.toLocaleString()}€ <span className="text-[10px] text-slate-200 ml-1">HT</span>
                        </span>
                      </div>
                      {description && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-3">{description}</p>
                      )}
                      <div className="card-actions mt-4">
                        <Link
                          href={`/product/${product.id}`}
                          className="btn btn-neutral w-full"
                          aria-label={`Voir le produit ${productTitle}`}
                        >
                          Voir le produit
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </main>
  );
}
