"use client";

import React from "react";
import Image from "next/image";
import { Sun, Zap, BatteryCharging } from "lucide-react";

export default function SolaireSolution() {
  return (
    <section id="solaire" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Image à gauche */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-64 sm:h-80 lg:h-96">
              <Image
                src="/solaire.png"
                alt="Solution de recharge solaire ELEC'CONNECT"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Contenu à droite */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">
              Recharge Solaire
              <span className="block text-emerald-600">Économique et Écologique</span>
            </h2>
            
            <p className="text-lg text-slate-600">
              Optez pour une solution de recharge véritablement verte avec nos installations solaires dédiées aux bornes de recharge pour véhicules électriques.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Sun className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Énergie 100% renouvelable</h3>
                  <p className="text-slate-600">Produisez votre propre électricité verte et réduisez votre empreinte carbone.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Zap className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Économies garanties</h3>
                  <p className="text-slate-600">Réduisez jusqu'à 70% votre facture d'électricité pour la recharge de votre véhicule.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BatteryCharging className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800">Stockage intelligent</h3>
                  <p className="text-slate-600">Systèmes de batterie pour une autonomie optimale, même la nuit.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <a 
                href="/solar-solution" 
                className="btn btn-success btn-wide text-white"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
