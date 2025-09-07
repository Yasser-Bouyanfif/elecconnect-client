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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Checkout
            </h1>
          </header>

          <form onSubmit={handleSubmit} className="mt-8 w-screen max-w-lg space-y-4">
            <div>
              <label htmlFor="address" className="sr-only">
                Adresse
              </label>
              <input
                id="address"
                name="address"
                placeholder="Adresse"
                value={billing.address}
                onChange={handleChange}
                className="w-full border px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label htmlFor="city" className="sr-only">
                Ville
              </label>
              <input
                id="city"
                name="city"
                placeholder="Ville"
                value={billing.city}
                onChange={handleChange}
                className="w-full border px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="sr-only">
                Code postal
              </label>
              <input
                id="postalCode"
                name="postalCode"
                placeholder="Code postal"
                value={billing.postalCode}
                onChange={handleChange}
                className="w-full border px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label htmlFor="country" className="sr-only">
                Pays
              </label>
              <select
                id="country"
                name="country"
                value={billing.country}
                onChange={handleChange}
                className="w-full border px-2 py-1 text-sm"
              >
                <option value="">Sélectionnez un pays</option>
                <option value="France">France</option>
                <option value="Belgium">Belgique</option>
                <option value="Spain">Espagne</option>
                <option value="Germany">Allemagne</option>
                <option value="Switzerland">Suisse</option>
                <option value="Italy">Italie</option>
                <option value="Andorra">Andorre</option>
                <option value="Monaco">Monaco</option>
                <option value="Luxembourg">Luxembourg</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100"
              >
                Enregistrer l&apos;adresse
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;
