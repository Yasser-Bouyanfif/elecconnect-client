import Hero from "./components/landing/Hero";
import AboutUs from "./components/landing/AboutUs";
import Testimonials from "./components/landing/Testimonials";
import ProductSection from "./components/landing/ProductSection";
import Contact from "./components/landing/Contact";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Hero />
      <AboutUs />
      <Testimonials />
      <ProductSection />
      <Contact />
    </div>
  );
}
