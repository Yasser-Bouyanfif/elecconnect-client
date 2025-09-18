"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "Particulier",
    location: "Paris 15e",
    rating: 5,
    comment: "Installation parfaite de ma borne à domicile. L'équipe est très professionnelle et le service après-vente excellent.",
    avatar: "MD"
  },
  {
    id: 2,
    name: "Jean Martin",
    role: "Copropriété",
    location: "Boulogne-Billancourt",
    rating: 5,
    comment: "Très satisfait de l'installation en copropriété. Processus simple et équipe compétente.",
    avatar: "JM"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    role: "Entreprise",
    location: "La Défense",
    rating: 5,
    comment: "Service professionnel pour notre parking d'entreprise. Installation rapide et propre.",
    avatar: "SL"
  },
  {
    id: 4,
    name: "Pierre Durand",
    role: "Particulier",
    location: "Versailles",
    rating: 5,
    comment: "Excellent accompagnement du devis à l'installation. Je recommande vivement ELEC'CONNECT.",
    avatar: "PD"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#f5f1eb]">
      <div className="w-full px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-20">
          {/* Left side - Google rating */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-xl rounded-3xl p-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
                    <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#EA4335]">
                      G
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-slate-700">Avis Google</span>
                    <span className="text-sm text-slate-500">Nos clients nous recommandent</span>
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-6">
                  Ce que disent nos clients
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed">
                  Découvrez les retours authentiques laissés par notre communauté. Votre confiance est au cœur de notre service.
                </p>
              </div>

              <div className="mt-10">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-bold text-slate-900">4.9</span>
                  <span className="text-sm font-medium uppercase tracking-wide text-emerald-600">Note moyenne</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-500">Basé sur plus de 200 avis clients vérifiés.</p>
              </div>
            </div>
          </div>

          {/* Right side - Testimonials Carousel */}
          <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
            <div className="w-full">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1.05}
                centeredSlides
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                className="testimonials-swiper"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id} className="!flex justify-end">
                    <div className="bg-white/90 rounded-3xl px-10 py-12 shadow-xl border border-white/80 max-w-xl w-full sm:w-4/5 lg:w-3/4">
                      <div className="flex items-center gap-1 mb-5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      <p className="text-slate-700 mb-8 leading-relaxed text-base">
                        “{testimonial.comment}”
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                          <span className="text-white text-sm font-semibold">{testimonial.avatar}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm uppercase tracking-wide">{testimonial.name}</span>
                          <span className="text-xs text-slate-500">{testimonial.role} • {testimonial.location}</span>
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
    </section>
  );
}