"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

function CheckoutPage() {
  const { user } = useUser();
  const [billing, setBilling] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (user) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          billing,
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        name="address"
        placeholder="Address"
        value={billing.address}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="city"
        placeholder="City"
        value={billing.city}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="postalCode"
        placeholder="Postal Code"
        value={billing.postalCode}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="country"
        placeholder="Country"
        value={billing.country}
        onChange={handleChange}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Save Billing Info
      </button>
    </form>
  );
}

export default CheckoutPage;