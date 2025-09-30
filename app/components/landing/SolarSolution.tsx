"use client";

import Image from "next/image";
import { ArrowUpRight, CheckCircle2, HandCoins, PiggyBank } from "lucide-react";

export default function SolarSolution() {
  return (
    <section
      id="financement"
      className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/40 to-slate-100 py-20 text-slate-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                Financements & aides publiques
              </span>
              <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                Boostez votre projet de borne de recharge grâce aux aides ADVENIR et au crédit d’impôt
              </h2>
              <p className="text-lg text-slate-600">
                ELEC’CONNECT vous accompagne dans l’obtention des financements disponibles pour réduire considérablement le coût d’installation de votre infrastructure de recharge.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-emerald-100/70">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <PiggyBank className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-slate-900">Subvention ADVENIR</h3>
                  <p className="text-slate-600">
                    Bénéficiez d’une prise en charge jusqu’à 50% du coût d’installation et jusqu’à 1 500 € de subvention pour les entreprises et copropriétés.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-emerald-100/70">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <HandCoins className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-slate-900">Crédit d’impôt</h3>
                  <p className="text-slate-600">
                    Profitez d’un crédit d’impôt pouvant couvrir 75% des dépenses d’acquisition, dans la limite de 500 € par système de charge pour votre résidence principale ou secondaire.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-emerald-500" />
                <p className="text-base text-slate-600">
                  Nous gérons le dossier administratif, le suivi des subventions et la conformité de votre installation pour que
                  vous puissiez vous concentrer sur votre projet.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://advenir.mobi/je-definis-mon-projet/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                Vérifiez votre éligibilité ADVENIR
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </a>
              <span className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm text-slate-600 ring-1 ring-emerald-100">
                Notre équipe vous accompagne à chaque étape.
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-xl shadow-emerald-100">
                <div className="relative h-56 w-full overflow-hidden rounded-t-3xl sm:h-64">
                  <Image
                    src="/advenir.png"
                    alt="Programme de financement ADVENIR"
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-110"
                    sizes="(min-width: 1280px) 360px, (min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    priority
                  />
                </div>
                <div className="space-y-3 p-7">
                  <h3 className="text-xl font-semibold text-slate-900">Programme ADVENIR</h3>
                  <p className="text-base text-slate-600">
                    Une aide dédiée aux infrastructures de recharge pour véhicules électriques, accessible aux copropriétés, entreprises et collectivités.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-xl shadow-emerald-100">
                <div className="relative h-56 w-full overflow-hidden rounded-t-3xl sm:h-64">
                  <Image
                    src="/credit-impot.png"
                    alt="Crédit d’impôt pour borne de recharge"
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-110"
                    sizes="(min-width: 1280px) 360px, (min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="space-y-3 p-7">
                  <h3 className="text-xl font-semibold text-slate-900">Crédit d’impôt</h3>
                  <p className="text-base text-slate-600">
                    Un dispositif fiscal pour encourager l’installation de bornes de recharge à domicile, applicable une fois par résidence principale ou secondaire.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-base text-emerald-700">
              <p className="leading-relaxed">
                ELEC’CONNECT se charge d’évaluer votre éligibilité, d’estimer les montants disponibles et de constituer le dossier auprès des organismes compétents. Nous veillons à ce que votre installation respecte les exigences techniques ouvrant droit aux financements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
