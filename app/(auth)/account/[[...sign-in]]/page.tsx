"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen w-full bg-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* LEFT: Brand + Heading + Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-1/2 flex flex-col gap-6 mt-12 sm:mt-16 lg:mt-20"
          >
            {/* Brand (titre + slogan) */}
            <div className="space-y-3 w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight">
                Bienvenue sur <span className="text-emerald-600">ELEC’CONNECT</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600">
                La solution tout-en-un pour la recharge de votre véhicule électrique
              </p>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">
                {mode === "signin" ? "Content de vous revoir" : "Créez votre compte"}
              </h2>
              <p className="text-slate-600 text-sm">
                {mode === "signin"
                  ? "Connectez-vous pour accéder à votre espace personnel"
                  : "Rejoignez-nous et profitez de tous nos services"}
              </p>
            </div>

            {/* Toggle Connexion / Inscription */}
            <div className="flex w-full sm:w-fit items-center rounded-xl bg-slate-100 p-1.5">
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg px-4 sm:px-6 py-2 text-sm font-medium transition-all ${
                  mode === "signin"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <LogIn className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Connexion</span>
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg px-4 sm:px-6 py-2 text-sm font-medium transition-all ${
                  mode === "signup"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <UserPlus className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Inscription</span>
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Clerk seulement (sans carte supplémentaire) */}
          <section className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-20">
            <div className="w-full max-w-md">
              {mode === "signin" ? (
                <SignIn routing="hash" signUpUrl="/sign-up"/>
              ) : (
                <SignUp routing="hash" />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}