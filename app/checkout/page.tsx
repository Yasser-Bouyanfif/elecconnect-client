"use client";

import { useContext, useState, ChangeEvent, FormEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { CartContext, CartContextType } from "../contexts/CartContext";
import { STRIPE_PUBLIC_KEY } from "../lib/constants";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || "");

type Address = {
  fullName: string;
  company?: string;
  address1: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
};

export default function CheckoutPage() {
  const { cart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();

  const [address, setAddress] = useState<Address>({
    fullName: "",
    company: "",
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
    phone: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;

    // store address in Clerk unsafeMetadata
    await user?.update({
      unsafeMetadata: { ...(user.unsafeMetadata || {}), address },
    });

    const products = cart.map((item) => item.id);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products,
        address,
        userId: user?.id,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      }),
    });

    const data = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <section className="mx-auto max-w-screen-md px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          placeholder="Full name"
          value={address.fullName}
          onChange={handleChange}
          className="w-full border px-2 py-1"
          required
        />
        <input
          name="company"
          placeholder="Company"
          value={address.company}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
        <input
          name="address1"
          placeholder="Address line 1"
          value={address.address1}
          onChange={handleChange}
          className="w-full border px-2 py-1"
          required
        />
        <input
          name="address2"
          placeholder="Address line 2"
          value={address.address2}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
        <input
          name="postalCode"
          placeholder="Postal code"
          value={address.postalCode}
          onChange={handleChange}
          className="w-full border px-2 py-1"
          required
        />
        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          className="w-full border px-2 py-1"
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={address.country}
          onChange={handleChange}
          className="w-full border px-2 py-1"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={address.phone}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
        <button
          type="submit"
          className="rounded-sm bg-gray-700 px-5 py-2 text-sm text-gray-100"
        >
          Pay with Stripe
        </button>
      </form>
    </section>
  );
}

