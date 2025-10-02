"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Menu, ShoppingCart, LogIn } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { CartContext, CartContextType } from "../../contexts/CartContext";
import Cart from "../ui/Cart";

export default function Header() {
  const { isSignedIn } = useUser();
  const [openCart, setOpenCart] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useContext(CartContext) as CartContextType;

  const renderUserButton = () => (
    <UserButton afterSignOutUrl="/">
      <UserButton.MenuItems>
        <UserButton.Link
          label="Mes commandes"
          href="/orders"
          labelIcon={<ShoppingCart className="w-4 h-4 mr-2" />}
        />
      </UserButton.MenuItems>
    </UserButton>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo cliquable */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="ELEC’CONNECT"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
              priority
            />
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-gray-900">ELEC’CONNECT</h1>
              <p className="text-sm text-emerald-600 font-medium">
              Explorez la mobilité durable
              </p>
            </div>
          </Link>

          {/* Navigation desktop - visible à partir de lg */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link
              href="/solar-solution"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Solution Solaire
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Boutique
            </Link>

            {/* Bouton Contact (inchangé) */}
            <Link
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
            </Link>

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
                renderUserButton()
              ) : (
                <Link
                  href="/account"
                  aria-label="Se connecter"
                  className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-gray-100 transition-colors"
                >
                  <LogIn className="w-6 h-6 text-gray-800" />
                </Link>
              )}
            </div>
          </nav>

          {/* Boutons pour mobile et tablette */}
          <div className="flex items-center gap-4 lg:hidden">
            {/* Panier */}
            <button
              type="button"
              className="relative p-2"
              onClick={() => setOpenCart((v) => !v)}
              aria-label="Ouvrir le panier"
            >
              <ShoppingCart className="w-6 h-6 text-gray-800" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-emerald-600 w-5 h-5 flex items-center justify-center text-xs text-white">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Bouton utilisateur */}
            <div className="ml-2">
              {isSignedIn ? (
                renderUserButton()
              ) : (
                <Link
                  href="/account"
                  aria-label="Se connecter"
                  className="p-2 block"
                >
                  <LogIn className="w-6 h-6 text-gray-800" />
                </Link>
              )}
            </div>

            {/* Bouton menu hamburger */}
            <button 
              className="p-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Ouvrir le menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile et tablette */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-3 space-y-3">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/solar-solution"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Solution Solaire
            </Link>
            <Link
              href="/shop"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Boutique
            </Link>
            <Link
              href="/#contact"
              className="block px-3 py-2 text-emerald-600 hover:bg-gray-50 rounded-md font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}

      {/* Popover Panier */}
      {openCart && <Cart onClose={() => setOpenCart(false)} />}
    </header>
  );
}
