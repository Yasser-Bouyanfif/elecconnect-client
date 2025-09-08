"use client";

import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

import { CartContext, CartContextType } from "../contexts/CartContext";
import orderApis from "../_utils/orderApis";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type FormState = {
  fullName: string;
  company: string;
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
  country: string;
  phoneNumber: string;
};

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    company: "",
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
    phoneNumber: "",
  });
  const [error, setError] = useState<string>("");
  const [orderCreated, setOrderCreated] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const required: (keyof FormState)[] = [
      "fullName",
      "address1",
      "postalCode",
      "city",
      "country",
      "phoneNumber",
    ];
    for (const key of required) {
      if (!form[key].trim()) {
        setError("Please fill in all required fields.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const total = cart.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const discount = 0;
  const grandTotal = total - discount;

  const createOrder = async () => {
    try {
      if (!user) throw new Error("User not found");
      const productIds = cart.map((item) => item.id);
      const data = {
        data: {
          userId: user.id,
          userEmail: user.emailAddresses[0].emailAddress,
          products: productIds,
          address: {
            fullName: form.fullName,
            company: form.company,
            address1: form.address1,
            address2: form.address2,
            postalCode: form.postalCode,
            city: form.city,
            country: form.country,
            phone: form.phoneNumber,
          },
          shipping: {
            carrier: "Chronopost",
            price: 57,
          },
          subTotal: total,
          total: grandTotal,
          paymentStatus: "paid",
        },
      };
      await orderApis.createOrder(data);
      clearCart();
      setOrderCreated(true);
    } catch (err) {
      console.error(err);
      setError("Unable to create order.");
    }
  };

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");
    const cancelled = searchParams.get("cancelled");

    if (cancelled) {
      setError("Payment was cancelled.");
      return;
    }

    if (success && sessionId && !orderCreated && cart.length > 0) {
      (async () => {
        try {
          const res = await fetch(
            `/api/verify-checkout-session?session_id=${sessionId}`,
          );
          const data = await res.json();
          if (data.paid) {
            await createOrder();
          } else {
            setError("Payment not confirmed.");
          }
        } catch (err) {
          console.error(err);
          setError("Unable to verify payment.");
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, orderCreated, cart]);

  const handleNext = () => {
    if (validateForm()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;
    try {
      await user.update({ unsafeMetadata: { billing: form } });
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <section className="mx-auto max-w-md p-4">
      {error && (
        <p className="mb-4 rounded-sm bg-red-100 p-2 text-sm text-red-700">
          {error}
        </p>
      )}
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
            <input
              name="phoneNumber"
              type="number"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              className="w-full border p-2"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleNext}
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
            <p>{form.phoneNumber}</p>
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

