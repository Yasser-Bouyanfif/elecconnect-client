export type StoreAddress = {
  fullName?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
};

function trimOrUndefined(value?: string | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export const DEFAULT_STORE_ADDRESS: StoreAddress = {
  fullName: "Jean Dupont",
  company: "Ma Société",
  address1: "12 rue des Fleurs",
  address2: "Appartement 34",
  postalCode: "75001",
  city: "Paris",
  country: "FR",
  phone: "+33123456789",
  email: "contact@example.com",
};

export function getPublicStoreAddress(): StoreAddress {
  const envFullName = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_NAME);
  const envCompany = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_COMPANY);
  const envAddress1 = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_STREET1);
  const envAddress2 = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_STREET2);
  const envCity = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_CITY);
  const envState = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_STATE);
  const envPostalCode = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_ZIP);
  const envCountry = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_COUNTRY);
  const envPhone = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_PHONE);
  const envEmail = trimOrUndefined(process.env.NEXT_PUBLIC_SHIPPO_FROM_EMAIL);

  return {
    fullName: envFullName ?? DEFAULT_STORE_ADDRESS.fullName,
    company: envCompany ?? DEFAULT_STORE_ADDRESS.company,
    address1: envAddress1 ?? DEFAULT_STORE_ADDRESS.address1,
    address2: envAddress2 ?? DEFAULT_STORE_ADDRESS.address2,
    city: envCity ?? DEFAULT_STORE_ADDRESS.city,
    state: envState ?? DEFAULT_STORE_ADDRESS.state,
    postalCode: envPostalCode ?? DEFAULT_STORE_ADDRESS.postalCode,
    country: (envCountry ?? DEFAULT_STORE_ADDRESS.country ?? "FR").toUpperCase(),
    phone: envPhone ?? DEFAULT_STORE_ADDRESS.phone,
    email: envEmail ?? DEFAULT_STORE_ADDRESS.email,
  } satisfies StoreAddress;
}
