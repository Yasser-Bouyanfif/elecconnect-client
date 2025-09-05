"use client";

import React, { useEffect, useState } from "react";
import productApi from "@/app/_utils/productApis";
import { useParams, useRouter } from "next/navigation";
import { SERVER_URL } from "@/app/_utils/constants";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  banner?: { url?: string; name?: string };
}

export default function ProductDetails() {
  const params = useParams();
  const productId = Array.isArray((params as any).productId)
    ? (params as any).productId[0]
    : (params as any).productId;

  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="p-6 text-gray-500">Chargement…</p>;
  if (!product) return null;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-4">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-lg font-semibold text-green-600">{product.price} €</p>
      <p className="text-gray-700">{product.description}</p>

        <img
          src={`${SERVER_URL}${product.banner?.url}`}
          alt={product.banner?.name || product.title}
          className="w-full rounded-lg object-cover"
        />
        
    </div>
  );
}