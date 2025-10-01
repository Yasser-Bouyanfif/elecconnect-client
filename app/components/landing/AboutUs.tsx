"use client";

import React from "react";
import Image from "next/image";
import { Zap, Shield, Leaf, Users } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-800">
            Qui sommes-nous ?
          </h2>
        </div>

        {/* Bloc texte + image */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
          {/* Texte à gauche */}
          <div className="max-w-2xl">
            <div className="space-y-5 text-lg text-slate-700 leading-relaxed">
              <p>
                <strong className="text-emerald-600">ELEC’CONNECT</strong> vous accompagne
                pour l’installation fiable de bornes de recharge pour véhicules électriques garanties <b>2 ans</b>.
                Nous concevons des solutions performantes, durables et réellement adaptées à vos usages.
              </p>
              <p>
              Engagés pour la transition énergétique, nous facilitons une mobilité plus propre et accessible.
              De l’audit à la maintenance, notre démarche certifiée, claire et transparente vous garantit un suivi sans surprise.
              </p>
            </div>
          </div>

          {/* Image à droite — sans card + hauteur réduite */}
          <div className="relative w-full h-56 sm:h-64 lg:h-72">
            <Image
              src="/borne.png"
              alt="Borne de recharge ELEC’CONNECT"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Icônes / valeurs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
              <Zap className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Solutions diverses
            </h3>
            <p className="text-slate-600 text-sm">
              Technologies de pointe pour une recharge optimale
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Installation certifiée
            </h3>
            <p className="text-slate-600 text-sm">
              Qualification <b>IRVE</b> et <b>QUALIFELEC</b>
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Engagement écologique
            </h3>
            <p className="text-slate-600 text-sm">
              Pour un avenir plus propre et durable
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Accompagnement personnalisé
            </h3>
            <p className="text-slate-600 text-sm">
              Solutions adaptées à vos besoins spécifiques
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
