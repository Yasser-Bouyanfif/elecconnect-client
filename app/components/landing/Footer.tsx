import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/image01-high.webp" 
                alt="ELEC'CONNECT" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">ELEC'CONNECT</h3>
                <p className="text-emerald-400 text-sm">Solutions de recharge électrique</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Votre partenaire de confiance pour l'installation professionnelle de bornes de recharge électrique. 
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
              <li className="flex flex-col space-y-1">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <a href="tel:+33698657780" className="text-gray-300 hover:text-emerald-400 transition-colors">
                    +33 6 98 65 77 80
                  </a>
                </div>
                <a href="tel:+33422918291" className="pl-7 text-gray-300 hover:text-emerald-400 transition-colors">
                  +33 4 22 91 82 91
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <a href="mailto:contact@elecconnect.fr" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  contact@elecconnect.fr
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-400 mt-1" />
                <div>
                  <a 
                    href="https://www.google.com/maps/place/Provence-Alpes-Côte+d'Azur" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    Provence-Alpes-Côte d'Azur
                  </a>
                  <a 
                    href="https://www.google.com/maps/place/Île-de-France" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block text-gray-300 hover:text-emerald-400 transition-colors mt-1"
                  >
                    Île-de-France
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm font-bold">
            © {year} ELEC'CONNECT. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white font-bold hover:text-emerald-400 transition-colors text-sm">
              Mentions légales
            </a>
            <a href="#" className="text-white font-bold hover:text-emerald-400 transition-colors text-sm">
              Politique de confidentialité
            </a>
            <a href="#" className="text-white font-bold hover:text-emerald-400 transition-colors text-sm">
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
