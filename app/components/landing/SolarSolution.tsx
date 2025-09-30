"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgePercent,
  CheckCircle2,
  FileCheck2,
  PiggyBank,
  ShieldCheck,
} from "lucide-react";

export default function SolaireSolution() {
  return (
    <section
      id="financements"
      className="relative overflow-hidden bg-slate-900 py-20 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_55%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8">
        <div className="w-full space-y-6 lg:w-7/12">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Aides & Financements
          </span>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            Boostez votre projet avec les aides ADVENIR et le Crédit d’impôt
          </h2>
          <p className="text-lg text-slate-200">
            Réduisez considérablement le coût de votre borne de recharge grâce aux
            dispositifs d’aide spécialement conçus pour les particuliers et les
            professionnels. Nous vous accompagnons dans chaque étape afin de
            maximiser vos avantages financiers.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <PiggyBank className="mt-1 h-6 w-6 text-emerald-300" />
              <div className="space-y-1">
                <h3 className="font-semibold text-white">Économies garanties</h3>
                <p className="text-sm text-slate-300">
                  Cumulez prime ADVENIR et crédit d’impôt pour alléger le coût total
                  d’installation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck className="mt-1 h-6 w-6 text-emerald-300" />
              <div className="space-y-1">
                <h3 className="font-semibold text-white">Accompagnement complet</h3>
                <p className="text-sm text-slate-300">
                  Gestion du dossier, vérification des critères d’éligibilité et suivi
                  jusqu’au versement des aides.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <a
              href="https://advenir.mobi/je-definis-mon-projet/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              Simuler mon aide ADVENIR
            </a>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Être rappelé par un expert
            </Link>
          </div>
        </div>

        <div className="w-full space-y-8 lg:w-5/12">
          <article className="overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
            <div className="relative h-52">
              <Image
                src="/advenir.jpeg"
                alt="Programme de subvention ADVENIR"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 100vw"
                priority
              />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                <BadgePercent className="h-5 w-5" /> Prime ADVENIR
              </div>
              <h3 className="text-2xl font-bold">Jusqu’à 60% de votre installation financée</h3>
              <p className="text-slate-600">
                La prime ADVENIR soutient le déploiement des bornes de recharge pour
                véhicules électriques, que vous soyez en maison individuelle,
                copropriété ou entreprise.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  Jusqu’à 1 860 € de subvention selon votre usage.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  Compatible avec les installations individuelles et collectives.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  Dossier géré par nos équipes certifiées.
                </li>
              </ul>
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
            <div className="relative h-52">
              <Image
                src="/credit-impot.png"
                alt="Avantages du crédit d’impôt pour la recharge électrique"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 100vw"
              />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                <FileCheck2 className="h-5 w-5" /> Crédit d’impôt
              </div>
              <h3 className="text-2xl font-bold">Profitez d’un avantage fiscal immédiat</h3>
              <p className="text-slate-600">
                Bénéficiez d’un crédit d’impôt jusqu’à 500 € par borne installée dans
                votre résidence principale ou secondaire.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  Applicable pour chaque contribuable du foyer fiscal.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  Déduction directe lors de votre déclaration annuelle.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  Compatible avec les primes locales et ADVENIR.
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
