import React from 'react';
import Image from 'next/image';
import { Sun, Zap, BatteryCharging, CheckCircle, ArrowRight } from 'lucide-react';

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
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative w-full aspect-video sm:aspect-square lg:aspect-video group">
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-emerald-100/50">
                  <Image
                    src="/solaire2.png"
                    alt="Solution de recharge solaire ELEC'CONNECT"
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
                <p className="text-slate-600 mt-2">Des installations conformes et performantes réalisées par des partenaires certifiés.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* RGE */}
                <div className="group rounded-xl border border-slate-100 bg-slate-50/50 p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="relative w-36 h-14 sm:w-44 sm:h-16 flex-shrink-0">
                    <Image src="/rge.png" alt="Certification RGE" fill className="object-contain" sizes="(max-width: 640px) 40vw, 20vw" priority />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Certification</p>
                    <p className="font-semibold text-slate-900">RGE</p>
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
          <div className="mt-16 rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-[1.05fr,0.95fr]">
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                    <Zap className="h-4 w-4" /> Offre exclusive Elec'Connect
                  </span>
                  <h3 className="mt-6 text-3xl md:text-4xl font-bold leading-tight">Carport solaire clé en main + borne intelligente</h3>
                  <p className="mt-4 text-base text-slate-200">
                    Profitez d'un accompagnement complet pour produire votre propre énergie, recharger votre véhicule sans contrainte
                    et valoriser votre habitation grâce à un carport au design premium.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
                      <p className="text-sm text-slate-200">Carport aluminium haute résistance avec intégration photovoltaïque</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
                      <p className="text-sm text-slate-200">Borne connectée 7 kW offerte et pilotage intelligent de la charge</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
                      <p className="text-sm text-slate-200">Suivi énergétique en temps réel via application mobile dédiée</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
                      <p className="text-sm text-slate-200">Gestion administrative, démarches d'aides et installation certifiée</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-emerald-200/80">Pack complet à partir de</p>
                    <p className="text-4xl font-extrabold text-white">9 990€</p>
                    <p className="text-sm text-emerald-100/80">Financement possible en 36x*. Maintenance incluse la 1ère année.</p>
                  </div>
                  <a
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
                  >
                    Je profite de l'offre
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-2 text-xs text-slate-400">*Sous réserve d'éligibilité. Étude personnalisée et visite technique incluses.</p>
              </div>
              <div className="relative bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20" />
                <div className="relative flex h-full items-center justify-center p-10">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 -z-10 rounded-[40px] bg-emerald-500/20 blur-3xl" />
                    <div className="relative mx-auto aspect-[4/5] w-full max-w-[360px] overflow-visible">
                      <div className="absolute inset-x-4 top-0 rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl">
                        <div className="relative h-full w-full">
                          <Image
                            src="/carport-voiture.png"
                            alt="Carport solaire Elec'Connect"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 80vw, 30vw"
                            priority
                          />
                        </div>
                      </div>
                      <div className="absolute -bottom-10 -left-6 w-40 sm:w-48 rounded-3xl border border-white/10 bg-slate-900/60 p-1 shadow-xl backdrop-blur">
                        <div className="relative h-40 w-full sm:h-48">
                          <Image
                            src="/borne-solar-solution.png"
                            alt="Borne de recharge Elec'Connect"
                            fill
                            className="rounded-2xl object-cover"
                            sizes="(max-width: 1024px) 40vw, 18vw"
                          />
                        </div>
                      </div>
                      <div className="absolute -right-8 top-1/2 w-32 -translate-y-1/2 rounded-3xl border border-white/10 bg-slate-900/60 p-1 shadow-xl backdrop-blur sm:w-36">
                        <div className="relative h-48 w-full sm:h-56">
                          <Image
                            src="/charge-solar-solution.png"
                            alt="Accessoires de charge solaire"
                            fill
                            className="rounded-2xl object-cover"
                            sizes="(max-width: 1024px) 40vw, 16vw"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
