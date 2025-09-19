import React from 'react';
import Image from 'next/image';
import { Sun, Zap, BatteryCharging, CheckCircle } from 'lucide-react';

export default function SolutionsSolaires() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Optimisez votre Recharge Électrique
                <span className="block text-emerald-600">avec des Bornes Couplées à des Installations Photovoltaïques</span>
              </h1>
              <p className="text-lg text-slate-600">
                Découvrez comment l'énergie solaire peut révolutionner votre façon de recharger votre véhicule électrique, tout en réduisant votre empreinte carbone et vos coûts énergétiques.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="relative w-full h-80 lg:h-96 group">
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-emerald-100/50">
                  <Image
                    src="/solaire2.png"
                    alt="Solution de recharge solaire ELEC'CONNECT"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-emerald-300/40 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Comment Ça Marche ?</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Sun className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">1. Captation de l'énergie solaire</h3>
              <p className="text-slate-600">
                Des panneaux solaires installés sur votre toit, dans votre jardin ou sur des structures dédiées captent l'énergie solaire grâce à leurs cellules photovoltaïques.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">2. Conversion en électricité</h3>
              <p className="text-slate-600">
                L'énergie solaire captée est transformée en électricité, qui peut ensuite alimenter directement votre borne de recharge Elec'Connect.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <BatteryCharging className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">3. Alimentation de la borne</h3>
              <p className="text-slate-600">
                L'électricité produite est acheminée directement vers votre borne de recharge pour alimenter votre voiture en temps réel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Les Avantages</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Économie sur les coûts d'électricité</h3>
              <p className="text-slate-600 mb-4">
                Utiliser l'énergie solaire pour recharger votre véhicule réduit considérablement vos factures d'électricité. Vous pouvez ainsi recharger votre voiture pour une fraction du coût traditionnel ou même gratuitement, selon l'ensoleillement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Réduction de l'empreinte carbone</h3>
              <p className="text-slate-600 mb-4">
                En optant pour l'énergie solaire, vous réduisez l'empreinte carbone de chaque recharge, contribuant à une mobilité véritablement durable. Coupler la borne Elec' Connect à une installation photovoltaïque réduit considérablement les émissions de CO₂.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Autonomie énergétique</h3>
              <p className="text-slate-600 mb-4">
                Avec votre propre installation solaire, vous devenez moins dépendant des réseaux électriques publics et des fluctuations de tarifs. Cela vous permet de recharger votre véhicule quand vous le souhaitez, même en cas de pic de demande.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Investissement durable</h3>
              <p className="text-slate-600 mb-4">
                En couplant bornes de recharge et photovoltaïque, vous valorisez votre propriété tout en investissant dans des technologies propres et innovantes. Avec la longévité des panneaux solaires et la fiabilité des bornes Elec' Connect, c'est un choix durable et avantageux sur le long terme.
              </p>
            </div>
          </div>

          {/* Carte d'offre spéciale */}
          <div className="mt-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl overflow-hidden shadow-xl relative">
            <div className="p-8 md:p-10 lg:flex items-center pt-16 md:pt-16">
              <div className="lg:w-2/3">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white mb-4">
                  <Zap className="w-4 h-4 mr-2" />
                  OFFRE EXCLUSIVE
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Borne de Recharge 7 kW à 0€</h3>
                <p className="text-emerald-100 mb-6">
                  Avec l'installation de panneaux solaires d'une puissance minimale de 3 kWc, la borne de recharge 7 kW est offerte
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-emerald-50">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-200" />
                    Installation incluse
                  </li>
                  <li className="flex items-center text-emerald-50">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-200" />
                    Compatible avec tous les véhicules électriques
                  </li>
                  <li className="flex items-center text-emerald-50">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-200" />
                    Pilotage intelligent de la charge
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/3 mt-8 lg:mt-0 lg:pl-8">
                <div className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/30 text-center transform hover:scale-105 transition-transform duration-300 shadow-2xl">
                  <div className="text-6xl font-extrabold text-white mb-2 drop-shadow-lg">0€</div>
                  <div className="text-white/90 text-lg line-through font-medium">À partir de 1299€</div>
                  <div className="text-white/80 text-sm mt-1">(Prix selon configuration)</div>
                  <div className="mt-3 text-emerald-100 font-semibold animate-pulse">OFFRE EXCEPTIONNELLE</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex justify-end">
            <a 
              href="/#contact" 
              className="btn btn-success btn-lg text-white"
            >
              Demander un devis
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
