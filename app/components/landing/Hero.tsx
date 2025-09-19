"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Wash gris excentré à GAUCHE (plus clair) */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0 left-0
          w-[58%] md:w-[52%]
          bg-gradient-to-r from-slate-200/30 via-slate-200/10 to-transparent
        "
      />
      {/* Streak brillant (plus discret) */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0
          left-[26%] md:left-[28%]
          w-[8%] md:w-[6%]
          bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)]
          opacity-25
          blur-[1px]
        "
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Solutions de recharge électrique
            <span className="block text-emerald-600">pour votre mobilité</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            ELEC'CONNECT, votre partenaire de confiance pour l'installation professionnelle
            de bornes de recharge pour véhicules électriques.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact">
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer">
              <span>Devis gratuit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            </a>
            <a href="/shop">
            <button className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:border-emerald-600 hover:text-emerald-600 transition-colors cursor-pointer">
              Notre boutique
            </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
