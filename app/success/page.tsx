"use client";

import { useContext, useEffect } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";

function SuccessPage() {
  const { clearCart } = useContext(CartContext) as CartContextType;

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="p-8 text-center">
      <h1 className="text-xl font-bold">Payment successful</h1>
      <p className="mt-4">Thank you for your purchase.</p>
    </section>
  );
}

export default SuccessPage;
