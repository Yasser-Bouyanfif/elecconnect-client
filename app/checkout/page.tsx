"use client";

import { useContext, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { CartContext, CartContextType } from "../contexts/CartContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { cart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user) return;
    await user.update({ unsafeMetadata: { billing: form } });
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });
    const data = await response.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <section className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-xl font-bold">Billing details</h1>
      <div className="space-y-2">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          className="w-full border p-2"
          required
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2"
          required
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border p-2"
          required
        />
        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          className="w-full border p-2"
          required
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full border p-2"
          required
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 w-full rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 hover:bg-gray-600"
      >
        Proceed to Pay
      </button>
    </section>
  );
}

