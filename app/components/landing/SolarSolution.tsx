"use client";

import React from "react";
import Image from "next/image";
import { PiggyBank, FileText, ArrowRight, ShieldCheck } from "lucide-react";

export default function SolaireSolution() {
  return (
    <section id="aides" className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 px-4 py-1 text-sm font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Aides financières sécurisées</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Maximisez vos subventions pour l'installation de bornes de recharge
            </h2>
            <p className="text-lg text-slate-200">
              ELEC'CONNECT vous accompagne pour obtenir les aides ADVENIR et le Crédit d'Impôt pour la transition énergétique. Nous prenons en charge les démarches afin que vous profitiez d'une installation financée en toute simplicité.
            </p>

            <div className="grid gap-6">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6 shadow-lg hover:border-emerald-400/60 transition">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                    <PiggyBank className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Prime ADVENIR</h3>
                    <p className="text-slate-200">
                      Jusqu'à 60% de votre installation prise en charge pour les particuliers, professionnels et collectivités. Notre équipe vous aide à constituer le dossier et à maximiser votre subvention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6 shadow-lg hover:border-emerald-400/60 transition">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Crédit d'impôt transition énergétique</h3>
                    <p className="text-slate-200">
                      Récupérez jusqu'à 300€ sur vos impôts pour l'installation d'une borne de recharge à domicile. Nous préparons l'ensemble des justificatifs nécessaires pour une déclaration sans stress.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://advenir.mobi/je-definis-mon-projet/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-emerald-400"
              >
                Accéder au formulaire officiel
                <ArrowRight className="h-4 w-4" />
              </a>
              <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200">
                Suivi personnalisé par nos experts
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src="/advenir.jpeg"
                alt="Illustration du programme de subventions ADVENIR"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src="/credit-impot.png"
                alt="Illustration du crédit d'impôt pour borne de recharge"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
