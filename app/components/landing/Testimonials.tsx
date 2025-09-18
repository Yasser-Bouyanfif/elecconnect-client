"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
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
    <section className="py-20 bg-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Stats */}
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ce que disent nos clients
            </h2>
            
            <div className="mb-8">
              <div className="text-5xl font-bold mb-3">4.9</div>
              <div className="text-slate-300 text-lg mb-3">Note moyenne</div>
              <div className="flex space-x-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-slate-300">
                Basé sur plus de 200 avis clients
              </div>
            </div>
          </div>

          {/* Right side - Testimonials Carousel */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="testimonials-swiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex space-x-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="text-slate-700 mb-6 leading-relaxed text-sm">
                      "{testimonial.comment}"
                    </p>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{testimonial.name}</div>
                        <div className="text-xs text-slate-500">{testimonial.role} - {testimonial.location}</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}