"use client";

import React from "react";
import Image from "next/image";
import { BadgeCheck, FileText, HandCoins, ShieldCheck, Sparkles } from "lucide-react";

export default function SolarFinancing() {
  return (
    <section id="financement" className="py-20 bg-gradient-to-b from-white via-white to-slate-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
            <Sparkles className="h-4 w-4" />
            Boostez votre projet de borne de recharge
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Aides financières ADVENIR & Crédit d'impôt
          </h2>
          <p className="text-lg text-slate-600">
            Maximisez votre budget d'installation grâce aux dispositifs nationaux d'aide à la mobilité électrique.
            Nous vous accompagnons pour sécuriser les subventions et crédits d'impôt adaptés à votre projet.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="relative h-60 w-full overflow-hidden sm:h-72 lg:h-80">
              <Image
                src="/advenir.jpeg"
                alt="Programme ADVENIR"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-1 flex-col justify-between space-y-6 px-10 pb-12 pt-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                Prime ADVENIR
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">Subvention jusqu'à 50% de votre installation</h3>
              <p className="text-slate-600">
                Le programme ADVENIR finance une partie du coût de vos bornes de recharge pour véhicules électriques, que vous soyez particulier, entreprise ou collectivité.
                Bénéficiez d'une prise en charge rapide et simplifiée des équipements et de la pose.
              </p>
              <ul className="space-y-4 text-base text-slate-600">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-500" />
                  Jusqu'à 960 € d'aide pour les installations résidentielles individuelles.
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-500" />
                  Financement majoré pour les copropriétés, entreprises et parkings publics.
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-500" />
                  Accompagnement complet pour constituer et suivre votre dossier de subvention.
                </li>
              </ul>
              <a
                href="https://advenir.mobi/je-definis-mon-projet/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-base font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
              >
                Accéder au formulaire officiel
                <FileText className="h-5 w-5" />
              </a>
            </div>
          </article>

          <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="relative h-60 w-full overflow-hidden sm:h-72 lg:h-80">
              <Image
                src="/credit-impot.png"
                alt="Crédit d'impôt pour la transition énergétique"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between space-y-6 px-10 pb-12 pt-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                <HandCoins className="h-4 w-4" />
                Crédit d'impôt
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">Profitez du crédit d'impôt transition énergétique</h3>
              <p className="text-slate-600">
                Réduisez votre impôt sur le revenu en déclarant l'installation de votre borne de recharge.
                Ce dispositif fiscal s'applique aux résidences principales comme secondaires, avec un avantage cumulable avec la prime ADVENIR.
              </p>
              <ul className="space-y-4 text-base text-slate-600">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-500" />
                  Crédit d'impôt de 300 € par système de charge, dans la limite de deux bornes par foyer.
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-500" />
                  Applicable aux équipements installés par un professionnel certifié IRVE.
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-500" />
                  Assistance pour la préparation des justificatifs et de la déclaration fiscale.
                </li>
              </ul>
              <p className="rounded-3xl bg-slate-50 p-6 text-base text-slate-600">
                Nous vous guidons étape par étape pour coordonner les aides financières et optimiser votre investissement.
                Contactez nos experts pour une estimation personnalisée.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
