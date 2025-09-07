"use client";

import { useContext, useEffect } from "react";
import { CartContext } from "@/app/contexts/CartContext";

function SuccessPage() {
  const cartContext = useContext(CartContext);

  useEffect(() => {
    cartContext?.clearCart();
  }, [cartContext]);

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-center text-xl font-bold text-gray-900 sm:text-3xl">
          Paiement réussi
        </h1>
      </div>
    </section>
  );
}

export default SuccessPage;
