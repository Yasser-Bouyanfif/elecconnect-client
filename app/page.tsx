import Hero from "./components/landing/Hero";
import AboutUs from "./components/landing/AboutUs";
import Testimonials from "./components/landing/Testimonials";
import ProductSection from "./components/landing/ProductSection";
import Contact from "./components/landing/Contact";
import SolaireSolution from "./components/landing/SolarSolution";

export default function Page() {
  return (
    <div className="min-h-screen">
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