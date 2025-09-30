"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PiggyBank, BadgeCheck, FileCheck2, ArrowUpRight } from "lucide-react";

export default function SolaireSolution() {
  return (
    <section id="financement" className="py-20 bg-slate-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Financement de votre borne
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Profitez des aides ADVENIR et du Crédit d'impôt pour accélérer votre projet
          </h2>
          <p className="text-lg text-slate-600">
            Réduisez significativement le coût d'installation de votre borne de recharge en cumulant les dispositifs
            nationaux dédiés aux particuliers, entreprises et collectivités.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <article className="relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-transparent to-white" aria-hidden="true" />
            <div className="relative h-56 sm:h-64">
              <Image
                src="/advenir.jpeg"
                alt="Programme de financement ADVENIR"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="relative space-y-6 p-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-emerald-600/10 px-4 py-2 text-sm font-semibold text-emerald-700">
                <PiggyBank className="h-5 w-5" />
                <span>Prime ADVENIR</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">Jusqu'à 50% de vos coûts pris en charge</h3>
                <p className="text-slate-600">
                  Le programme ADVENIR subventionne l'achat et l'installation de bornes de recharge pour véhicules
                  électriques. Nous vous accompagnons dans le montage du dossier pour maximiser votre subvention.
                </p>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-slate-600">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span>Éligible aux particuliers en maison individuelle, aux copropriétés et aux professionnels.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span>Prime calculée selon la puissance et l'usage de la borne (publique, privée, partagée).</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span>Gestion administrative complète : devis, convention ADVENIR et justificatifs d'installation.</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="https://advenir.mobi/je-definis-mon-projet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700"
                >
                  Démarrer mon dossier ADVENIR
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/70 via-transparent to-white" aria-hidden="true" />
            <div className="relative h-56 sm:h-64">
              <Image
                src="/credit-impot.png"
                alt="Crédit d'impôt pour les bornes de recharge"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative space-y-6 p-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700">
                <FileCheck2 className="h-5 w-5" />
                <span>Crédit d'impôt</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">Jusqu'à 300€ remboursés par borne</h3>
                <p className="text-slate-600">
                  Les particuliers peuvent bénéficier d'un crédit d'impôt de 75% du coût de la borne de recharge (plafonné à
                  300€ par équipement) pour leur résidence principale ou secondaire, sous certaines conditions.
                </p>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-slate-600">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>Applicable aux dépenses réalisées jusqu'au 31 décembre 2025.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>Un crédit d'impôt par logement, valable pour deux bornes maximum.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <span>Factures libellées à votre nom comprenant le matériel, la pose et la mise en service.</span>
                </li>
              </ul>
              <p className="text-sm text-slate-500">
                Nous vous guidons pour réunir l'ensemble des pièces justificatives et optimiser votre déclaration fiscale.
              </p>
            </div>
          </article>
        </div>

        <div className="mt-16 grid gap-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-10 sm:px-10 md:grid-cols-[auto,1fr] md:items-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            <PiggyBank className="h-5 w-5" />
            <span>Un financement clé en main</span>
          </div>
          <div className="space-y-4 text-white">
            <h3 className="text-2xl font-semibold">Cumulez les aides pour réduire jusqu'à 75% du coût total</h3>
            <p className="text-slate-200">
              De l'audit d'éligibilité au dépôt des dossiers, ELEC'CONNECT gère chaque étape. Profitez d'un interlocuteur
              unique pour combiner la prime ADVENIR et le Crédit d'impôt, tout en sécurisant vos délais d'installation.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <BadgeCheck className="h-4 w-4" />
                Étude d'éligibilité personnalisée
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <BadgeCheck className="h-4 w-4" />
                Assistance administrative complète
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <BadgeCheck className="h-4 w-4" />
                Installation certifiée IRVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
