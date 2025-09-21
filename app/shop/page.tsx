"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const IMAGE_FALLBACK = "/borne2.png";

export default function ShopPage() {

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        console.log('Produits récupérés:', data);
      } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
      }
    };

    fetchProducts();
  }, []);

  const product = {
    id: 1,
    title: "Produit d'exemple",
    price: 999,
    description: "Description courte du produit pour l'exemple.",
    imageSrc: IMAGE_FALLBACK,
  };


  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Boutique</h1>
          <p className="text-slate-600">Découvrez nos produits disponibles.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="m-0 h-full min-h-[560px] flex flex-col border rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow">
            <div className="relative h-[400px] bg-gray-50">
              <Image
                src={product.imageSrc}
                alt={product.title}
                fill
                unoptimized
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 flex flex-col">
              <p className="text-base font-semibold text-slate-900">
                {product.price.toLocaleString()}€ <span className="text-xs text-slate-500">TT</span>
              </p>
              <h3 className="text-slate-800 font-medium text-sm md:text-base line-clamp-1">{product.title}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
              <div className="mt-auto pt-3">
                <Link href="#" className="btn btn-outline btn-sm md:btn-md w-full">
                  Voir le produit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
