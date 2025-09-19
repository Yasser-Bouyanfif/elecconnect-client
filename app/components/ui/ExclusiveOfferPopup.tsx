'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

const ExclusiveOfferPopup = () => {
  const [isOpen, setIsOpen] = useState(true); // Afficher directement

  useEffect(() => {
    const wasShown = sessionStorage.getItem('popupShown');
    if (!wasShown) {
      sessionStorage.setItem('popupShown', 'true');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Fond flouté */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Carte */}
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full relative z-10 border border-gray-100 overflow-hidden">
        <div className="relative h-48 w-full bg-gradient-to-r from-emerald-50 to-blue-50">
          <Image 
            src="/solaire3.png" 
            alt="Offre exclusive" 
            fill
            className="object-contain p-4"
            priority
          />
          <div className="absolute top-0 right-0 p-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 bg-white/80 hover:bg-gray-100 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🎉 OFFRE EXCLUSIVE EN RÉGION PACA ! 🎉
            </h3>
            <div className="space-y-3 text-gray-700 text-left">
              <p className="text-lg font-semibold">
                ELEC'CONNECT & SSP vous accompagnent dans votre transition énergétique 📗☀️
              </p>
              
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="font-semibold">
                  ✅ Pour toute installation de panneaux solaires ≥ 3 kWc,
                </p>
                <p className="text-emerald-600 font-bold">
                  ➡️ La borne de recharge 7 kW est OFFERTE ! (installation comprise)
                </p>
              </div>
              
              <p className="text-gray-700">
                💡 Une solution clé en main pour alimenter votre maison ET votre véhicule grâce au soleil.
              </p>
              
              <p className="text-gray-700">
                Rechargez votre voiture gratuitement à domicile, sans effort et sans émission 🌍⚡
              </p>
              
              <div className="text-sm space-y-1 mt-4">
                <p>📍 Offre valable dans toute la région PACA et Ile-de-France</p>
                <p className="text-emerald-600 font-semibold">
                  📞 Contactez-nous dès maintenant pour une étude gratuite !
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-center transition-all duration-300"
            >
              Profiter de l'offre
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveOfferPopup;
