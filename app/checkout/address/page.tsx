"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartContext,
  CartContextType,
  CheckoutAddress,
} from "@/app/contexts/CartContext";

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

  const saveAndContinue = () => {
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
              <input className="input input-bordered w-full" name="given-name" autoComplete="given-name" placeholder="Prénom" value={shipping.firstName} onChange={s("firstName")} />
              <input className="input input-bordered w-full" name="family-name" autoComplete="family-name" placeholder="Nom" value={shipping.lastName} onChange={s("lastName")} />
              <input className="input input-bordered w-full sm:col-span-2" name="organization" autoComplete="organization" placeholder="Société (optionnel)" value={shipping.company} onChange={s("company")} />
              <input className="input input-bordered w-full sm:col-span-2" name="address-line1" autoComplete="address-line1" placeholder="Adresse" value={shipping.address1} onChange={s("address1")} />
              <input className="input input-bordered w-full sm:col-span-2" name="address-line2" autoComplete="address-line2" placeholder="Complément d'adresse (optionnel)" value={shipping.address2} onChange={s("address2")} />
              <input className="input input-bordered w-full" name="address-level2" autoComplete="address-level2" placeholder="Ville" value={shipping.city} onChange={s("city")} />
              <input className="input input-bordered w-full" name="postal-code" autoComplete="postal-code" placeholder="Code postal" value={shipping.postalCode} onChange={s("postalCode")} />
              <input className="input input-bordered w-full" name="country" autoComplete="country" placeholder="Pays" value={shipping.country} onChange={s("country")} />
              <input className="input input-bordered w-full" name="tel" autoComplete="tel" placeholder="Téléphone (optionnel)" value={shipping.phone} onChange={s("phone")} />
              <input className="input input-bordered w-full sm:col-span-2" type="email" name="email" autoComplete="email" placeholder="Email (optionnel)" value={shipping.email} onChange={s("email")} />
            </div>
          </div>

          {/* Billing toggle */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" checked={useSameForBilling} onChange={(e) => setUseSameAddressForBilling(e.target.checked)} />
              <span className="text-slate-800">Utiliser la même adresse pour la facturation</span>
            </label>
            {!useSameForBilling && (
              <div className="mt-4">
                <h2 className="text-base font-semibold text-slate-900">Adresse de facturation</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input className="input input-bordered w-full" name="billing-given-name" autoComplete="given-name" placeholder="Prénom" value={billing.firstName} onChange={b("firstName")} />
                  <input className="input input-bordered w-full" name="billing-family-name" autoComplete="family-name" placeholder="Nom" value={billing.lastName} onChange={b("lastName")} />
                  <input className="input input-bordered w-full sm:col-span-2" name="billing-organization" autoComplete="organization" placeholder="Société (optionnel)" value={billing.company} onChange={b("company")} />
                  <input className="input input-bordered w-full sm:col-span-2" name="billing-address-line1" autoComplete="address-line1" placeholder="Adresse" value={billing.address1} onChange={b("address1")} />
                  <input className="input input-bordered w-full sm:col-span-2" name="billing-address-line2" autoComplete="address-line2" placeholder="Complément d'adresse (optionnel)" value={billing.address2} onChange={b("address2")} />
                  <input className="input input-bordered w-full" name="billing-address-level2" autoComplete="address-level2" placeholder="Ville" value={billing.city} onChange={b("city")} />
                  <input className="input input-bordered w-full" name="billing-postal-code" autoComplete="postal-code" placeholder="Code postal" value={billing.postalCode} onChange={b("postalCode")} />
                  <input className="input input-bordered w-full" name="billing-country" autoComplete="country" placeholder="Pays" value={billing.country} onChange={b("country")} />
                  <input className="input input-bordered w-full" name="billing-tel" autoComplete="tel" placeholder="Téléphone (optionnel)" value={billing.phone} onChange={b("phone")} />
                  <input className="input input-bordered w-full sm:col-span-2" type="email" name="billing-email" autoComplete="email" placeholder="Email (optionnel)" value={billing.email} onChange={b("email")} />
                </div>
              </div>
            )}
          </div>

          {/* Actions (no payment button here as requested) */}
          <div className="flex items-center justify-between">
            <Link href="/cart" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800">Retour au panier</Link>
            <button type="button" onClick={saveAndContinue} className="btn btn-primary">Continuer</button>
          </div>
        </div>
      </div>
    </section>
  );
}
