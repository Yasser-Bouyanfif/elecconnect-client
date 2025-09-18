"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowRight, Heart } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const mockProducts = [
  {
    id: 1,
    name: "Borne AC 7kW Résidentielle",
    price: 890,
    location: "Installation incluse",
    banner: { url: "/photos/163036/pexels-photo-163036.jpeg?auto=compress&cs=tinysrgb&w=400" },
    rating: 4.9,
    reviews: 156
  },
  {
    id: 2,
    name: "Borne DC 50kW Rapide",
    price: 15900,
    location: "Entreprises",
    banner: { url: "/photos/4855481/pexels-photo-4855481.jpeg?auto=compress&cs=tinysrgb&w=400" },
    rating: 4.8,
    reviews: 89
  },
  {
    id: 3,
    name: "Wallbox 11kW Pro",
    price: 1290,
    location: "Copropriétés",
    banner: { url: "/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400" },
    rating: 4.9,
    reviews: 234
  },
  {
    id: 4,
    name: "Borne AC 22kW Triphasée",
    price: 1890,
    location: "Usage professionnel",
    banner: { url: "/photos/92866/pexels-photo-92866.jpeg?auto=compress&cs=tinysrgb&w=400" },
    rating: 4.7,
    reviews: 67
  },
  {
    id: 5,
    name: "Borne Murale 3.7kW",
    price: 590,
    location: "Particuliers",
    banner: { url: "/photos/163036/pexels-photo-163036.jpeg?auto=compress&cs=tinysrgb&w=400" },
    rating: 4.8,
    reviews: 123
  }
];

export default function ProductSection() {
  const SERVER_URL = "https://images.pexels.com";

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Nos solutions recommandées
          </h2>
          <p className="text-slate-600">
            Découvrez notre sélection de bornes adaptées à tous vos besoins.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="product-swiper"
        >
          {mockProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="relative">
                  <img 
                    src={`${SERVER_URL}${product.banner.url}`}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                    <Heart className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-1 text-sm">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    {product.location}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium text-slate-800">
                        {product.rating}
                      </span>
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-xs text-slate-500">
                        {product.reviews} avis
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-slate-800">
                        {product.price.toLocaleString()}€
                      </span>
                      <span className="text-xs text-slate-500 ml-1">HT</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}