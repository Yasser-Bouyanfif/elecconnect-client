import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const newsItems = [
  {
    id: 1,
    title: "Nouvelles aides pour l'installation de bornes",
    description: "Découvrez les dernières subventions disponibles pour votre projet.",
    date: "15 Novembre 2024",
    image: "https://images.pexels.com/photos/163036/pexels-photo-163036.jpeg?auto=compress&cs=tinysrgb&w=400&h=250"
  },
  {
    id: 2,
    title: "Guide complet de la recharge électrique",
    description: "Tout savoir sur les différents types de bornes et leur utilisation.",
    date: "8 Novembre 2024",
    image: "https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400&h=250"
  },
  {
    id: 3,
    title: "Installation en copropriété simplifiée",
    description: "Les étapes clés pour équiper votre résidence en bornes de recharge.",
    date: "2 Novembre 2024",
    image: "https://images.pexels.com/photos/4855481/pexels-photo-4855481.jpeg?auto=compress&cs=tinysrgb&w=400&h=250"
  },
  {
    id: 4,
    title: "Maintenance préventive des bornes",
    description: "Conseils pour optimiser la durée de vie de votre installation.",
    date: "28 Octobre 2024",
    image: "https://images.pexels.com/photos/92866/pexels-photo-92866.jpeg?auto=compress&cs=tinysrgb&w=400&h=250"
  }
];

export default function NewsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Actualités et conseils
          </h2>
          <p className="text-slate-600">
            Restez informé des dernières nouveautés et conseils pour votre mobilité électrique.
          </p>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="news-swiper"
        >
          {newsItems.map((item) => (
            <SwiperSlide key={item.id}>
              <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-2 text-sm leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <time className="text-xs text-slate-500">
                    {item.date}
                  </time>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}