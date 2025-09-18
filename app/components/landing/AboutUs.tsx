import React from 'react';
import { Zap, Shield, Leaf, Users } from 'lucide-react';

export default function AboutUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Qui sommes-nous ?
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              <strong className="text-emerald-600">ELEC'CONNECT</strong> votre partenaire de confiance pour l'installation professionnelle 
              de bornes de recharge pour véhicules électriques. Nous nous engageons à fournir des solutions 
              de recharge efficaces, durables et adaptées à vos besoins.
            </p>
            <p>
              Chez Elec'connect, nous sommes animés par la vision d'un monde où chaque kilomètre parcouru 
              est une contribution positive à notre environnement. En faisant le choix de la mobilité électrique, 
              vous participez activement à la création d'un avenir plus propre et plus durable.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
              <Zap className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Solutions efficaces
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
              Qualification IRVE et garantie complète
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