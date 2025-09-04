import React, { useContext } from "react";


import { CartContext, CartContextType } from "../contexts/CartContext";





type BannerAttr = { data?: { attributes?: { url?: string } } };



type Product = {

  id?: number | string;

  title?: string;

  price?: number | string;


  description?: string;


  banner?: { url?: string };


  attributes?: Record<string, unknown> & { banner?: BannerAttr; title?: string; price?: number };

};



export default function ProductItem({ product }: { product: Product }) {


  const { cart, setCart } = useContext(CartContext) as CartContextType;





  const handleAddToCart = () => {


    const image = product.banner?.url || (product.attributes?.banner as BannerAttr | undefined)?.data?.attributes?.url;


    const item = {


      id: product.id,


      title: (product.title || product.attributes?.title) as string,


      price: Number(product.price || product.attributes?.price),


      image,


    };


    setCart([...cart, item]);

  };



  return (

    <article

      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"

      aria-label={product.title || "Produit"}

    >

      <h3 className="mb-1 text-base font-semibold text-zinc-900">


        {(product.title || product.attributes?.title) as string || "Sans titre"}

      </h3>




      {(product.price || product.attributes?.price) && (


        <div className="mb-2 text-sm font-semibold text-teal-700">


          {product.price || product.attributes?.price}


        </div>


      )}




      {product.description && (


        <p className="mb-3 text-sm leading-5 text-zinc-600">


          {product.description}


        </p>


      )}



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