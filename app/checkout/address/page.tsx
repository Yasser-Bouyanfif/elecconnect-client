"use client";

import { useContext, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartContext, type CheckoutAddress } from "@/app/contexts/CartContext";

const addressFields: Array<{
  key: keyof CheckoutAddress;
  name: string;
  autoComplete: string;
  placeholder: string;
  type?: string;
  span?: boolean;
}> = [
  {
    key: "firstName",
    name: "given-name",
    autoComplete: "given-name",
    placeholder: "Prénom",
  },
  {
    key: "lastName",
    name: "family-name",
    autoComplete: "family-name",
    placeholder: "Nom",
  },
  {
    key: "company",
    name: "organization",
    autoComplete: "organization",
    placeholder: "Société (optionnel)",
    span: true,
  },
  {
    key: "address1",
    name: "address-line1",
    autoComplete: "address-line1",
    placeholder: "Adresse",
    span: true,
  },
  {
    key: "address2",
    name: "address-line2",
    autoComplete: "address-line2",
    placeholder: "Complément d'adresse (optionnel)",
    span: true,
  },
  {
    key: "city",
    name: "address-level2",
    autoComplete: "address-level2",
    placeholder: "Ville",
  },
  {
    key: "postalCode",
    name: "postal-code",
    autoComplete: "postal-code",
    placeholder: "Code postal",
  },
  {
    key: "country",
    name: "country",
    autoComplete: "country",
    placeholder: "Pays",
  },
  {
    key: "phone",
    name: "tel",
    autoComplete: "tel",
    placeholder: "Téléphone (optionnel)",
  },
  {
    key: "email",
    name: "email",
    autoComplete: "email",
    placeholder: "Email (optionnel)",
    type: "email",
    span: true,
  },
];

type ChangeHandler = (
  field: keyof CheckoutAddress
) => (event: ChangeEvent<HTMLInputElement>) => void;

function AddressFields({
  address,
  onChange,
  idPrefix,
}: {
  address: CheckoutAddress;
  onChange: ChangeHandler;
  idPrefix: string;
}) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {addressFields.map(({ key, name, autoComplete, placeholder, type, span }) => (
        <input
          key={key}
          id={`${idPrefix}-${name}`}
          name={`${idPrefix}-${name}`}
          type={type ?? "text"}
          autoComplete={autoComplete}
          className={`input input-bordered w-full${span ? " sm:col-span-2" : ""}`}
          placeholder={placeholder}
          value={address[key]}
          onChange={onChange(key)}
        />
      ))}
    </div>
  );
}

export default function AddressStepPage() {
  const router = useRouter();
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("Cart context is unavailable");
  }

  const {
    shippingAddress,
    billingAddress,
    useSameAddressForBilling,
    updateShippingAddress,
    updateBillingAddress,
    setUseSameAddressForBilling,
  } = cartContext;

  const handleChangeFactory = (
    updater: (updates: Partial<CheckoutAddress>) => void
  ): ChangeHandler =>
    (field) =>
      (event) => {
        updater({ [field]: event.target.value });
      };

  const saveAndContinue = () => {
    router.push("/checkout/shipping");
  };

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Étape 1 : Adresse(s)
        </h1>
        <p className="mt-1 text-slate-600">
          Saisissez votre adresse de livraison et, si nécessaire, une adresse de facturation différente.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6">
          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Adresse de livraison
            </h2>
            <AddressFields
              address={shippingAddress}
              onChange={handleChangeFactory(updateShippingAddress)}
              idPrefix="shipping"
            />
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={useSameAddressForBilling}
                onChange={(event) =>
                  setUseSameAddressForBilling(event.target.checked)
                }
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
                <AddressFields
                  address={billingAddress}
                  onChange={handleChangeFactory(updateBillingAddress)}
                  idPrefix="billing"
                />
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
            <button
              type="button"
              onClick={saveAndContinue}
              className="btn btn-primary"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
