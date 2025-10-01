"use client";

import { useEffect, useState } from "react";
import Hero from "./components/landing/Hero";
import AboutUs from "./components/landing/AboutUs";
import Reviews from "./components/landing/Reviews";
import ProductSection from "./components/landing/ProductSection";
import Contact from "./components/landing/Contact";
import dynamic from "next/dynamic";
import Advantages from "./components/landing/Advantages";

const ExclusiveOfferPopup = dynamic(
  () => import('./components/ui/ExclusiveOfferPopup'),
  { ssr: false }
);

export default function Page() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const popupShown = sessionStorage.getItem("popupShown");

    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    console.log("Fermeture de la popup");
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

      <section id="advantages" className="scroll-mt-24">
        <Advantages />
      </section>

      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>
    </div>
  );
}