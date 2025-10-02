import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="ELEC’CONNECT"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
                priority
              />
              <div>
                <h3 className="text-xl font-bold">ELEC’CONNECT</h3>
                <p className="text-emerald-400 text-sm">Solutions de recharge électrique</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Votre partenaire de confiance pour l’installation professionnelle de bornes de recharge électrique. 
              Nous contribuons à un avenir plus durable grâce à la mobilité électrique.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1CjD1JuuFW/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/elec_connectpaca?igsh=a2t2OHhycmEzdG4x" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/rodolphe-ewouindo-b52528376?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liens utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal-notice"
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  Conditions Générales de Vente
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
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
                <MapPin className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-gray-300">
                    83000 Toulon, France
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col items-center">
          <p className="text-white text-sm font-bold mb-2">
            {year} ELEC’CONNECT. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs">
            Propulsé par <a href="https://yasserr.dev" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">CodeVerse</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
