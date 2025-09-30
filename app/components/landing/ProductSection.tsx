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
  title?: string;
  price?: number;
  description?: string;
  banner?: BannerImage[] | BannerImage | null;
};

type Product = ProductAttributes & {
  attributes?: ProductAttributes | null;
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
              {products.map((product, index) => {
                const attributes = product.attributes ?? product;
                const title = attributes?.title || "Produit";
                const description =
                  attributes?.description || "Description non disponible";
                const price =
                  typeof attributes?.price === "number"
                    ? `${attributes.price} €`
                    : "Prix non défini";
                const { src: imageSrc, alt: imageAlt } = getImageUrl(product);
                const key = attributes?.id ?? product.id ?? index;

                return (
                  <div key={String(key)} className="m-0 h-full min-h-[560px] flex flex-col">
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
                        className="btn btn-soft md:btn-md"
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