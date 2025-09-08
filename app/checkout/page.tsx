"use client";

import { useContext, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { CartContext, CartContextType } from "../contexts/CartContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { cart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
    phoneCode: "+1",
    phoneNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = cart.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const discount = 0;
  const grandTotal = total - discount;

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
      {step === 1 ? (
        <>
          <h1 className="mb-4 text-xl font-bold">Billing details</h1>
          <div className="space-y-2">
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full border p-2"
              required
            />
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
              className="w-full border p-2"
            />
            <input
              name="address1"
              value={form.address1}
              onChange={handleChange}
              placeholder="Address 1"
              className="w-full border p-2"
              required
            />
            <input
              name="address2"
              value={form.address2}
              onChange={handleChange}
              placeholder="Address 2"
              className="w-full border p-2"
            />
            <input
              name="postalCode"
              type="number"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
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
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full border p-2"
              required
            />
            <div className="flex">
              <select
                name="phoneCode"
                value={form.phoneCode}
                onChange={handleChange}
                className="border p-2"
              >
                <option value="+1">+1</option>
                <option value="+33">+33</option>
                <option value="+44">+44</option>
              </select>
              <input
                name="phoneNumber"
                type="number"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                className="ml-2 w-full border p-2"
                required
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-4 w-full rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 hover:bg-gray-600"
          >
            Suivant
          </button>
        </>
      ) : (
        <>
          <h1 className="mb-4 text-xl font-bold">Order summary</h1>
          <div className="space-y-2">
            <p>{form.fullName}</p>
            {form.company && <p>{form.company}</p>}
            <p>{form.address1}</p>
            {form.address2 && <p>{form.address2}</p>}
            <p>
              {form.postalCode} {form.city}
            </p>
            <p>{form.country}</p>
            <p>
              {form.phoneCode} {form.phoneNumber}
            </p>
          </div>
          <div className="mt-4 space-y-1">
            <p>Total: {total.toFixed(2)}</p>
            <p>Discount: {discount.toFixed(2)}</p>
            <p className="font-bold">Grand Total: {grandTotal.toFixed(2)}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full rounded-sm bg-gray-300 px-5 py-3 text-sm text-gray-700 hover:bg-gray-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 hover:bg-gray-600"
            >
              Proceed to Pay
            </button>
          </div>
        </>
      )}
    </section>
  );
}

