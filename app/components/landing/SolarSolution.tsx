"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, BadgeCheck, PiggyBank } from "lucide-react";

export default function SolaireSolution() {
  return (
    <section id="aides" className="relative overflow-hidden bg-slate-900 py-20 text-white">
      <div
        className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-900"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8">
        {/* Visuel principal */}
        <div className="w-full lg:w-5/12">
          <div className="relative mx-auto flex max-w-sm flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_40px_80px_-40px_rgba(16,185,129,0.45)] backdrop-blur">
            <span className="rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-emerald-200">
              Financements verts
            </span>
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Boostez votre projet avec ADVENIR &amp; Crédit d'impôt
            </h2>
            <p className="text-base text-slate-200">
              Maximisez vos aides pour l'installation de bornes de recharge grâce à un accompagnement complet sur les dispositifs nationaux.
            </p>
            <div className="grid w-full gap-4 text-left text-slate-100">
              <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                <PiggyBank className="mt-1 h-6 w-6 text-emerald-300" />
                <div>
                  <p className="font-semibold text-white">Jusqu'à 2 700€ subventionnés</p>
                  <p className="text-sm text-slate-200/80">Prise en charge ADVENIR pour particuliers, copropriétés et entreprises éligibles.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                <BadgeCheck className="mt-1 h-6 w-6 text-emerald-300" />
                <div>
                  <p className="font-semibold text-white">Crédit d'impôt simplifié</p>
                  <p className="text-sm text-slate-200/80">Récupérez 75% des dépenses d'installation (plafonnées) sur votre déclaration fiscale.</p>
                </div>
              </div>
            </div>
            <a
              href="https://advenir.mobi/je-definis-mon-projet/"
              target="_blank"
              rel="noreferrer"
              className="group mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
            >
              Démarrer mon dossier
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>

        {/* Fiches aides */}
        <div className="w-full lg:w-7/12">
          <div className="grid gap-8">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_60px_-45px_rgba(15,118,110,0.6)] backdrop-blur">
              <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">Programme ADVENIR</h3>
                  <p className="text-base text-slate-200">
                    Bénéficiez d'une prise en charge instantanée de votre borne de recharge avec un accompagnement administratif clé en main. Notre équipe s'occupe du dossier, du suivi et de la justification des travaux.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-200/90">
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-6 rounded-full bg-emerald-400" />
                      Jusqu'à 50% du coût HT de la borne et de l'installation.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-6 rounded-full bg-emerald-400" />
                      Éligible pour les particuliers, les entreprises et les collectivités.
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-6 rounded-full bg-emerald-400" />
                      Validation rapide grâce à notre réseau d'installateurs certifiés.
                    </li>
                  </ul>
                </div>
                <div className="relative mx-auto h-48 w-full max-w-xs">
                  <Image
                    src="/advenir.jpeg"
                    alt="Programme de financement ADVENIR"
                    fill
                    className="rounded-2xl object-cover"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_60px_-45px_rgba(94,234,212,0.45)] backdrop-blur">
              <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <div className="relative mx-auto order-2 h-48 w-full max-w-xs lg:order-1">
                  <Image
                    src="/credit-impot.png"
                    alt="Crédit d'impôt pour les bornes de recharge"
                    fill
                    className="rounded-2xl object-cover"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
                <div className="order-1 space-y-4 text-right lg:order-2 lg:text-left">
                  <h3 className="text-2xl font-semibold text-white">Crédit d'impôt transition énergétique</h3>
                  <p className="text-base text-slate-200">
                    Diminuez le coût final de votre installation grâce au crédit d'impôt dédié aux bornes de recharge domestiques. Nous vous guidons pas à pas pour valoriser chaque justificatif.
                  </p>
                  <ul className="space-y-3 text-sm text-slate-200/90">
                    <li className="flex items-center justify-end gap-2 lg:justify-start">
                      <span className="mt-1 inline-block h-1.5 w-6 rounded-full bg-emerald-400" />
                      Jusqu'à 300€ d'avantage fiscal par borne, deux bornes par foyer.
                    </li>
                    <li className="flex items-center justify-end gap-2 lg:justify-start">
                      <span className="mt-1 inline-block h-1.5 w-6 rounded-full bg-emerald-400" />
                      Applicable pour les résidences principales et secondaires.
                    </li>
                    <li className="flex items-center justify-end gap-2 lg:justify-start">
                      <span className="mt-1 inline-block h-1.5 w-6 rounded-full bg-emerald-400" />
                      Assistance complète pour la déclaration annuelle.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
