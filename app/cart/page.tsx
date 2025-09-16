"use client";

import { useContext, useEffect, useMemo, useState } from "react";

import {
  CartContext,
  CartContextType,
  CartItem,
  ShippingAddress,
  ShippingRate,
} from "../contexts/CartContext";
import { SERVER_URL } from "../lib/constants";

type CheckoutItem = {
  title?: string;
  price?: number;
  quantity: number;
};

const CURRENCY_FALLBACK = "EUR";

const ADDRESS_FIELDS: (keyof ShippingAddress)[] = [
  "fullName",
  "company",
  "address1",
  "address2",
  "city",
  "state",
  "postalCode",
  "country",
  "phone",
  "email",
];

function formatCurrency(amount: number, currency: string = CURRENCY_FALLBACK) {
  if (!Number.isFinite(amount)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function safeTrim(value?: string | null) {
  return value?.trim() ?? "";
}

function normalizeAddress(address: ShippingAddress): ShippingAddress {
  return {
    fullName: safeTrim(address.fullName),
    company: safeTrim(address.company),
    address1: safeTrim(address.address1),
    address2: safeTrim(address.address2),
    city: safeTrim(address.city),
    state: safeTrim(address.state),
    postalCode: safeTrim(address.postalCode),
    country: safeTrim(address.country).toUpperCase(),
    phone: safeTrim(address.phone),
    email: safeTrim(address.email),
  } satisfies ShippingAddress;
}

function addressesEqual(
  a?: ShippingAddress | null,
  b?: ShippingAddress | null
) {
  if (!a && !b) return true;
  if (!a || !b) return false;

  const normalizedA = normalizeAddress(a);
  const normalizedB = normalizeAddress(b);

  return ADDRESS_FIELDS.every((field) => {
    const valueA = normalizedA[field] ?? "";
    const valueB = normalizedB[field] ?? "";
    return valueA === valueB;
  });
}

type ParcelInput = {
  length: string;
  width: string;
  height: string;
  distance_unit: string;
  weight: string;
  mass_unit: string;
};

function buildParcelFromCart(cart: CartItem[]): ParcelInput {
  const fallbackDimensions = {
    length: 30,
    width: 20,
    height: 10,
  };

  const referenceItem = cart.find(
    (item) => item.length && item.width && item.height
  );

  const totalWeight = cart.reduce((sum, item) => {
    const weight =
      typeof item.weight === "number" && Number.isFinite(item.weight)
        ? item.weight
        : 0.5;
    return sum + weight;
  }, 0);

  const normalizedWeight = Math.max(totalWeight, 0.1);

  const length =
    typeof referenceItem?.length === "number"
      ? referenceItem.length
      : fallbackDimensions.length;
  const width =
    typeof referenceItem?.width === "number"
      ? referenceItem.width
      : fallbackDimensions.width;
  const height =
    typeof referenceItem?.height === "number"
      ? referenceItem.height
      : fallbackDimensions.height;

  return {
    length: length.toString(),
    width: width.toString(),
    height: height.toString(),
    distance_unit: "cm",
    weight: normalizedWeight.toFixed(2),
    mass_unit: "kg",
  } satisfies ParcelInput;
}

async function createCheckoutSession(payload: {
  items: CheckoutItem[];
  shippingRate?: ShippingRate | null;
  shippingAddress?: ShippingAddress | null;
}) {
  const body = {
    items: payload.items,
    shippingRate: payload.shippingRate ?? undefined,
    shippingAddress: payload.shippingAddress ?? undefined,
  };

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data as { error?: string })?.error ??
      "Le paiement n'a pas pu être démarré.";
    throw new Error(message);
  }

  return data as { url?: string };
}

function CartPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    shippingAddress,
    setShippingAddress,
    selectedShippingRate,
    setSelectedShippingRate,
  } = useContext(CartContext) as CartContextType;

  const groups = useMemo(() => {
    const result: Record<string, { item: CartItem; quantity: number }> = {};

    cart.forEach((item) => {
      const key = item.id.toString();
      if (result[key]) {
        result[key].quantity += 1;
      } else {
        result[key] = { item, quantity: 1 };
      }
    });

    return result;
  }, [cart]);

  const groupedItems = useMemo(() => Object.values(groups), [groups]);

  const [subtotal, setSubtotal] = useState(0);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [isAddressDirty, setIsAddressDirty] = useState(false);

  const [addressForm, setAddressForm] = useState<ShippingAddress>(() => ({
    fullName: shippingAddress?.fullName ?? "",
    company: shippingAddress?.company ?? "",
    address1: shippingAddress?.address1 ?? "",
    address2: shippingAddress?.address2 ?? "",
    city: shippingAddress?.city ?? "",
    state: shippingAddress?.state ?? "",
    postalCode: shippingAddress?.postalCode ?? "",
    country: shippingAddress?.country ?? "FR",
    phone: shippingAddress?.phone ?? "",
    email: shippingAddress?.email ?? "",
  }));

  useEffect(() => {
    const map: Record<string, number> = {};

    cart.forEach((item) => {
      const key = item.id.toString();
      map[key] = (map[key] || 0) + 1;
    });

    const items = Object.entries(map).map(([id, quantity]) => ({
      id,
      quantity,
    }));

    if (items.length === 0) {
      setSubtotal(0);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/cart-total", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();
        setSubtotal(data.total || 0);
      } catch (err) {
        console.error("Failed to calculate total", err);
        setSubtotal(0);
      }
    })();
  }, [cart]);

  useEffect(() => {
    if (!shippingAddress) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postalCode: "",
        country: prev.country || "FR",
        phone: "",
        email: "",
      }));
      setIsAddressDirty(false);
      return;
    }

    setAddressForm({
      fullName: shippingAddress.fullName ?? "",
      company: shippingAddress.company ?? "",
      address1: shippingAddress.address1,
      address2: shippingAddress.address2 ?? "",
      city: shippingAddress.city,
      state: shippingAddress.state ?? "",
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      phone: shippingAddress.phone ?? "",
      email: shippingAddress.email ?? "",
    });
    setIsAddressDirty(false);
  }, [shippingAddress]);

  useEffect(() => {
    if (cart.length === 0) {
      setShippingRates([]);
      setIsAddressDirty(false);
      setShippingError(null);
      setSelectedShippingRate(null);
    }
  }, [cart.length, setSelectedShippingRate]);

  const handleAddressChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    const normalizedValue =
      field === "country" ? value.toUpperCase() : value;

    setAddressForm((prev) => {
      const next = {
        ...prev,
        [field]: normalizedValue,
      } as ShippingAddress;

      if (addressesEqual(next, shippingAddress)) {
        setIsAddressDirty(false);
      } else {
        setIsAddressDirty(true);
        if (shippingRates.length > 0) {
          setShippingRates([]);
        }
        if (selectedShippingRate) {
          setSelectedShippingRate(null);
        }
      }

      return next;
    });
  };

  const handleSelectShippingRate = (rateId: string) => {
    const rate = shippingRates.find((item) => item.objectId === rateId);
    if (!rate) return;

    setSelectedShippingRate(rate);
    setShippingError(null);
  };

  const handleFetchShippingRates = async () => {
    if (cart.length === 0) {
      setShippingError("Ton panier est vide.");
      return;
    }

    if (
      !addressForm.address1 ||
      !addressForm.city ||
      !addressForm.postalCode ||
      !addressForm.country
    ) {
      setShippingError(
        "Renseigne au minimum la rue, la ville, le code postal et le pays pour calculer les transporteurs."
      );
      return;
    }

    setIsFetchingRates(true);
    setShippingError(null);

    const parcel = buildParcelFromCart(cart);
    const normalizedShippingAddress = normalizeAddress(addressForm);

    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressTo: normalizedShippingAddress,
          parcel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            "Impossible de récupérer les transporteurs disponibles."
        );
      }

      const fetchedRates = Array.isArray(data?.rates)
        ? (data.rates as ShippingRate[])
        : [];

      const sortedRates = [...fetchedRates].sort(
        (a, b) => a.amount - b.amount
      );

      setShippingRates(sortedRates);
      setShippingAddress(normalizedShippingAddress);
      setIsAddressDirty(false);

      if (sortedRates.length === 0) {
        setSelectedShippingRate(null);
        setShippingError(
          "Aucun transporteur n'est disponible pour cette adresse."
        );
        return;
      }

      const existingSelection = sortedRates.find(
        (rate) => rate.objectId === selectedShippingRate?.objectId
      );

      if (existingSelection) {
        setSelectedShippingRate(existingSelection);
      } else {
        setSelectedShippingRate(sortedRates[0]);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Impossible de récupérer les transporteurs disponibles.";
      setShippingError(message);
    } finally {
      setIsFetchingRates(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedShippingRate) {
      setShippingError(
        "Sélectionne un transporteur avant de passer au paiement."
      );
      return;
    }

    if (isAddressDirty) {
      setShippingError(
        "L’adresse a changé. Relance la recherche des transporteurs avant de poursuivre."
      );
      return;
    }

    const shippingData = shippingAddress ?? normalizeAddress(addressForm);

    if (
      !shippingData.address1 ||
      !shippingData.city ||
      !shippingData.postalCode ||
      !shippingData.country
    ) {
      setShippingError(
        "Merci de renseigner ton adresse de livraison avant le paiement."
      );
      return;
    }

    const items = groupedItems.map(({ item, quantity }) => ({
      title: item.title,
      price: item.price,
      quantity,
    }));

    setIsCreatingCheckout(true);
    setShippingError(null);

    try {
      const { url } = await createCheckoutSession({
        items,
        shippingRate: selectedShippingRate,
        shippingAddress: shippingData,
      });

      if (url) {
        window.location.href = url;
      } else {
        setShippingError(
          "Le paiement n'a pas pu être démarré. Réessaie dans quelques instants."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Le paiement n'a pas pu être démarré.";
      setShippingError(message);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const summaryTotal = subtotal + (selectedShippingRate?.amount ?? 0);
  const summaryCurrency = selectedShippingRate?.currency ?? CURRENCY_FALLBACK;

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Cart
            </h1>
          </header>

          {cart.length === 0 ? (
            <p className="mt-8 text-center text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <div className="mt-8 space-y-8">
              <ul className="space-y-4">
                {groupedItems.map(({ item, quantity }) => (
                  <li key={item.id} className="flex items-center gap-4">
                    {item.banner?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${SERVER_URL}${item.banner.url}`}
                        alt={item.title}
                        className="size-16 rounded-sm object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="text-sm text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      {item.price !== undefined && (
                        <p className="mt-0.5 text-xs text-gray-600">
                          {formatCurrency(item.price, CURRENCY_FALLBACK)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-2 text-sm"
                        aria-label="Decrease quantity"
                        onClick={() => removeFromCart(item.id)}
                      >
                        -
                      </button>
                      <span className="text-sm">{quantity}</span>
                      <button
                        type="button"
                        className="px-2 text-sm"
                        aria-label="Increase quantity"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-6 border-t border-gray-100 pt-8">
                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                  <div className="space-y-6">
                    <div className="rounded-sm border border-gray-200 p-4 sm:p-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Adresse de livraison
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Indique ton adresse pour afficher les transporteurs
                        disponibles avant le paiement.
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <label className="text-sm">
                          <span className="mb-1 block text-gray-700">
                            Nom complet
                          </span>
                          <input
                            type="text"
                            value={addressForm.fullName ?? ""}
                            onChange={(event) =>
                              handleAddressChange(
                                "fullName",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                          />
                        </label>

                        <label className="text-sm">
                          <span className="mb-1 block text-gray-700">
                            Société (optionnel)
                          </span>
                          <input
                            type="text"
                            value={addressForm.company ?? ""}
                            onChange={(event) =>
                              handleAddressChange(
                                "company",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                          />
                        </label>

                        <label className="text-sm sm:col-span-2">
                          <span className="mb-1 block text-gray-700">
                            Adresse
                          </span>
                          <input
                            type="text"
                            value={addressForm.address1}
                            onChange={(event) =>
                              handleAddressChange(
                                "address1",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                            placeholder="Numéro et rue"
                          />
                        </label>

                        <label className="text-sm sm:col-span-2">
                          <span className="mb-1 block text-gray-700">
                            Complément d’adresse (optionnel)
                          </span>
                          <input
                            type="text"
                            value={addressForm.address2 ?? ""}
                            onChange={(event) =>
                              handleAddressChange(
                                "address2",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                          />
                        </label>

                        <label className="text-sm">
                          <span className="mb-1 block text-gray-700">
                            Code postal
                          </span>
                          <input
                            type="text"
                            value={addressForm.postalCode}
                            onChange={(event) =>
                              handleAddressChange(
                                "postalCode",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                          />
                        </label>

                        <label className="text-sm">
                          <span className="mb-1 block text-gray-700">
                            Ville
                          </span>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(event) =>
                              handleAddressChange(
                                "city",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                          />
                        </label>

                        <label className="text-sm">
                          <span className="mb-1 block text-gray-700">
                            Région / État (optionnel)
                          </span>
                          <input
                            type="text"
                            value={addressForm.state ?? ""}
                            onChange={(event) =>
                              handleAddressChange(
                                "state",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                          />
                        </label>

                        <label className="text-sm">
                          <span className="mb-1 block text-gray-700">
                            Pays (code ISO)
                          </span>
                          <input
                            type="text"
                            value={addressForm.country}
                            onChange={(event) =>
                              handleAddressChange(
                                "country",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 uppercase text-sm focus:border-gray-500 focus:outline-none"
                            placeholder="FR"
                          />
                        </label>

                        <label className="text-sm">
                          <span className="mb-1 block text-gray-700">
                            Téléphone (optionnel)
                          </span>
                          <input
                            type="tel"
                            value={addressForm.phone ?? ""}
                            onChange={(event) =>
                              handleAddressChange(
                                "phone",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                          />
                        </label>

                        <label className="text-sm">
                          <span className="mb-1 block text-gray-700">
                            Email (optionnel)
                          </span>
                          <input
                            type="email"
                            value={addressForm.email ?? ""}
                            onChange={(event) =>
                              handleAddressChange(
                                "email",
                                event.target.value
                              )
                            }
                            className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleFetchShippingRates}
                          disabled={isFetchingRates}
                          className="rounded-sm bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isFetchingRates
                            ? "Recherche des transporteurs..."
                            : "Rechercher des transporteurs"}
                        </button>
                        {isAddressDirty && (
                          <span className="text-sm text-amber-600">
                            L’adresse a changé, relance la recherche pour
                            actualiser les tarifs.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-sm border border-gray-200 p-4 sm:p-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Transporteurs disponibles
                      </h2>

                      {shippingError && (
                        <p className="mt-2 text-sm text-red-600">
                          {shippingError}
                        </p>
                      )}

                      {isFetchingRates ? (
                        <p className="mt-4 text-sm text-gray-600">
                          Chargement des tarifs en cours...
                        </p>
                      ) : shippingRates.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                          {shippingRates.map((rate) => (
                            <li key={rate.objectId}>
                              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-sm border border-gray-300 px-3 py-2 text-sm shadow-sm transition hover:border-gray-400">
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {rate.provider} — {rate.serviceLevelName || "Service"}
                                  </span>
                                  <span className="mt-1 block text-xs text-gray-600">
                                    {rate.estimatedDays
                                      ? `Livraison estimée en ${rate.estimatedDays} jour(s)`
                                      : rate.durationTerms || "Délai non communiqué"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(rate.amount, rate.currency)}
                                  </span>
                                  <input
                                    type="radio"
                                    name="shipping-rate"
                                    checked={
                                      selectedShippingRate?.objectId ===
                                      rate.objectId
                                    }
                                    onChange={() =>
                                      handleSelectShippingRate(rate.objectId)
                                    }
                                    className="size-4 accent-gray-800"
                                  />
                                </div>
                              </label>
                            </li>
                          ))}
                        </ul>
                      ) : selectedShippingRate ? (
                        <div className="mt-4 rounded-sm border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                          <p>
                            Tarif sélectionné :
                            <span className="ml-1 font-semibold text-gray-900">
                              {selectedShippingRate.provider} —
                              {" "}
                              {selectedShippingRate.serviceLevelName ||
                                "Service"}
                              {" "}
                              ({formatCurrency(
                                selectedShippingRate.amount,
                                selectedShippingRate.currency
                              )})
                            </span>
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            Relance une recherche pour voir d’autres options.
                          </p>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-gray-600">
                          Renseigne ton adresse puis lance une recherche pour
                          afficher les transporteurs.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-sm border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Récapitulatif
                    </h2>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Code de réduction"
                        className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                      <button className="rounded-sm bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300">
                        Ajouter
                      </button>
                    </div>

                    <dl className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <dt>Sous-total</dt>
                        <dd>{formatCurrency(subtotal, CURRENCY_FALLBACK)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Livraison</dt>
                        <dd>
                          {selectedShippingRate
                            ? formatCurrency(
                                selectedShippingRate.amount,
                                selectedShippingRate.currency
                              )
                            : "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-gray-200 pt-3 text-base font-semibold text-gray-900">
                        <dt>Total</dt>
                        <dd>
                          {formatCurrency(summaryTotal, summaryCurrency)}
                        </dd>
                      </div>
                    </dl>

                    {!selectedShippingRate && (
                      <p className="text-xs text-red-600">
                        Sélectionne un transporteur avant de passer au
                        paiement.
                      </p>
                    )}

                    {isAddressDirty && (
                      <p className="text-xs text-amber-600">
                        L’adresse a changé, relance la recherche des
                        transporteurs pour mettre à jour le total.
                      </p>
                    )}

                    <button
                      onClick={handleCheckout}
                      disabled={
                        isCreatingCheckout ||
                        !selectedShippingRate ||
                        isAddressDirty
                      }
                      className="block w-full rounded-sm bg-gray-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCreatingCheckout ? "Redirection..." : "Checkout"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CartPage;
