import React from 'react';
import { Phone, Mail, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-emerald-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>contact@elec-connect.fr</span>
              </div>
            </div>
            <div className="hidden sm:block text-xs">
              Installateur certifié - Devis gratuit sous 24h
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/image01-high.webp" 
              alt="ELEC'CONNECT" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ELEC'CONNECT</h1>
              <p className="text-sm text-emerald-600 font-medium">Solutions de recharge électrique</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#accueil" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Accueil
            </a>
            <a href="#services" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Services
            </a>
            <a href="#produits" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Produits
            </a>
            <a href="#contact" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              Contact
            </a>
          </nav>

          <button className="md:hidden p-2">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}