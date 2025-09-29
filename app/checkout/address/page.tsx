"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CartContext,
  CartContextType,
  CheckoutAddress,
} from "@/app/contexts/CartContext";
import { z } from "zod";

const frenchPhoneRegex = /^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/;

const optionalLimitedString = (max: number, message: string) =>
  z
    .string()
    .optional()
    .transform((value) => (value ?? "").trim())
    .refine((value) => value.length <= max, { message });

const DEFAULT_COUNTRY = "France" as const;

const addressSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(80, "Le prénom est trop long."),
  lastName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(80, "Le nom est trop long."),
  company: optionalLimitedString(120, "Le nom de la société est trop long."),
  address1: z
    .string()
    .trim()
    .min(5, "L'adresse doit contenir au moins 5 caractères.")
    .max(180, "L'adresse est trop longue."),
  address2: optionalLimitedString(180, "Le complément d'adresse est trop long."),
  city: z
    .string()
    .trim()
    .min(2, "La ville doit contenir au moins 2 caractères.")
    .max(120, "La ville est trop longue."),
  postalCode: z
    .string()
    .trim()
    .regex(/^[0-9]{5}$/, "Le code postal doit contenir 5 chiffres."),
  country: z.literal(DEFAULT_COUNTRY),
  phone: z
    .string()
    .trim()
    .min(1, "Le numéro de téléphone est obligatoire.")
    .max(30, "Le numéro de téléphone est trop long.")
    .refine((value) => frenchPhoneRegex.test(value), {
      message: "Le numéro de téléphone doit être un numéro français valide.",
    }),
});

type AddressFormData = z.infer<typeof addressSchema>;
type AddressErrors = Partial<Record<keyof AddressFormData, string>>;

type AddressField = keyof CheckoutAddress;

const createFormState = (address: CheckoutAddress): AddressFormData => ({
  firstName: address.firstName ?? "",
  lastName: address.lastName ?? "",
  company: address.company ?? "",
  address1: address.address1 ?? "",
  address2: address.address2 ?? "",
  city: address.city ?? "",
  postalCode: address.postalCode ?? "",
  country: DEFAULT_COUNTRY,
  phone: address.phone ?? "",
});

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

  const [shippingForm, setShippingForm] = useState<AddressFormData>(() =>
    createFormState(shippingAddress)
  );
  const [billingForm, setBillingForm] = useState<AddressFormData>(() =>
    createFormState(billingAddress)
  );
  const [shippingErrors, setShippingErrors] = useState<AddressErrors>({});
  const [billingErrors, setBillingErrors] = useState<AddressErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setShippingForm(createFormState(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    setBillingForm(createFormState(billingAddress));
  }, [billingAddress]);

  const clearFieldError = (
    setter: React.Dispatch<React.SetStateAction<AddressErrors>>,
    field: AddressField
  ) => {
    setter((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleShippingChange =
    (field: AddressField) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setShippingForm((prev) => ({ ...prev, [field]: value }));
      clearFieldError(setShippingErrors, field);
      if (useSameAddressForBilling) {
        const syncedValue = field === "country" ? DEFAULT_COUNTRY : value;
        setBillingForm((prev) => ({ ...prev, [field]: syncedValue }));
        clearFieldError(setBillingErrors, field);
      }
    };

  const handleBillingChange =
    (field: AddressField) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setBillingForm((prev) => ({ ...prev, [field]: value }));
      clearFieldError(setBillingErrors, field);
    };

  const handleUseSameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setUseSameAddressForBilling(checked);
    if (checked) {
      setBillingForm({ ...shippingForm, country: DEFAULT_COUNTRY });
      setBillingErrors({});
    }
  };

  const collectErrors = (issues: z.ZodIssue[]): AddressErrors =>
    issues.reduce<AddressErrors>((acc, issue) => {
      const field = issue.path[0] as AddressField | undefined;
      if (field && !acc[field]) {
        acc[field] = issue.message;
      }
      return acc;
    }, {});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const shippingValidation = addressSchema.safeParse(shippingForm);
    const billingValidation = useSameAddressForBilling
      ? null
      : addressSchema.safeParse(billingForm);

    const nextShippingErrors = shippingValidation.success
      ? {}
      : collectErrors(shippingValidation.error.issues);

    const nextBillingErrors =
      !billingValidation || billingValidation.success
        ? {}
        : collectErrors(billingValidation.error.issues);

    if (!shippingValidation.success || (billingValidation && !billingValidation.success)) {
      setShippingErrors(nextShippingErrors);
      setBillingErrors(nextBillingErrors);
      setFormError("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    const sanitizedShipping = shippingValidation.data;
    setShippingErrors({});
    setBillingErrors({});
    updateShippingAddress(sanitizedShipping);
    if (!useSameAddressForBilling && billingValidation?.success) {
      updateBillingAddress(billingValidation.data);
    }
    router.push("/checkout/shipping");
  };

  const shippingFieldErrorId = (field: AddressField) =>
    shippingErrors[field] ? `shipping-${field}-error` : undefined;
  const billingFieldErrorId = (field: AddressField) =>
    billingErrors[field] ? `billing-${field}-error` : undefined;

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Étape 1 : Adresse(s)
        </h1>
        <p className="mt-1 text-slate-600">
          Saisissez votre adresse de livraison et, si nécessaire, une adresse de
          facturation différente.
        </p>

        <form
          className="mt-8 grid grid-cols-1 gap-6"
          noValidate
          onSubmit={handleSubmit}
        >
          {formError && (
            <div className="alert alert-error">
              <span>{formError}</span>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-900">
              Adresse de livraison
            </h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <input
                  className="input input-bordered w-full"
                  name="given-name"
                  autoComplete="given-name"
                  placeholder="Prénom"
                  required
                  value={shippingForm.firstName}
                  onChange={handleShippingChange("firstName")}
                  aria-invalid={Boolean(shippingErrors.firstName)}
                  aria-describedby={shippingFieldErrorId("firstName")}
                />
                {shippingErrors.firstName && (
                  <p
                    id="shipping-firstName-error"
                    className="text-sm text-red-500"
                  >
                    {shippingErrors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  className="input input-bordered w-full"
                  name="family-name"
                  autoComplete="family-name"
                  placeholder="Nom"
                  required
                  value={shippingForm.lastName}
                  onChange={handleShippingChange("lastName")}
                  aria-invalid={Boolean(shippingErrors.lastName)}
                  aria-describedby={shippingFieldErrorId("lastName")}
                />
                {shippingErrors.lastName && (
                  <p
                    id="shipping-lastName-error"
                    className="text-sm text-red-500"
                  >
                    {shippingErrors.lastName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <input
                  className="input input-bordered w-full"
                  name="organization"
                  autoComplete="organization"
                  placeholder="Société (optionnel)"
                  value={shippingForm.company}
                  onChange={handleShippingChange("company")}
                  aria-invalid={Boolean(shippingErrors.company)}
                  aria-describedby={shippingFieldErrorId("company")}
                />
                {shippingErrors.company && (
                  <p
                    id="shipping-company-error"
                    className="text-sm text-red-500"
                  >
                    {shippingErrors.company}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <input
                  className="input input-bordered w-full"
                  name="address-line1"
                  autoComplete="address-line1"
                  placeholder="Adresse"
                  required
                  value={shippingForm.address1}
                  onChange={handleShippingChange("address1")}
                  aria-invalid={Boolean(shippingErrors.address1)}
                  aria-describedby={shippingFieldErrorId("address1")}
                />
                {shippingErrors.address1 && (
                  <p
                    id="shipping-address1-error"
                    className="text-sm text-red-500"
                  >
                    {shippingErrors.address1}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <input
                  className="input input-bordered w-full"
                  name="address-line2"
                  autoComplete="address-line2"
                  placeholder="Complément d'adresse (optionnel)"
                  value={shippingForm.address2}
                  onChange={handleShippingChange("address2")}
                  aria-invalid={Boolean(shippingErrors.address2)}
                  aria-describedby={shippingFieldErrorId("address2")}
                />
                {shippingErrors.address2 && (
                  <p
                    id="shipping-address2-error"
                    className="text-sm text-red-500"
                  >
                    {shippingErrors.address2}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  className="input input-bordered w-full"
                  name="address-level2"
                  autoComplete="address-level2"
                  placeholder="Ville"
                  required
                  value={shippingForm.city}
                  onChange={handleShippingChange("city")}
                  aria-invalid={Boolean(shippingErrors.city)}
                  aria-describedby={shippingFieldErrorId("city")}
                />
                {shippingErrors.city && (
                  <p id="shipping-city-error" className="text-sm text-red-500">
                    {shippingErrors.city}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  className="input input-bordered w-full"
                  name="postal-code"
                  autoComplete="postal-code"
                  placeholder="Code postal"
                  required
                  inputMode="numeric"
                  value={shippingForm.postalCode}
                  onChange={handleShippingChange("postalCode")}
                  aria-invalid={Boolean(shippingErrors.postalCode)}
                  aria-describedby={shippingFieldErrorId("postalCode")}
                />
                {shippingErrors.postalCode && (
                  <p
                    id="shipping-postalCode-error"
                    className="text-sm text-red-500"
                  >
                    {shippingErrors.postalCode}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  className="input input-bordered w-full"
                  name="country"
                  autoComplete="country"
                  placeholder="Pays"
                  value={shippingForm.country}
                  disabled
                  aria-disabled="true"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-1">
                <input
                  className="input input-bordered w-full"
                  name="tel"
                  autoComplete="tel"
                  placeholder="Téléphone"
                  required
                  value={shippingForm.phone}
                  onChange={handleShippingChange("phone")}
                  aria-invalid={Boolean(shippingErrors.phone)}
                  aria-describedby={shippingFieldErrorId("phone")}
                  pattern="^(?:\\+33|0)[1-9](?:[ .-]?\\d{2}){4}$"
                />
                {shippingErrors.phone && (
                  <p id="shipping-phone-error" className="text-sm text-red-500">
                    {shippingErrors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={useSameAddressForBilling}
                onChange={handleUseSameChange}
              />
              <span className="text-slate-800">
                Utiliser la même adresse pour la facturation
              </span>
            </label>
            {!useSameAddressForBilling && (
              <div className="mt-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Adresse de facturation
                </h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <input
                      className="input input-bordered w-full"
                      name="billing-given-name"
                      autoComplete="given-name"
                      placeholder="Prénom"
                      required
                      value={billingForm.firstName}
                      onChange={handleBillingChange("firstName")}
                      aria-invalid={Boolean(billingErrors.firstName)}
                      aria-describedby={billingFieldErrorId("firstName")}
                    />
                    {billingErrors.firstName && (
                      <p
                        id="billing-firstName-error"
                        className="text-sm text-red-500"
                      >
                        {billingErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      className="input input-bordered w-full"
                      name="billing-family-name"
                      autoComplete="family-name"
                      placeholder="Nom"
                      required
                      value={billingForm.lastName}
                      onChange={handleBillingChange("lastName")}
                      aria-invalid={Boolean(billingErrors.lastName)}
                      aria-describedby={billingFieldErrorId("lastName")}
                    />
                    {billingErrors.lastName && (
                      <p
                        id="billing-lastName-error"
                        className="text-sm text-red-500"
                      >
                        {billingErrors.lastName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <input
                      className="input input-bordered w-full"
                      name="billing-organization"
                      autoComplete="organization"
                      placeholder="Société (optionnel)"
                      value={billingForm.company}
                      onChange={handleBillingChange("company")}
                      aria-invalid={Boolean(billingErrors.company)}
                      aria-describedby={billingFieldErrorId("company")}
                    />
                    {billingErrors.company && (
                      <p
                        id="billing-company-error"
                        className="text-sm text-red-500"
                      >
                        {billingErrors.company}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <input
                      className="input input-bordered w-full"
                      name="billing-address-line1"
                      autoComplete="address-line1"
                      placeholder="Adresse"
                      required
                      value={billingForm.address1}
                      onChange={handleBillingChange("address1")}
                      aria-invalid={Boolean(billingErrors.address1)}
                      aria-describedby={billingFieldErrorId("address1")}
                    />
                    {billingErrors.address1 && (
                      <p
                        id="billing-address1-error"
                        className="text-sm text-red-500"
                      >
                        {billingErrors.address1}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <input
                      className="input input-bordered w-full"
                      name="billing-address-line2"
                      autoComplete="address-line2"
                      placeholder="Complément d'adresse (optionnel)"
                      value={billingForm.address2}
                      onChange={handleBillingChange("address2")}
                      aria-invalid={Boolean(billingErrors.address2)}
                      aria-describedby={billingFieldErrorId("address2")}
                    />
                    {billingErrors.address2 && (
                      <p
                        id="billing-address2-error"
                        className="text-sm text-red-500"
                      >
                        {billingErrors.address2}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      className="input input-bordered w-full"
                      name="billing-address-level2"
                      autoComplete="address-level2"
                      placeholder="Ville"
                      required
                      value={billingForm.city}
                      onChange={handleBillingChange("city")}
                      aria-invalid={Boolean(billingErrors.city)}
                      aria-describedby={billingFieldErrorId("city")}
                    />
                    {billingErrors.city && (
                      <p
                        id="billing-city-error"
                        className="text-sm text-red-500"
                      >
                        {billingErrors.city}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      className="input input-bordered w-full"
                      name="billing-postal-code"
                      autoComplete="postal-code"
                      placeholder="Code postal"
                      required
                      inputMode="numeric"
                      value={billingForm.postalCode}
                      onChange={handleBillingChange("postalCode")}
                      aria-invalid={Boolean(billingErrors.postalCode)}
                      aria-describedby={billingFieldErrorId("postalCode")}
                    />
                    {billingErrors.postalCode && (
                      <p
                        id="billing-postalCode-error"
                        className="text-sm text-red-500"
                      >
                        {billingErrors.postalCode}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      className="input input-bordered w-full"
                      name="billing-country"
                      autoComplete="country"
                      placeholder="Pays"
                      value={billingForm.country}
                      disabled
                      aria-disabled="true"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      className="input input-bordered w-full"
                      name="billing-tel"
                      autoComplete="tel"
                      placeholder="Téléphone"
                      required
                      value={billingForm.phone}
                      onChange={handleBillingChange("phone")}
                      aria-invalid={Boolean(billingErrors.phone)}
                      aria-describedby={billingFieldErrorId("phone")}
                      pattern="^(?:\\+33|0)[1-9](?:[ .-]?\\d{2}){4}$"
                    />
                    {billingErrors.phone && (
                      <p
                        id="billing-phone-error"
                        className="text-sm text-red-500"
                      >
                        {billingErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800"
            >
              Retour au panier
            </Link>
            <button type="submit" className="btn btn-soft btn-primary">
              Continuer
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
