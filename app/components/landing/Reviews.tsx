"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// >>> modules pour l'effet "cards"
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

import Image from "next/image";
import { Star as LucideStar } from "lucide-react";

type Review = {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  review: string;
  image?: string; // optionnel: image avatar
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "Particulier",
    location: "Paris 15e",
    rating: 5,
    review:
      "Installation parfaite de ma borne à domicile. L'équipe est très professionnelle et le service après-vente excellent.",
    image: "/woman.jpg",
  },
  {
    id: 2,
    name: "Jean Martin",
    role: "Copropriété",
    location: "Boulogne-Billancourt",
    rating: 5,
    review:
      "Très satisfait de l'installation en copropriété. Processus simple et équipe compétente.",
    image: "/man.jpg",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    role: "Entreprise",
    location: "La Défense",
    rating: 5,
    review:
      "Service professionnel pour notre parking d'entreprise. Installation rapide et propre.",
    image: "/woman.jpg",
  },
  {
    id: 4,
    name: "Pierre Durand",
    role: "Particulier",
    location: "Versailles",
    rating: 5,
    review:
      "Excellent accompagnement du devis à l'installation. Je recommande vivement ELEC'CONNECT.",
    image: "/man.jpg",
  },
];

export default function Testimonials() {
  return (
    <section
      className="py-20 bg-[linear-gradient(135deg,_#ECFFF6_0%,_#E8FFF0_40%,_#E9FFF7_70%,_#F4FFF9_100%)]"
    >
      <div className="w-full px-4 sm:px-8 lg:px-16">
        {/* Grande card VERTE (même gabarit qu'avant) */}
        <div className="relative rounded-[32px] p-[3px] bg-[linear-gradient(135deg,#b0ff7c_0%,#87f072_40%,#49d86a_100%)] shadow-[0_25px_80px_-20px_rgba(34,197,94,0.55),0_12px_30px_rgba(0,0,0,0.1)]">
          <div className="relative rounded-[28px] bg-[linear-gradient(180deg,#f6fff9_0%,#effff4_15%,#eaffef_60%,#f8fff9_100%)] p-10 border-[3px] border-white/60 shadow-[inset_0_2px_0_rgba(255,255,255,0.8)]">
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-white/30 [mask-image:linear-gradient(to_bottom,white,transparent_35%)]"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-stretch gap-10">
              {/* Colonne GAUCHE : titre + note */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
                    <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#EA4335]">
                      G
                    </span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-700">
                      Avis Google
                    </div>
                    <div className="text-sm text-slate-500">
                      Nos clients nous recommandent
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
                  Ce que disent nos clients
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Découvrez les retours authentiques laissés par notre
                  communauté. Votre confiance est au cœur de notre service.
                </p>

                <div className="mt-6">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-5xl font-bold text-slate-900">4.9</span>
                    <span className="text-sm font-medium uppercase tracking-wide text-emerald-600">
                      Note moyenne
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <LucideStar
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">
                    Basé sur plus de 200 avis clients vérifiés.
                  </p>
                </div>
              </div>

              {/* Colonne DROITE : Swiper effet "cards" intégré */}
              <div className="w-full lg:w-[520px]">
                <Swiper
                  effect="cards"
                  grabCursor
                  modules={[EffectCards, Pagination]}
                  pagination={{ clickable: true }}
                  className="md:w-[450px] md:h-[350px] w-[90%] h-[320px] mx-auto"
                >
                  {reviews.map((d) => (
                    <SwiperSlide
                    key={d.id}
                    className="bg-white rounded-[22px] overflow-hidden"
                    style={{
                      boxShadow:
                        "0 26px 44px -18px rgba(2,6,23,0.25), 0 12px 24px rgba(2,6,23,0.08)",
                      border: "2px solid rgba(226,232,240,1)", // slate-200
                    }}
                  >
                    <div className="w-[86%] mx-auto h-full flex flex-col py-8">
                      {/* HAUT : étoiles + note */}
                      <div className="flex items-center justify-center gap-1.5 mb-8">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={`w-7 h-7 md:w-8 md:h-8 ${i < d.rating ? "text-yellow-500" : "text-slate-300"}`}
                            aria-hidden="true"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-3 text-base md:text-lg font-semibold text-slate-700">
                          {d.rating}/5
                        </span>
                      </div>
                  
                      {/* MILIEU : commentaire centré verticalement */}
                      <div className="flex-1 flex items-center justify-center text-center">
                        <p className="max-w-[42ch] text-[13px] sm:text-sm md:text-[15px] font-semibold text-slate-800 leading-relaxed">
                          {d.review}
                        </p>
                      </div>
                  
                      {/* BAS : auteur */}
                      <div className="flex items-center gap-4 mt-8">
                        {d.image ? (
                          <Image
                            src={d.image}
                            alt={d.name}
                            width={56}
                            height={56}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-slate-200" />
                        )}
                  
                        <div>
                          <p className="text-[15px] sm:text-lg font-semibold text-slate-900">
                            {d.name}
                          </p>
                          <p className="text-slate-500 text-xs sm:text-sm">
                            {d.role} • {d.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                 ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
