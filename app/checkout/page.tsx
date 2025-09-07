"use client";
import { useState, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import { CartContext } from "@/app/contexts/CartContext";

function CheckoutPage() {
  const { user } = useUser();
  const cartContext = useContext(CartContext);
  const [billing, setBilling] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState<{
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }>({});
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const addressRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s,'-]{5,100}$/u;
  const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,100}$/u;
  const postalCodeRegex = /^[0-9]{4,5}$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setBilling({ ...billing, [name]: value });
  };

  const validate = (): boolean => {
    const newErrors: {
      address?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    } = {};

    if (!addressRegex.test(billing.address.trim())) {
      newErrors.address = "Adresse invalide";
    }

    if (!cityRegex.test(billing.city.trim())) {
      newErrors.city = "Ville invalide";
    }

    if (!postalCodeRegex.test(billing.postalCode.trim())) {
      newErrors.postalCode = "Code postal invalide";
    }

    if (!billing.country) {
      newErrors.country = "Pays requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;
    setCheckoutError(null);
    const sanitized = {
      address: billing.address.trim(),
      city: billing.city.trim(),
      postalCode: billing.postalCode.trim(),
      country: billing.country,
    };
    if (user) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          billing: sanitized,
        },
      });
    }

    const items = (cartContext?.cart || []).reduce(
      (
        acc: { id: string | number; quantity: number }[],
        item
      ) => {
        const existing = acc.find((i) => i.id === item.id);
        if (existing) existing.quantity += 1;
        else acc.push({ id: item.id, quantity: 1 });
        return acc;
      },
      []
    );
    if (items.length === 0) {
      setCheckoutError("Votre panier est vide.");
      return;
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
                required
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address}</p>
              )}
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
                required
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
              )}
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
                required
              />
              {errors.postalCode && (
                <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>
              )}
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
                required
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
              {errors.country && (
                <p className="mt-1 text-xs text-red-600">{errors.country}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-sm bg-gray-700 px-5 py-3 text-sm text-gray-100"
              >
                Procéder au paiement
              </button>
            </div>
            {checkoutError && (
              <p className="text-center text-sm text-red-600">
                {checkoutError}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;