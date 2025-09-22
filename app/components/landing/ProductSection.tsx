"use client";

import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

import { SERVER_URL } from "@/app/lib/constants";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1324 }, items: 3, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1324, min: 764 }, items: 2, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 764, min: 0 }, items: 1, slidesToSlide: 1 },
};

const IMAGE_URL = "/borne2.png";

interface ProductBanner {
  url?: string;
  name?: string;
  alternativeText?: string;
  data?: { attributes?: { url?: string; name?: string; alternativeText?: string } } | null;
}

interface Product {
  id?: number | string;
  title?: string;
  price?: number;
  description?: string;
  banner?: ProductBanner | null;
}

function Arrow({
  onClick,
  direction,
}: {
  onClick?: () => void;
  direction: "left" | "right";
}) {
  const common =
    "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/90 hover:bg-black transition-colors flex items-center justify-center shadow-sm";
  const side = direction === "left" ? "left-3" : "right-3";
  return (
    <button
      aria-label={direction === "left" ? "Précédent" : "Suivant"}
      onClick={onClick}
      className={`${common} ${side}`}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-5 h-5 text-white" />
      ) : (
        <ChevronRight className="w-5 h-5 text-white" />
      )}
    </button>
  );
}

export default function ProductCarouselSimple() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Statut ${response.status}`);
        }


        const payload: { data?: unknown } = await response.json();

        if (!alive) return;

        const data = Array.isArray(payload?.data)
          ? payload.data
          : payload?.data
            ? [payload.data]
            : [];

        setProducts(data as Product[]);
      } catch (error) {
        if (!alive || (error as Error).name === "AbortError") {
          return;
        }
        console.error("Erreur lors du chargement des produits", error);
        setProducts([]);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Nos solutions recommandées
          </h2>
          <p className="text-slate-600">
            Découvrez notre sélection de bornes adaptées à tous vos besoins.
          </p>
        </div>

        <div className="relative">
          {loading ? (
            <p className="py-10 text-center text-slate-500">Chargement…</p>
          ) : products.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              Aucun produit disponible pour le moment.
            </p>
          ) : (
            <Carousel
              responsive={responsive}
              infinite
              autoPlay
              autoPlaySpeed={5000}
              keyBoardControl
              customLeftArrow={<Arrow direction="left" />}
              customRightArrow={<Arrow direction="right" />}
              containerClass="pb-6"
              itemClass="px-6"
              draggable
            >
              {products.map((product) => {
                const title = product.title || "Produit";
                const imageSrc = `${SERVER_URL}${product.banner?.url}`
                const imageAlt = product.title || "Produit";
                const price = product.price ? `${product.price} €` : "Prix non défini";
                const description = product.description || "Description non disponible";

                
                return (
                  <div key={String(product.id)} className="m-0 h-full min-h-[560px] flex flex-col">
                    <div className="relative h-[400px]">
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        unoptimized
                        sizes="(max-width: 1324px) 90vw, 20vw"
                        className="object-cover rounded-xl"
                      />
                    </div>

                    {price && (
                      <p className="text-base md:text-lg font-semibold text-slate-900 mt-4">
                        {price} <span className="text-xs text-slate-500">TTC</span>
                      </p>
                    )}
                    <h3 className="text-slate-800 font-medium md:font-semibold text-[15px] md:text-base">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{description}</p>
                    )}

                    {/* Bouton DaisyUI */}
                    <div className="mt-auto pt-3">
                      <Link
                        href={`/product/${product.id}`}
                        className="btn btn-outline md:btn-md"
                        aria-label={`Voir le produit ${title}`}
                      >
                        Voir le produit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}