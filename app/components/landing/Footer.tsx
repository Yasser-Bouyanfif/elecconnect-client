import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/image01-high.webp"
                alt="ELEC&apos;CONNECT"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">ELEC&apos;CONNECT</h3>
                <p className="text-emerald-400 text-sm">Solutions de recharge électrique</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Votre partenaire de confiance pour l&apos;installation professionnelle de bornes de recharge électrique.
              Nous contribuons à un avenir plus durable grâce à la mobilité électrique.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liens utiles</h4>
            <ul className="space-y-2">
              <li><a href="#accueil" className="text-gray-300 hover:text-emerald-400 transition-colors">Accueil</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-emerald-400 transition-colors">Services</a></li>
              <li><a href="#produits" className="text-gray-300 hover:text-emerald-400 transition-colors">Produits</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">contact@elec-connect.fr</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1" />
                <span className="text-gray-300">Île-de-France<br />et région parisienne</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 ELEC&apos;CONNECT. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
              Mentions légales
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
