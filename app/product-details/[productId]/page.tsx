"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import productApi from "@/app/_utils/productApis";
import { useParams, useRouter } from "next/navigation";

type RichText = { type: string; children: { text: string }[] };
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  banner?: {
    url?: string;
    name?: string;
  };
}

const SERVER_URL = (process.env.NEXT_PUBLIC_SERVER_URL ?? "").replace(
  /^http:/,
  "https:"
);

const toServerUrl = (path?: string) =>
  path ? (path.startsWith("http") ? path : `${SERVER_URL}${path}`) : "";

function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const getProductById = async () => {
    try {
      const res = await productApi.getProductById(productId);
      const data: Product | undefined = res?.data?.data?.[0];

      if (!data?.id) {
        router.push("/404"); 
        return;
      }
      setProduct(data);
    } catch (e) {
      console.error("Erreur API:", e);
      router.push("/404");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) getProductById();
    
  }, [productId]);

  if (loading) return <p className="p-6 text-gray-500">Chargement…</p>;
  if (!product) return null;

  const imgSrc = toServerUrl(product.banner?.url);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-4">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-lg font-semibold text-green-600">{product.price} €</p>
      <p className="text-gray-700">{product.description}</p>

      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={product.banner?.name || product.title}
          width={800}
          height={600}
          className="w-full rounded-lg object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-lg grid place-items-center text-gray-400">
          Pas d’image
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
