"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartContext,
  CartContextType,
  CheckoutAddress,
} from "@/app/contexts/CartContext";

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' \-]{2,60}$/;
const COMPANY_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9'&.,\- ]{0,80}$/;
const ADDRESS_LINE_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9'.,\- ]{5,120}$/;
const OPTIONAL_ADDRESS_LINE_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9'.,\- ]{0,120}$/;
const CITY_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' \-]{2,80}$/;
const POSTAL_CODE_REGEX = /^\d{5}$/;
const FRENCH_PHONE_REGEX = /^(?:\+33 ?|0)[1-9](?:[ .\-]?\d{2}){4}$/;

const validateAddress = (
  address: CheckoutAddress,
  label: "livraison" | "facturation"
) => {
  if (!NAME_REGEX.test(address.firstName)) {
    return `Le prénom de l'adresse de ${label} doit contenir uniquement des lettres (2 à 60 caractères).`;
  }

  if (!NAME_REGEX.test(address.lastName)) {
    return `Le nom de l'adresse de ${label} doit contenir uniquement des lettres (2 à 60 caractères).`;
  }

  if (address.company && !COMPANY_REGEX.test(address.company)) {
    return `Le champ société de l'adresse de ${label} contient des caractères non autorisés.`;
  }

  if (!ADDRESS_LINE_REGEX.test(address.address1)) {
    return `L'adresse principale de ${label} doit contenir entre 5 et 120 caractères valides.`;
  }

  if (address.address2 && !OPTIONAL_ADDRESS_LINE_REGEX.test(address.address2)) {
    return `Le complément d'adresse de ${label} contient des caractères non autorisés.`;
  }

  if (!CITY_REGEX.test(address.city)) {
    return `La ville de l'adresse de ${label} doit contenir uniquement des lettres (2 à 80 caractères).`;
  }

  if (!POSTAL_CODE_REGEX.test(address.postalCode)) {
    return `Le code postal de l'adresse de ${label} doit comporter 5 chiffres.`;
  }

  if (address.country !== "France") {
    return `Le pays de l'adresse de ${label} doit être "France".`;
  }

  if (!FRENCH_PHONE_REGEX.test(address.phone)) {
    return `Le numéro de téléphone de ${label} doit être un numéro français valide.`;
  }

  return null;
};

export default function AddressStepPage() {
  const router = useRouter();
  const {
    shippingAddress,
    billingAddress,
    useSameAddressForBilling,
    updateShippingAddress,
    updateBillingAddress,
    setUseSameAddressForBilling,
  } = useContext(CartContext) as CartContextType;
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);

  const saveAndContinue = () => {
    const shippingValidation = validateAddress(shipping, "livraison");
    if (shippingValidation) {
      setShippingError(shippingValidation);
      setBillingError(null);
      return;
    }

    setShippingError(null);

    if (!useSameForBilling) {
      const billingValidation = validateAddress(billing, "facturation");
      if (billingValidation) {
        setBillingError(billingValidation);
        return;
      }
    }

    setBillingError(null);
    router.push("/checkout/shipping");
  };

  const onChangeFactory =
    (
      updater: (updates: Partial<CheckoutAddress>) => void
    ) =>
    (field: keyof CheckoutAddress) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        updater({ [field]: e.target.value });

  const shipping = shippingAddress;
  const billing = billingAddress;
  const useSameForBilling = useSameAddressForBilling;
  const s = onChangeFactory(updateShippingAddress);
  const b = onChangeFactory(updateBillingAddress);

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Étape 1 : Adresse(s)</h1>
        <p className="mt-1 text-slate-600">Saisissez votre adresse de livraison et, si nécessaire, une adresse de facturation différente.</p>

        <div className="mt-8 grid grid-cols-1 gap-6">
          {/* Shipping address */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-900">Adresse de livraison</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="input input-bordered w-full" name="given-name" autoComplete="given-name" placeholder="Prénom" value={shipping.firstName} onChange={s("firstName")} required maxLength={60} />
              <input className="input input-bordered w-full" name="family-name" autoComplete="family-name" placeholder="Nom" value={shipping.lastName} onChange={s("lastName")} required maxLength={60} />
              <input className="input input-bordered w-full sm:col-span-2" name="organization" autoComplete="organization" placeholder="Société (optionnel)" value={shipping.company} onChange={s("company")} maxLength={80} />
              <input className="input input-bordered w-full sm:col-span-2" name="address-line1" autoComplete="address-line1" placeholder="Adresse" value={shipping.address1} onChange={s("address1")} required maxLength={120} />
              <input className="input input-bordered w-full sm:col-span-2" name="address-line2" autoComplete="address-line2" placeholder="Complément d'adresse (optionnel)" value={shipping.address2} onChange={s("address2")} maxLength={120} />
              <input className="input input-bordered w-full" name="address-level2" autoComplete="address-level2" placeholder="Ville" value={shipping.city} onChange={s("city")} required maxLength={80} />
              <input className="input input-bordered w-full" name="postal-code" autoComplete="postal-code" placeholder="Code postal" value={shipping.postalCode} onChange={s("postalCode")} required maxLength={5} inputMode="numeric" pattern="\d{5}" />
              <input className="input input-bordered w-full" name="country" autoComplete="country" placeholder="Pays" value={shipping.country} disabled readOnly />
              <input className="input input-bordered w-full" name="tel" autoComplete="tel" placeholder="Téléphone" value={shipping.phone} onChange={s("phone")} required maxLength={20} inputMode="tel" pattern="^(?:\\+33 ?|0)[1-9](?:[ .\\-]?\\d{2}){4}$" />
            </div>
            {shippingError && (
              <p className="mt-3 text-sm text-red-500" role="alert">
                {shippingError}
              </p>
            )}
          </div>

          {/* Billing toggle */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" checked={useSameForBilling} onChange={(e) => {
                setUseSameAddressForBilling(e.target.checked);
                if (e.target.checked) {
                  setBillingError(null);
                }
              }} />
              <span className="text-slate-800">Utiliser la même adresse pour la facturation</span>
            </label>
            {!useSameForBilling && (
              <div className="mt-4">
                <h2 className="text-base font-semibold text-slate-900">Adresse de facturation</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input className="input input-bordered w-full" name="billing-given-name" autoComplete="given-name" placeholder="Prénom" value={billing.firstName} onChange={b("firstName")} required maxLength={60} />
                  <input className="input input-bordered w-full" name="billing-family-name" autoComplete="family-name" placeholder="Nom" value={billing.lastName} onChange={b("lastName")} required maxLength={60} />
                  <input className="input input-bordered w-full sm:col-span-2" name="billing-organization" autoComplete="organization" placeholder="Société (optionnel)" value={billing.company} onChange={b("company")} maxLength={80} />
                  <input className="input input-bordered w-full sm:col-span-2" name="billing-address-line1" autoComplete="address-line1" placeholder="Adresse" value={billing.address1} onChange={b("address1")} required maxLength={120} />
                  <input className="input input-bordered w-full sm:col-span-2" name="billing-address-line2" autoComplete="address-line2" placeholder="Complément d'adresse (optionnel)" value={billing.address2} onChange={b("address2")} maxLength={120} />
                  <input className="input input-bordered w-full" name="billing-address-level2" autoComplete="address-level2" placeholder="Ville" value={billing.city} onChange={b("city")} required maxLength={80} />
                  <input className="input input-bordered w-full" name="billing-postal-code" autoComplete="postal-code" placeholder="Code postal" value={billing.postalCode} onChange={b("postalCode")} required maxLength={5} inputMode="numeric" pattern="\d{5}" />
                  <input className="input input-bordered w-full" name="billing-country" autoComplete="country" placeholder="Pays" value={billing.country} disabled readOnly />
                  <input className="input input-bordered w-full" name="billing-tel" autoComplete="tel" placeholder="Téléphone" value={billing.phone} onChange={b("phone")} required maxLength={20} inputMode="tel" pattern="^(?:\\+33 ?|0)[1-9](?:[ .\\-]?\\d{2}){4}$" />
                </div>
                {billingError && (
                  <p className="mt-3 text-sm text-red-500" role="alert">
                    {billingError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions (no payment button here as requested) */}
          <div className="flex items-center justify-between">
            <Link href="/cart" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800">Retour au panier</Link>
            <button type="button" onClick={saveAndContinue} className="btn btn-soft btn-primary">Continuer</button>
          </div>
        </div>
      </div>
    </section>
  );
}
