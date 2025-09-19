import "server-only";

import { DEFAULT_STORE_ADDRESS, StoreAddress } from "../store-address";

export type ShippoAddress = {
  name?: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
};

function readEnv(key: string): string | undefined {
  const raw = process.env[key];
  if (typeof raw !== "string") {
    return undefined;
  }

  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildStoreAddressFromEnv(): StoreAddress {
  const address1 = readEnv("SHIPPO_FROM_STREET1") ?? DEFAULT_STORE_ADDRESS.address1;
  const city = readEnv("SHIPPO_FROM_CITY") ?? DEFAULT_STORE_ADDRESS.city;
  const postalCode = readEnv("SHIPPO_FROM_ZIP") ?? DEFAULT_STORE_ADDRESS.postalCode;
  const rawCountry = readEnv("SHIPPO_FROM_COUNTRY") ?? DEFAULT_STORE_ADDRESS.country ?? "FR";

  return {
    fullName: readEnv("SHIPPO_FROM_NAME") ?? DEFAULT_STORE_ADDRESS.fullName,
    company: readEnv("SHIPPO_FROM_COMPANY") ?? DEFAULT_STORE_ADDRESS.company,
    address1,
    address2: readEnv("SHIPPO_FROM_STREET2") ?? DEFAULT_STORE_ADDRESS.address2,
    city,
    state: readEnv("SHIPPO_FROM_STATE") ?? DEFAULT_STORE_ADDRESS.state,
    postalCode,
    country: rawCountry.toUpperCase(),
    phone: readEnv("SHIPPO_FROM_PHONE") ?? DEFAULT_STORE_ADDRESS.phone,
    email: readEnv("SHIPPO_FROM_EMAIL") ?? DEFAULT_STORE_ADDRESS.email,
  } satisfies StoreAddress;
}

export function getShippoOriginAddress(): ShippoAddress {
  const storeAddress = buildStoreAddressFromEnv();

  if (!storeAddress.address1 || !storeAddress.city || !storeAddress.postalCode) {
    throw new Error("Shippo origin address is incomplete.");
  }

  return {
    name: storeAddress.fullName,
    company: storeAddress.company,
    street1: storeAddress.address1,
    street2: storeAddress.address2,
    city: storeAddress.city,
    state: storeAddress.state,
    zip: storeAddress.postalCode,
    country: storeAddress.country,
    phone: storeAddress.phone,
    email: storeAddress.email,
  } satisfies ShippoAddress;
}

export function getShippoApiToken(): string | null {
  return (
    readEnv("SHIPPO_API_TOKEN") ?? readEnv("NEXT_PUBLIC_SHIPPO_API_TOKEN") ?? null
  );
}

export function getShippoCurrency(): string {
  const currency =
    readEnv("SHIPPO_CURRENCY") ?? readEnv("NEXT_PUBLIC_SHIPPO_CURRENCY") ?? "EUR";

  return currency.toUpperCase();
}

export function getStoreAddressForServer(): StoreAddress {
  return buildStoreAddressFromEnv();
}
