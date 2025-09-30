"use client";

import React from "react";
import Image from "next/image";
import {
  PiggyBank,
  BadgeCheck,
  FileText,
  ExternalLink,
  Sparkles,
} from "lucide-react";

const financingOptions = [
  {
    title: "Prime ADVENIR",
    subtitle: "Jusqu’à 50 % du coût d’installation",
    description:
      "Une aide nationale destinée à soutenir le déploiement des bornes de recharge, que vous soyez particulier, copropriété ou entreprise.",
    image: "/advenir.jpeg",
    highlights: [
      "Prise en charge du matériel et de la pose",
      "Démarches simplifiées avec un dossier en ligne",
      "Versement de la prime en quelques semaines",
    ],
    icon: PiggyBank,
  },
  {
    title: "Crédit d’impôt",
    subtitle: "Réduisez votre fiscalité jusqu’à 300 €",
    description:
      "Profitez d’un avantage fiscal pour l’installation d’une borne de recharge à votre domicile principal, cumulable avec la prime ADVENIR.",
    image: "/credit-impot.png",
    highlights: [
      "Éligible pour les résidences principales",
      "Applicable sur l’achat et l’installation",
      "Accessible sans condition de ressources",
    ],
    icon: BadgeCheck,
  },
];

export default function FinancingSolutions() {
  return (
    <section
      id="financements"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.45),_transparent_55%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-2/5 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-sm font-semibold uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              Boostez votre budget
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Des aides financières pour faciliter votre projet de recharge
            </h2>
            <p className="text-base sm:text-lg text-slate-200">
              Nous vous accompagnons dans la constitution des dossiers afin de mobiliser les principaux dispositifs d’aides disponibles en France. Maximisez votre investissement tout en accélérant l’installation de votre borne.
            </p>
            <div className="space-y-4 text-slate-100">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Accompagnement administratif complet</p>
                  <p className="text-sm text-slate-300">
                    Constitution du dossier, dépôt et suivi auprès des organismes concernés.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BadgeCheck className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Éligibilité vérifiée en amont</p>
                  <p className="text-sm text-slate-300">
                    Nous analysons votre profil pour optimiser le cumul des aides disponibles.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="https://advenir.mobi/je-definis-mon-projet/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
              >
                Commencer ma demande officielle
                <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="w-full lg:w-3/5 grid gap-8 sm:grid-cols-2">
            {financingOptions.map((option) => {
              const OptionIcon = option.icon;
              return (
                <article
                  key={option.title}
                  className="relative flex flex-col overflow-hidden rounded-3xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl transition hover:-translate-y-1 hover:shadow-emerald-500/20"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={option.image}
                      alt={option.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-semibold">
                      <OptionIcon className="w-5 h-5 text-emerald-300" />
                      {option.subtitle}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6 text-slate-900">
                    <h3 className="text-xl font-bold text-white">{option.title}</h3>
                    <p className="text-sm text-slate-200">{option.description}</p>
                    <ul className="space-y-2 text-sm text-slate-100">
                      {option.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span className="mt-1 block h-2 w-2 rounded-full bg-emerald-400" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
