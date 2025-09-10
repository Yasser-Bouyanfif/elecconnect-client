"use client";

import { useContext, useState } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";
import { useUser } from "@clerk/nextjs";

export default function CheckoutPage() {
  const { cart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await user?.update({
      unsafeMetadata: { shippingAddress, billingAddress },
    });

    const grouped: { id: number | string; quantity: number }[] = [];
    const quantities = new Map<number | string, number>();
    cart.forEach((item) => {
      const id = item.id;
      quantities.set(id, (quantities.get(id) || 0) + 1);
    });
    quantities.forEach((quantity, id) => {
      grouped.push({ id, quantity });
    });

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: grouped }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Failed to create checkout session", data);
    }
  };

  return (
    <section className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Adresse de livraison</label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
            className="w-full border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Adresse de facturation</label>
          <input
            type="text"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            required
            className="w-full border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100"
        >
          Payer
        </button>
      </form>
    </section>
  );
}