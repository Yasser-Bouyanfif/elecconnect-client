"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartContext,
  CartContextType,
  CheckoutAddress,
} from "@/app/contexts/CartContext";
import {
  CheckoutAddressErrors,
  hasCheckoutErrors,
  sanitizeCheckoutField,
  validateCheckoutAddress,
  validateCheckoutField,
} from "@/app/lib/validation";

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
  const [shippingErrors, setShippingErrors] =
    useState<CheckoutAddressErrors>({});
  const [billingErrors, setBillingErrors] =
    useState<CheckoutAddressErrors>({});
  const [formError, setFormError] = useState("");

  const onChangeFactory = (
      updater: (updates: Partial<CheckoutAddress>) => void,
      setErrors: React.Dispatch<
        React.SetStateAction<CheckoutAddressErrors>
      >
    ) =>
    (field: keyof CheckoutAddress) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = sanitizeCheckoutField(field, e.target.value);
        updater({ [field]: sanitizedValue });

        setErrors((prev) => {
          const error = validateCheckoutField(field, sanitizedValue);
          if (error) {
            return { ...prev, [field]: error };
          }

          if (prev[field]) {
            const next = { ...prev };
            delete next[field];
            return next;
          }

          return prev;
        });

        if (formError) {
          setFormError("");
        }
      };

  const shipping = shippingAddress;
  const billing = billingAddress;
  const useSameForBilling = useSameAddressForBilling;
  const s = onChangeFactory(updateShippingAddress, setShippingErrors);
  const b = onChangeFactory(updateBillingAddress, setBillingErrors);

  const handleToggleSameAddress = (checked: boolean) => {
    setUseSameAddressForBilling(checked);
    if (checked) {
      setBillingErrors({});
    }
    if (formError) {
      setFormError("");
    }
  };

  const handleContinue = () => {
    const sanitizedShipping: CheckoutAddress = { ...shipping };
    const shippingUpdates: Partial<CheckoutAddress> = {};

    (Object.keys(shipping) as (keyof CheckoutAddress)[]).forEach((field) => {
      const sanitizedValue = sanitizeCheckoutField(field, shipping[field]);
      sanitizedShipping[field] = sanitizedValue;
      if (sanitizedValue !== shipping[field]) {
        shippingUpdates[field] = sanitizedValue;
      }
    });

    if (Object.keys(shippingUpdates).length > 0) {
      updateShippingAddress(shippingUpdates);
    }

    let sanitizedBilling: CheckoutAddress = { ...billing };
    const billingUpdates: Partial<CheckoutAddress> = {};

    if (useSameForBilling) {
      sanitizedBilling = { ...sanitizedShipping };
    } else {
      (Object.keys(billing) as (keyof CheckoutAddress)[]).forEach((field) => {
        const sanitizedValue = sanitizeCheckoutField(field, billing[field]);
        sanitizedBilling[field] = sanitizedValue;
        if (sanitizedValue !== billing[field]) {
          billingUpdates[field] = sanitizedValue;
        }
      });

      if (Object.keys(billingUpdates).length > 0) {
        updateBillingAddress(billingUpdates);
      }
    }

    const shippingValidation = validateCheckoutAddress(sanitizedShipping);
    const billingValidation = useSameForBilling
      ? {}
      : validateCheckoutAddress(sanitizedBilling);

    setShippingErrors(shippingValidation);
    setBillingErrors(billingValidation);

    if (
      hasCheckoutErrors(shippingValidation) ||
      hasCheckoutErrors(billingValidation)
    ) {
      setFormError(
        "Veuillez corriger les informations invalides avant de continuer."
      );
      return;
    }

    setFormError("");
    router.push("/checkout/shipping");
  };

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
              <div className="flex flex-col">
                <input className="input input-bordered w-full" name="given-name" autoComplete="given-name" placeholder="Prénom" value={shipping.firstName} onChange={s("firstName")} />
                {shippingErrors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.firstName}</p>
                )}
              </div>
              <div className="flex flex-col">
                <input className="input input-bordered w-full" name="family-name" autoComplete="family-name" placeholder="Nom" value={shipping.lastName} onChange={s("lastName")} />
                {shippingErrors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.lastName}</p>
                )}
              </div>
              <div className="flex flex-col sm:col-span-2">
                <input className="input input-bordered w-full" name="organization" autoComplete="organization" placeholder="Société (optionnel)" value={shipping.company} onChange={s("company")} />
                {shippingErrors.company && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.company}</p>
                )}
              </div>
              <div className="flex flex-col sm:col-span-2">
                <input className="input input-bordered w-full" name="address-line1" autoComplete="address-line1" placeholder="Adresse" value={shipping.address1} onChange={s("address1")} />
                {shippingErrors.address1 && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.address1}</p>
                )}
              </div>
              <div className="flex flex-col sm:col-span-2">
                <input className="input input-bordered w-full" name="address-line2" autoComplete="address-line2" placeholder="Complément d'adresse (optionnel)" value={shipping.address2} onChange={s("address2")} />
                {shippingErrors.address2 && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.address2}</p>
                )}
              </div>
              <div className="flex flex-col">
                <input className="input input-bordered w-full" name="address-level2" autoComplete="address-level2" placeholder="Ville" value={shipping.city} onChange={s("city")} />
                {shippingErrors.city && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.city}</p>
                )}
              </div>
              <div className="flex flex-col">
                <input className="input input-bordered w-full" name="postal-code" autoComplete="postal-code" placeholder="Code postal" value={shipping.postalCode} onChange={s("postalCode")} />
                {shippingErrors.postalCode && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.postalCode}</p>
                )}
              </div>
              <div className="flex flex-col">
                <input className="input input-bordered w-full" name="country" autoComplete="country" placeholder="Pays" value={shipping.country} onChange={s("country")} />
                {shippingErrors.country && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.country}</p>
                )}
              </div>
              <div className="flex flex-col">
                <input className="input input-bordered w-full" name="tel" autoComplete="tel" placeholder="Téléphone (optionnel)" value={shipping.phone} onChange={s("phone")} />
                {shippingErrors.phone && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.phone}</p>
                )}
              </div>
              <div className="flex flex-col sm:col-span-2">
                <input className="input input-bordered w-full" type="email" name="email" autoComplete="email" placeholder="Email (optionnel)" value={shipping.email} onChange={s("email")} />
                {shippingErrors.email && (
                  <p className="mt-1 text-xs text-red-500">{shippingErrors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Billing toggle */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" checked={useSameForBilling} onChange={(e) => handleToggleSameAddress(e.target.checked)} />
              <span className="text-slate-800">Utiliser la même adresse pour la facturation</span>
            </label>
            {!useSameForBilling && (
              <div className="mt-4">
                <h2 className="text-base font-semibold text-slate-900">Adresse de facturation</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <input className="input input-bordered w-full" name="billing-given-name" autoComplete="given-name" placeholder="Prénom" value={billing.firstName} onChange={b("firstName")} />
                    {billingErrors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.firstName}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input className="input input-bordered w-full" name="billing-family-name" autoComplete="family-name" placeholder="Nom" value={billing.lastName} onChange={b("lastName")} />
                    {billingErrors.lastName && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.lastName}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <input className="input input-bordered w-full" name="billing-organization" autoComplete="organization" placeholder="Société (optionnel)" value={billing.company} onChange={b("company")} />
                    {billingErrors.company && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.company}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <input className="input input-bordered w-full" name="billing-address-line1" autoComplete="address-line1" placeholder="Adresse" value={billing.address1} onChange={b("address1")} />
                    {billingErrors.address1 && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.address1}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <input className="input input-bordered w-full" name="billing-address-line2" autoComplete="address-line2" placeholder="Complément d'adresse (optionnel)" value={billing.address2} onChange={b("address2")} />
                    {billingErrors.address2 && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.address2}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input className="input input-bordered w-full" name="billing-address-level2" autoComplete="address-level2" placeholder="Ville" value={billing.city} onChange={b("city")} />
                    {billingErrors.city && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.city}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input className="input input-bordered w-full" name="billing-postal-code" autoComplete="postal-code" placeholder="Code postal" value={billing.postalCode} onChange={b("postalCode")} />
                    {billingErrors.postalCode && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.postalCode}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input className="input input-bordered w-full" name="billing-country" autoComplete="country" placeholder="Pays" value={billing.country} onChange={b("country")} />
                    {billingErrors.country && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.country}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input className="input input-bordered w-full" name="billing-tel" autoComplete="tel" placeholder="Téléphone (optionnel)" value={billing.phone} onChange={b("phone")} />
                    {billingErrors.phone && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.phone}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <input className="input input-bordered w-full" type="email" name="billing-email" autoComplete="email" placeholder="Email (optionnel)" value={billing.email} onChange={b("email")} />
                    {billingErrors.email && (
                      <p className="mt-1 text-xs text-red-500">{billingErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions (no payment button here as requested) */}
          <div className="flex items-center justify-between">
            <Link href="/cart" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800">Retour au panier</Link>
            <div className="flex flex-col items-end gap-2">
              {formError && (
                <p className="text-xs text-red-500 text-right">{formError}</p>
              )}
              <button type="button" onClick={handleContinue} className="btn btn-soft btn-primary">Continuer</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
