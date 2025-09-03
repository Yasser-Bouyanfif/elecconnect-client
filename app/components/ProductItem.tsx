import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

type Product = {
  id?: number | string;
  title?: string;
  price?: number | string;
  description?: string
};

export default function ProductItem({ product }: { product: Product }) {
  const { user } = useUser()
  const router = useRouter()
  const {cart, setCart}: any = useContext(CartContext)

  const handleAddToCart = () => {
    console.log("ok")
  };

  return (
    <article
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      aria-label={product.title || "Produit"}
    >
      <h3 className="mb-1 text-base font-semibold text-zinc-900">
        {product.title || "Sans titre"}
      </h3>

      {product.price && <div className="mb-2 text-sm font-semibold text-teal-700">{product.price}</div>}

      {product.description && <p className="mb-3 text-sm leading-5 text-zinc-600">{product.description}</p>}

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
        >
          Détails
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
          onClick={handleAddToCart}
        >
          Ajouter
        </button>
      </div>
    </article>
  );
}
