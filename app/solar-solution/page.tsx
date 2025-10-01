import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Zap, BatteryCharging, CheckCircle } from "lucide-react";

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
                Découvrez comment l’énergie solaire peut révolutionner votre façon de recharger votre véhicule électrique, tout en réduisant votre empreinte carbone et vos coûts énergétiques.
              </p>
            </div>
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative w-full aspect-video sm:aspect-square lg:aspect-video group">
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-emerald-100/50">
                  <Image
                    src="/solaire2.png"
                    alt="Solution de recharge solaire ELEC’CONNECT"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-emerald-300/40 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partenariats & Certifications */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <p className="text-sm uppercase tracking-wider text-emerald-600 font-semibold">Confiance & Qualité</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">Nos engagements</h3>
                <p className="text-slate-600 mt-2">En partenariat avec SSP pour des installations conformes et performantes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* SSP */}
                <div className="group rounded-2xl border-2 border-slate-100 bg-white p-6 flex flex-col items-center text-center hover:border-emerald-100 hover:shadow-md transition-all duration-300 h-full">
                  <div className="relative w-full h-20 mb-4 flex-shrink-0">
                    <Image 
                      src="/ssp.jpeg" 
                      alt="Partenaire SSP" 
                      fill 
                      className="object-contain" 
                      sizes="(max-width: 640px) 40vw, 20vw" 
                      priority 
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-slate-500">Partenaire officiel</p>
                    <p className="font-bold text-lg text-slate-800">SSP</p>
                  </div>
                </div>

                {/* RGE */}
                <div className="group rounded-2xl border-2 border-slate-100 bg-white p-6 flex flex-col items-center text-center hover:border-emerald-100 hover:shadow-md transition-all duration-300 h-full">
                  <div className="relative w-full h-20 mb-4 flex-shrink-0">
                    <Image 
                      src="/rge.png" 
                      alt="Certification RGE" 
                      fill 
                      className="object-contain" 
                      sizes="(max-width: 640px) 40vw, 20vw" 
                      priority 
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-slate-500">Certification</p>
                    <p className="font-bold text-lg text-slate-800">Reconnu Garant de l’Environnement</p>
                  </div>
                </div>

                {/* Qualifelec */}
                <div className="group rounded-2xl border-2 border-slate-100 bg-white p-6 flex flex-col items-center text-center hover:border-emerald-100 hover:shadow-md transition-all duration-300 h-full">
                  <div className="relative w-full h-20 mb-4 flex-shrink-0">
                    <Image 
                      src="/qualifelec.png" 
                      alt="Certification Qualifelec" 
                      fill 
                      className="object-contain" 
                      sizes="(max-width: 640px) 40vw, 20vw" 
                      priority 
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-slate-500">Certification</p>
                    <p className="font-bold text-lg text-slate-800">Qualifelec</p>
                    <p className="text-xs text-slate-500 mt-1">Qualité des installations électriques</p>
                  </div>
                </div>
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
              <h3 className="text-xl font-semibold text-slate-800 mb-3">1. Captation de l’énergie solaire</h3>
              <p className="text-slate-600">
                Des panneaux solaires installés sur votre toit, dans votre jardin ou sur des structures dédiées captent l’énergie solaire grâce à leurs cellules photovoltaïques.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">2. Conversion en électricité</h3>
              <p className="text-slate-600">
                L’énergie solaire captée est transformée en électricité, qui peut ensuite alimenter directement votre borne de recharge Elec’Connect.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <BatteryCharging className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">3. Alimentation de la borne</h3>
              <p className="text-slate-600">
                L’électricité produite est acheminée directement vers votre borne de recharge pour alimenter votre voiture en temps réel.
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
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Économie sur les coûts d’électricité</h3>
              <p className="text-slate-600 mb-4">
                Utiliser l’énergie solaire pour recharger votre véhicule réduit considérablement vos factures d’électricité. Vous pouvez ainsi recharger votre voiture pour une fraction du coût traditionnel ou même gratuitement, selon l’ensoleillement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">Réduction de l’empreinte carbone</h3>
              <p className="text-slate-600 mb-4">
                En optant pour l’énergie solaire, vous réduisez l’empreinte carbone de chaque recharge, contribuant à une mobilité véritablement durable. Coupler la borne Elec’ Connect à une installation photovoltaïque réduit considérablement les émissions de CO₂.
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
                En couplant bornes de recharge et photovoltaïque, vous valorisez votre propriété tout en investissant dans des technologies propres et innovantes. Avec la longévité des panneaux solaires et la fiabilité des bornes Elec’ Connect, c’est un choix durable et avantageux sur le long terme.
              </p>
            </div>
          </div>

          {/* Titre des offres exclusives */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Nos Offres Exclusives</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mb-12"></div>
          </div>

          {/* Offre exclusive carport solaire */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
            <div className="absolute -top-20 -right-32 h-64 w-64 rounded-full bg-emerald-500/40 blur-3xl" aria-hidden />
            <div className="relative flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wide uppercase text-emerald-100">
                  Offre exclusive
                </div>
                <h3 className="mt-6 text-3xl font-bold md:text-4xl">Carport solaire 3 kWh + borne clé en main</h3>
                <p className="mt-4 text-lg text-slate-200">
                  Profitez d’une solution complète combinant protection de votre véhicule, production d’énergie solaire et borne de recharge intelligente installée par nos experts certifiés.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm font-semibold uppercase tracking-widest text-emerald-200">Tarif</div>
                    <div className="mt-2 text-4xl font-extrabold">16 499 € TTC</div>
                    <div className="text-sm text-slate-300">Hors VRD - Installation complète incluse</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm font-semibold uppercase tracking-widest text-emerald-200">Équipement</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-300" />
                        Carport solaire premium 3 kWH
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-300" />
                        Borne Elec’Connect 7 kW
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-300" />
                        Installation clé en main
                      </li>
                    </ul>
                  </div>
                </div>


              </div>

              <div className="w-full lg:w-1/2 bg-slate-800/40 p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative col-span-2 h-52 overflow-hidden rounded-2xl sm:h-64 lg:h-72">
                    <Image
                      src="/carport-voiture.png"
                      alt="Carport solaire Elec’Connect"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="relative h-40 overflow-hidden rounded-2xl sm:h-44">
                    <Image
                      src="/charge-solar-solution.png"
                      alt="Borne de recharge Elec’Connect"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative h-40 overflow-hidden rounded-2xl sm:h-44">
                    <Image
                      src="/borne-solar-solution.png"
                      alt="Détail de la borne Elec’Connect"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carte d’offre spéciale */}
          <div className="mt-16 relative overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
            <div className="absolute -bottom-20 -left-32 h-64 w-64 rounded-full bg-emerald-100 blur-3xl" aria-hidden />
            <div className="relative flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12">
                <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold tracking-wide uppercase text-emerald-600">
                  Offre exclusive
                </div>
                <h3 className="mt-6 text-3xl font-bold md:text-4xl">Installation en toiture 3 kWh</h3>
                <p className="mt-4 text-lg text-slate-600">
                  Optez pour une installation solaire discrète sur votre toiture avec une borne de recharge 7 kW offerte et la mise en service réalisée par nos équipes certifiées (après validation technique).
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="text-sm font-semibold uppercase tracking-widest text-emerald-600">Tarif</div>
                    <div className="mt-2 text-4xl font-extrabold text-emerald-700">6 990 € TTC</div>
                    <div className="text-sm text-emerald-700">Hors VRD - Borne et installation offertes*</div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5">
                    <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">Équipement</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                        Panneaux photovoltaïques 3 kWh en toiture
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                        Borne Elec’Connect 7 kW offerte
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                        Installation offerte (après validation technique)
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="mt-6 text-sm text-slate-500">*Offre valable après validation technique de votre installation.</p>
              </div>

              <div className="w-full lg:w-1/2 bg-slate-50 p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative col-span-2 h-52 overflow-hidden rounded-2xl sm:h-64 lg:h-72">
                    <Image
                      src="/solaire3.png"
                      alt="Installation solaire en toiture"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div className="relative h-40 overflow-hidden rounded-2xl sm:h-44">
                    <Image
                      src="/borne-solar-solution.png"
                      alt="Borne de recharge Elec’Connect"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative h-40 overflow-hidden rounded-2xl sm:h-44">
                    <Image
                      src="/charge-solar-solution.png"
                      alt="Détail installation photovoltaïque"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carte d’offre spéciale */}
          <div className="mt-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl overflow-hidden shadow-xl relative">
            <div className="p-8 md:p-10 lg:flex items-center pt-16 md:pt-16">
              <div className="lg:w-2/3">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white mb-4">
                  <Zap className="w-4 h-4 mr-2" />
                  OFFRE EXCLUSIVE
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Borne de Recharge 7 kW à 0€</h3>
                <p className="text-emerald-100 mb-6">
                  Avec l’installation de panneaux solaires d’une puissance minimale de 3 kWh, la borne de recharge 7 kW est offerte
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
            <Link
              href="/#contact"
              className="btn btn-success btn-lg text-white"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
