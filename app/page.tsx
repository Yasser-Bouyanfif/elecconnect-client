"use client"

import { useEffect, useState } from 'react';
import Hero from "./components/landing/Hero";
import AboutUs from "./components/landing/AboutUs";
import Testimonials from "./components/landing/Testimonials";
import ProductSection from "./components/landing/ProductSection";
import Contact from "./components/landing/Contact";
import SolaireSolution from "./components/landing/SolarSolution";
import dynamic from 'next/dynamic';

// Chargement dynamique pour éviter le rendu côté serveur
const ExclusiveOfferPopup = dynamic(
  () => import('./components/ui/ExclusiveOfferPopup'),
  { ssr: false }
);

export default function Page() {
  const [showPopup, setShowPopup] = useState(false);

  const handleClosePopup = () => {
    console.log('Fermeture de la popup');
    setShowPopup(false);
  };

  useEffect(() => {
    console.log('useEffect exécuté');
    // Vérifier si la popup a déjà été affichée dans cette session
    const popupShown = sessionStorage.getItem('popupShown');
    console.log('Popup déjà affichée ?', popupShown);
    
    if (!popupShown) {
      console.log('Démarrage du timer pour afficher la popup');
      const timer = setTimeout(() => {
        console.log('Affichage de la popup');
        setShowPopup(true);
        sessionStorage.setItem('popupShown', 'true');
      }, 1000); // Délai de 1 seconde avant d'afficher la popup
      
      return () => {
        console.log('Nettoyage du timer');
        clearTimeout(timer);
      };
    } else {
      // Si la popup a déjà été affichée, on s'assure qu'elle reste fermée
      setShowPopup(false);
    }
  }, []);

  console.log('Rendu du composant, showPopup =', showPopup);
  
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);
  
  return (
    <div className="min-h-screen">
      {showPopup && (
        <ExclusiveOfferPopup onClose={handleClosePopup} />
      )}
      <section id="hero" className="scroll-mt-24">
        <Hero />
      </section>

      <section id="about" className="scroll-mt-24">
        <AboutUs />
      </section>

      <section id="testimonials" className="scroll-mt-24">
        <Testimonials />
      </section>

      <section id="products" className="scroll-mt-24">
        <ProductSection />
      </section>

      <SolaireSolution />

      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>
    </div>
  );
}