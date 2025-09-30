"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  Check,
  Coins,
  FileSearch,
  PiggyBank,
} from "lucide-react";

export default function SolaireSolution() {
  return (
    <section id="financement" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-y-0 right-0 -z-10 hidden h-full w-1/2 translate-x-16 rounded-full bg-emerald-500/20 blur-3xl lg:block" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,1fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm uppercase tracking-[0.2em] text-emerald-200">
              Financement intelligent
            </span>

            <h2 className="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
              Maximisez les aides ADVENIR et le Crédit d'impôt pour votre projet de recharge
            </h2>

            <p className="text-lg text-slate-200/90">
              Profitez des dispositifs financiers nationaux pour accélérer l'installation de bornes de recharge. Nous vous guidons dans la constitution des dossiers et l'optimisation des subventions pour un investissement serein et maîtrisé.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<BadgeCheck className="h-5 w-5" />}
                title="Jusqu'à 60% pris en charge"
                description="Subvention ADVENIR pour les entreprises, copropriétés et collectivités."
              />
              <FeatureCard
                icon={<PiggyBank className="h-5 w-5" />}
                title="Crédit d'impôt dédié"
                description="Réduction immédiate des dépenses éligibles pour les particuliers."
              />
              <FeatureCard
                icon={<FileSearch className="h-5 w-5" />}
                title="Dossier simplifié"
                description="Accompagnement complet sur les pièces et critères à respecter."
              />
              <FeatureCard
                icon={<CalendarClock className="h-5 w-5" />}
                title="Délais maîtrisés"
                description="Montage et dépôt des demandes dans les temps pour sécuriser vos aides."
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Votre parcours d'accompagnement</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <StepItem
                  icon={<Coins className="h-4 w-4" />}
                  title="Analyse de l'éligibilité"
                  description="Étude de votre projet et estimation du montant mobilisable."
                />
                <StepItem
                  icon={<Check className="h-4 w-4" />}
                  title="Constitution des dossiers"
                  description="Collecte des justificatifs et remplissage des formulaires officiels."
                />
                <StepItem
                  icon={<BadgeCheck className="h-4 w-4" />}
                  title="Validation et suivi"
                  description="Nous assurons la conformité jusqu'au versement des aides."
                />
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href="https://advenir.mobi/je-definis-mon-projet/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Accéder au formulaire officiel
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <p className="text-sm text-slate-300">
                  Nous restons à vos côtés pour préparer chaque étape.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <AidCard
              title="Programme ADVENIR"
              image="/advenir.jpeg"
              highlights={[
                "Subvention pour bornes individuelles ou partagées",
                "Montants adaptés aux professionnels et copropriétés",
                "Prime versée rapidement après travaux conformes",
              ]}
            />
            <AidCard
              title="Crédit d'impôt pour la transition énergétique"
              image="/credit-impot.png"
              highlights={[
                "Jusqu'à 300 € par point de charge pour les particuliers",
                "Compatible avec une résidence principale ou secondaire",
                "Cumulable avec le programme ADVENIR sous conditions",
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-200/80">{description}</p>
      </div>
    </div>
  );
}

function StepItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-200">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-200/80">{description}</p>
      </div>
    </li>
  );
}

function AidCard({
  title,
  image,
  highlights,
}: {
  title: string;
  image: string;
  highlights: string[];
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-emerald-400/60">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          priority
        />
      </div>
      <div className="space-y-4 px-6 pb-6 pt-5 text-white">
        <h3 className="text-xl font-semibold">{title}</h3>
        <ul className="space-y-2 text-sm text-slate-200">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
