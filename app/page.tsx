"use client"

import { useEffect, useState } from 'react';
import Hero from "./components/landing/Hero";
import AboutUs from "./components/landing/AboutUs";
import Reviews from "./components/landing/Reviews";
import ProductSection from "./components/landing/ProductSection";
import Contact from "./components/landing/Contact";
import SolaireSolution from "./components/landing/SolarSolution";
import dynamic from 'next/dynamic';
import { auth } from "@clerk/nextjs/server";
import { useUser } from '@clerk/nextjs';

// Chargement dynamique pour éviter le rendu côté serveur
const ExclusiveOfferPopup = dynamic(
  () => import('./components/ui/ExclusiveOfferPopup'),
  { ssr: false }
);

export default function Page() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Vérifier si la popup a déjà été affichée dans cette session
    const popupShown = sessionStorage.getItem('popupShown');
    
    if (!popupShown) {
      // Délai avant d'afficher la popup
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000); // 2 secondes de délai
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    console.log('Fermeture de la popup');
    setShowPopup(false);
  };
  
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

      <section id="reviews" className="scroll-mt-24">
        <Reviews />
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