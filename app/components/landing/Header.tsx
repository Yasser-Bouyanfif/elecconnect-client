"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { PhoneCall, Menu, ShoppingCart, LogIn } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { CartContext, CartContextType } from "../../contexts/CartContext";
import Cart from "../ui/Cart";

export default function Header() {
  const { isSignedIn } = useUser();
  const [openCart, setOpenCart] = useState(false);
  const { cart } = useContext(CartContext) as CartContextType;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Bloc gauche (inchangé) */}
          <div className="flex items-center space-x-3">
            <img
              src="/image01-high.webp"
              alt="ELEC'CONNECT"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ELEC'CONNECT</h1>
              <p className="text-sm text-emerald-600 font-medium">
                Solutions de recharge électrique
              </p>
            </div>
          </div>

          {/* Nav desktop (inchangé) */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Accueil
            </a>
            <a href="/#about" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              À propos
            </a>
            <a href="/#testimonials" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Avis
            </a>
            <a href="/#products" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Produits
            </a>
            <a href="/solar-solution" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Solution Solaire
            </a>
            <a href="/shop" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Boutique
            </a>

            {/* Bouton Contact (inchangé) */}
            <a
              href="/#contact"
              className="btn btn-success btn text-white flex items-center gap-2"
            >
              <span>Contact</span>
              <span className="relative flex items-center justify-center">
                <span
                  className="absolute inset-0 rounded-full border border-white/60 animate-ping"
                  aria-hidden="true"
                />
                <PhoneCall className="w-4 h-4 text-white phone-ring" strokeWidth={3} aria-hidden="true" />
              </span>
            </a>

            {/* >>> Actions à droite : Panier (toujours) + Login/User <<< */}
            <div className="hidden md:flex items-center gap-4 pl-4">
              {/* Panier : toujours visible */}
              <button
                type="button"
                className="relative cursor-pointer"
                onClick={() => setOpenCart((v) => !v)}
                aria-label="Ouvrir le panier"
              >
                <ShoppingCart className="w-6 h-6 text-gray-800" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-emerald-600 px-2 text-xs text-white">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Si connecté : bouton profil Clerk ; sinon : icône Login vers /sign-in */}
              {isSignedIn ? (
                <UserButton />
              ) : (
                <Link
                  href="/sign-in"
                  aria-label="Se connecter"
                  className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-gray-100 transition-colors"
                >
                  <LogIn className="w-6 h-6 text-gray-800" />
                </Link>
              )}
            </div>
          </nav>

          {/* Burger mobile (inchangé) */}
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Popover Panier */}
      {openCart && <Cart />}
    </header>
  );
}
