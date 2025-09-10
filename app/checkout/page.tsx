"use client";

import React, { useContext, useEffect, useState } from "react";
import { CartContext, CartContextType } from "../contexts/CartContext";
import productApi from "@/app/_utils/productApis";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLIC_KEY } from "@/app/lib/constants";
import { useUser } from "@clerk/nextjs";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY || "");

type Address = {
  fullName: string;
  company?: string;
  address1: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
};

export default function Checkout() {
  const { cart } = useContext(CartContext) as CartContextType;
  const productIds = cart.map((item) => item.id);
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
  const [subtotal, setSubtotal] = useState(0);
  const shippingPrice = 500;
  const { user } = useUser();

  useEffect(() => {
    async function fetchPrices() {
      let total = 0;
      for (const id of productIds) {
        try {
          const res = await productApi.getProductById(String(id));
          const data = res?.data?.data?.[0] ?? res?.data?.data;
          total += data?.price ?? 0;
        } catch (e) {
          console.error(e);
        }
      }
      setSubtotal(total);
    }
    if (productIds.length) fetchPrices();
  }, [productIds]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await user?.update({ unsafeMetadata: { address } });
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: productIds, address }),
    });
    const data = await res.json();
    const stripe = await stripePromise;
    if (stripe && data.id) {
      await stripe.redirectToCheckout({ sessionId: data.id });
    } else if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          placeholder="Full Name"
          value={address.fullName}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          name="company"
          placeholder="Company"
          value={address.company}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          name="address1"
          placeholder="Address"
          value={address.address1}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          name="address2"
          placeholder="Address 2"
          value={address.address2}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          name="postalCode"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={address.country}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={address.phone}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <div className="border-t pt-4">
          <p>Subtotal: {(subtotal / 100).toFixed(2)} €</p>
          <p>Shipping: {(shippingPrice / 100).toFixed(2)} €</p>
          <p className="font-semibold">
            Total: {((subtotal + shippingPrice) / 100).toFixed(2)} €
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Pay with Stripe
        </button>
      </form>
    </div>
  );
}
