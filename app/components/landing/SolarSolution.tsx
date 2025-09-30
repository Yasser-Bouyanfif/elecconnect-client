"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, ExternalLink } from "lucide-react";

const perksAdvenir = [
  "Financement jusqu'à 50 % du coût d'installation",
  "Matériel et main-d'œuvre éligibles",
  "Versement rapide après validation du dossier",
];

const perksCredit = [
  "Crédit d'impôt jusqu'à 300 € par borne",
  "Cumulable avec la prime ADVENIR",
  "Applicable sur l'achat et l'installation",
];

export default function SolaireSolution() {
  return (
    <section
      id="financements"
      className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Financements disponibles
          </span>
          <h2 className="mt-6 text-4xl font-bold sm:text-5xl">
            Obtenez le meilleur pour votre borne de recharge
          </h2>
          <p className="mt-4 text-lg text-slate-200 sm:text-xl">
            Bénéficiez d'aides nationales pour financer votre installation grâce à la prime ADVENIR et au crédit d'impôt pour la recharge à domicile.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <article className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur">
            <div className="relative mb-8 overflow-hidden rounded-2xl bg-slate-900/60 ring-1 ring-white/10">
              <div className="relative h-48 w-full sm:h-56">
                <Image
                  src="/advenir.jpeg"
                  alt="Prime ADVENIR"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 520px, 100vw"
                  priority
                />
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white">Prime ADVENIR</h3>
            <p className="mt-3 text-base text-slate-200">
              Le programme national qui soutient le déploiement des bornes de recharge sur tout le territoire.
            </p>

            <ul className="mt-6 space-y-3 text-left">
              {perksAdvenir.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-slate-100">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <a
                href="https://advenir.mobi/je-definis-mon-projet/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                Accéder au formulaire officiel
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </article>

          <article className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur">
            <div className="relative mb-8 overflow-hidden rounded-2xl bg-slate-900/60 ring-1 ring-white/10">
              <div className="relative h-48 w-full sm:h-56">
                <Image
                  src="/credit-impot.png"
                  alt="Crédit d'impôt pour la recharge"
                  fill
                  className="object-contain bg-slate-950/40 p-6 transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 520px, 100vw"
                  priority
                />
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white">Crédit d'impôt</h3>
            <p className="mt-3 text-base text-slate-200">
              Profitez d'un avantage fiscal supplémentaire pour réduire le coût total de votre projet de recharge domestique.
            </p>

            <ul className="mt-6 space-y-3 text-left">
              {perksCredit.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-slate-100">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <p className="rounded-2xl bg-white/10 px-5 py-4 text-sm text-slate-100">
                Besoin d'accompagnement pour constituer votre dossier ? Notre équipe vous guide dans toutes les démarches administratives.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
