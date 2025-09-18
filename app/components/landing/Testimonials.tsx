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

const GoogleLogo = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-8 w-8"
    viewBox="0 0 256 262"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M255.68 131.14c0-10.89-.95-21.35-2.75-31.34H130.98v59.42h69.74a59.6 59.6 0 0 1-25.89 39.14l-.24 1.62 37.56 29.1 2.6.26c23.88-22 37.93-54.42 37.93-98.2"
    />
    <path
      fill="#34A853"
      d="M130.98 261.1c34.41 0 63.32-11.37 84.43-30.78l-40.2-31.16c-10.8 7.42-24.69 12.6-44.23 12.6-33.85 0-62.57-22.72-72.83-54.06l-1.5.12-39.34 30.45-.52 1.47c20.89 41.54 64.13 71.36 114.19 71.36"
    />
    <path
      fill="#FBBC05"
      d="M58.15 157.69a78.3 78.3 0 0 1-4.1-25.09c0-8.75 1.47-17.2 3.95-25.09l-.07-1.68-39.82-30.96-1.3.62A130.92 130.92 0 0 0 .39 132.6c0 20.96 5.02 40.76 14 58.22l43.76-33.13"
    />
    <path
      fill="#EA4335"
      d="M130.98 49.64c23.95 0 40.06 10.34 49.27 19.01l35.94-35.08C194.2 12.03 165.39.9 130.98.9 80.92.9 37.68 30.72 16.79 72.26l43.76 33.12c10.26-31.33 38.98-55.74 70.43-55.74"
    />
  </svg>
);

export default function Testimonials() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
          {/* Left side - Rating card */}
          <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-xl lg:mx-0 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <GoogleLogo />
                </div>
                <div className="text-sm font-semibold text-slate-500">Avis Google</div>
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Nos clients nous recommandent</h2>
              <p className="mt-3 text-sm text-slate-600">Ce que disent nos clients.</p>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-8">
              <div className="flex items-end gap-4">
                <span className="text-6xl font-bold text-slate-900">4.9</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Note moyenne</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-500">Basée sur plus de 200 avis clients vérifiés.</p>
            </div>
          </div>

          {/* Right side - Testimonials Carousel */}
          <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg lg:p-8">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              className="testimonials-swiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
                    <div>
                      <div className="mb-3 flex space-x-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">&ldquo;{testimonial.comment}&rdquo;</p>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600">
                        <span className="text-sm font-medium text-white">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-xs text-slate-500">{testimonial.role} • {testimonial.location}</div>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}