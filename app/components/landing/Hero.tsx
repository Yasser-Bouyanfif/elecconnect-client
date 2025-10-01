"use client";

import React from "react";
import Link from "next/link";
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
              La mobilité durable,
            <span className="block text-emerald-600">pensée pour vous</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            ELEC’CONNECT, votre partenaire de confiance pour l’installation professionnelle
            de bornes de recharge pour véhicules électriques.
          </p>

          {/* Modified Button Container: Buttons are stacked (flex-col) on mobile by default, 
              then placed side-by-side (sm:flex-row) on small screens and up.
              Added w-full to buttons for clean stacking on mobile. */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#contact" className="w-full sm:w-auto">
              <button className="btn btn-success btn-lg text-white hover:text-white flex items-center gap-2 w-full justify-center">
                <span>Devis gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/shop" className="w-full sm:w-auto">
              <button className="btn btn-warning btn-lg w-full text-white hover:text-white">
                Notre boutique
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}