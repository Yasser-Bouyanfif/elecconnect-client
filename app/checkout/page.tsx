"use client";

import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

import { CartContext, CartContextType } from "../contexts/CartContext";
import orderApis from "../_utils/orderApis";
import productApi from "../_utils/productApis";

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

const validators: Record<keyof FormState, RegExp> = {
  fullName: /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{2,}$/,
  company: /^.*$/,
  address1: /^[\w\s,.'-]{5,}$/,
  address2: /^.*$/,
  postalCode: /^\d{4,10}$/,
  city: /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{2,}$/,
  country: /^[A-Za-zÀ-ÖØ-öø-ÿ'\s-]{2,}$/,
  phoneNumber: /^\+?\d{7,15}$/,
};

type PricedItem = { id: string | number; title?: string; price: number };

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext) as CartContextType;
  const { user } = useUser();
  const searchParams = useSearchParams();

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
  const [error, setError] = useState("");
  const [items, setItems] = useState<PricedItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (cart.length === 0) {
      setItems([]);
      setTotal(0);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const res = await Promise.all(
          cart.map((c) => productApi.getProductById(String(c.id)))
        );
        const priced: PricedItem[] = res.map((r, idx) => {
          const p = r?.data?.data?.[0] ?? r?.data?.data;
          return {
            id: p?.id ?? cart[idx].id,
            title: p?.title ?? p?.attributes?.title,
            price: Number(p?.price ?? p?.attributes?.price ?? 0),
          };
        });
        if (!alive) return;
        setItems(priced);
        setTotal(priced.reduce((s, i) => s + i.price, 0));
      } catch (e) {
        console.error(e);
        if (alive) setError("Unable to fetch product prices.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [cart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const value = form[key].trim();
      if (!value || !validators[key].test(value)) {
        setError("Invalid or missing fields.");
        return false;
      }
    }
    if (form.company && !validators.company.test(form.company)) {
      setError("Invalid company.");
      return false;
    }
    if (form.address2 && !validators.address2.test(form.address2)) {
      setError("Invalid address line 2.");
      return false;
    }
    setError("");
    return true;
  };

  const createOrder = async () => {
    try {
      if (!user) throw new Error("User not found");
      const productIds = items.map((i) => i.id);
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
          shipping: { carrier: "Chronopost", price: 57 },
          subTotal: total,
          total: total + 57,
          paymentStatus: "paid",
        },
      };
      await orderApis.createOrder(data);
      clearCart();
    } catch (e) {
      console.error(e);
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
    if (success && sessionId && cart.length > 0) {
      (async () => {
        try {
          const res = await fetch(
            `/api/verify-checkout-session?session_id=${sessionId}`
          );
          const data = await res.json();
          if (data.paid) {
            await createOrder();
          } else {
            setError("Payment not confirmed.");
          }
        } catch (e) {
          console.error(e);
          setError("Unable to verify payment.");
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, cart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;
    try {
      await user.update({ unsafeMetadata: { billing: form } });
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok || !data.id)
        throw new Error(data.error || "Failed to create checkout session");
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({ sessionId: data.id });
      if (result?.error) throw result.error;
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
      <form onSubmit={handleSubmit} className="space-y-2">
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
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone number"
          className="w-full border p-2"
          required
        />
        <div className="mt-4">
          <p className="font-bold">Total: {total.toFixed(2)} €</p>
        </div>
        <button
          type="submit"
          className="w-full rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100 hover:bg-gray-600"
        >
          Pay with Stripe
        </button>
      </form>
    </section>
  );
}
