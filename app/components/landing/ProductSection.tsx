"use client";

import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1324 }, items: 3, slidesToSlide: 1 },
  tablet:  { breakpoint: { max: 1324, min: 764  }, items: 2, slidesToSlide: 1 },
  mobile:  { breakpoint: { max: 764,  min: 0    }, items: 1, slidesToSlide: 1 },
};

// Tu peux garder tes données réelles ici.
// J’utilise ton mock mais toutes les images pointent vers la même URL souhaitée.
const IMAGE_URL = "https://www.e-totem.eu/wp-content/uploads/2025/05/Borne-de-recharge-e-Smart.jpg";
const products = [
  { id: 1, name: "Borne AC 7kW Résidentielle", price: 890,   location: "Installation incluse" },
  { id: 2, name: "Borne DC 50kW Rapide",       price: 15900, location: "Entreprises" },
  { id: 3, name: "Wallbox 11kW Pro",           price: 1290,  location: "Copropriétés" },
  { id: 4, name: "Borne AC 22kW Triphasée",    price: 1890,  location: "Usage professionnel" },
  { id: 5, name: "Borne Murale 3.7kW",         price: 590,   location: "Particuliers" },
];

// Flèches custom : blanches sur fond noir
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
            {products.map((p) => (
              <div key={p.id} className="m-0">
                <div className="relative h-[400px]">
                  <Image
                    src={IMAGE_URL}
                    alt={p.name}
                    fill
                    unoptimized
                    sizes="(max-width: 1324px) 90vw, 20vw"
                    className="object-cover rounded-xl"
                    priority={p.id <= 2}
                  />
                  <div className="absolute inset-0 rounded-xl bg-black/20" />
                </div>

                <p className="text-base md:text-lg font-semibold text-slate-900 mt-4">
                  {p.price.toLocaleString()}€ <span className="text-xs text-slate-500">HT</span>
                </p>
                <h3 className="text-slate-800 font-medium md:font-semibold text-[15px] md:text-base">
                  {p.name}
                </h3>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
