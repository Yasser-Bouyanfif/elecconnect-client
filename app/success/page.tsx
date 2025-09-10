"use client";

import { useContext, useEffect } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";

export default function SuccessPage() {
  const { clearCart } = useContext(CartContext) as CartContextType;

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="mx-auto max-w-md p-4 text-center">
      <h1 className="mb-4 text-2xl font-bold">Paiement confirmé</h1>
      <p>Merci pour votre achat. Votre commande a été enregistrée.</p>
    </section>
  );
}
