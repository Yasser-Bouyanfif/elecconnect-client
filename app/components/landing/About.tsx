import React from 'react';
import { Shield, Zap, Clock } from 'lucide-react';

export default function About() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Chez ELEC&apos;CONNECT, nous sommes animés par la vision d&apos;un monde où chaque kilomètre
            parcouru contribue à un environnement plus propre.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Installateur certifié IRVE
            </h3>
            <p className="text-slate-600 text-sm">
              Qualification professionnelle avec garantie complète sur nos prestations.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Installation rapide
            </h3>
            <p className="text-slate-600 text-sm">
              Intervention sous 48h partout en Île-de-France avec équipe qualifiée.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Support technique 7j/7
            </h3>
            <p className="text-slate-600 text-sm">
              Assistance et maintenance disponible toute la semaine pour votre tranquillité.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
