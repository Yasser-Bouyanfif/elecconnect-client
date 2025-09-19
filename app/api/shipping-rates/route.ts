import { NextResponse } from "next/server";

import {
  ShippoAddress,
  getShippoApiToken,
  getShippoCurrency,
  getShippoOriginAddress,
} from "../../lib/server/shippoConfig";

type ShippoParcel = {
  length?: string | number;
  width?: string | number;
  height?: string | number;
  distance_unit?: string;
  weight?: string | number;
  mass_unit?: string;
};

type ShippoRateResponse = {
  object_id: string;
  amount: string | number;
  currency?: string;
  provider: string;
  servicelevel?: { name?: string; token?: string };
  servicelevel_name?: string;
  servicelevel_token?: string;
  estimated_days?: number;
  duration_terms?: string;
  provider_image_75?: string;
};

type ShippoShipmentResponse = {
  object_id: string;
  rates: ShippoRateResponse[];
};

type ShippoErrorResponse = {
  detail?: string;
  message?: string;
};

const TARGET_CURRENCY = getShippoCurrency();

function normalizeParcel(parcel?: ShippoParcel | null): ShippoParcel {
  const fallback = {
    length: "20",
    width: "15",
    height: "10",
    distance_unit: "cm",
    weight: "1",
    mass_unit: "kg",
  } satisfies ShippoParcel;

  if (!parcel) {
    return fallback;
  }

  const toStringValue = (value?: string | number) =>
    typeof value === "number" && Number.isFinite(value)
      ? value.toString()
      : value;

  return {
    length: toStringValue(parcel.length) ?? fallback.length,
    width: toStringValue(parcel.width) ?? fallback.width,
    height: toStringValue(parcel.height) ?? fallback.height,
    distance_unit: parcel.distance_unit ?? fallback.distance_unit,
    weight: toStringValue(parcel.weight) ?? fallback.weight,
    mass_unit: parcel.mass_unit ?? fallback.mass_unit,
  } satisfies ShippoParcel;
}

function mapAddressToShippo(address: unknown): ShippoAddress | null {
  if (!address || typeof address !== "object") {
    return null;
  }

  const value = address as Record<string, unknown>;

  const street1 =
    typeof value.address1 === "string"
      ? value.address1
      : typeof value.street1 === "string"
      ? value.street1
      : null;
  const city = typeof value.city === "string" ? value.city : null;
  const postalCode =
    typeof value.postalCode === "string"
      ? value.postalCode
      : typeof value.zip === "string"
      ? value.zip
      : null;
  const country = typeof value.country === "string" ? value.country : null;

  if (!street1 || !city || !postalCode || !country) {
    return null;
  }

  return {
    name:
      typeof value.fullName === "string"
        ? value.fullName
        : typeof value.name === "string"
        ? value.name
        : undefined,
    company: typeof value.company === "string" ? value.company : undefined,
    street1,
    street2:
      typeof value.address2 === "string"
        ? value.address2
        : typeof value.street2 === "string"
        ? value.street2
        : undefined,
    city,
    state: typeof value.state === "string" ? value.state : undefined,
    zip: postalCode,
    country,
    phone: typeof value.phone === "string" ? value.phone : undefined,
    email: typeof value.email === "string" ? value.email : undefined,
  } satisfies ShippoAddress;
}

export async function POST(request: Request) {
  try {
    const token = getShippoApiToken();
    if (!token) {
      console.warn(
        "Shippo API token missing. Set SHIPPO_API_TOKEN to enable live rates."
      );
      return NextResponse.json(
        {
          error:
            "Le calcul des frais de port est indisponible pour le moment. Réessaie plus tard ou contacte-nous.",
        },
        { status: 503 }
      );
    }

    let addressFrom: ShippoAddress;
    try {
      addressFrom = getShippoOriginAddress();
    } catch (configError) {
      console.error("Shippo origin address misconfigured", configError);
      return NextResponse.json(
        {
          error:
            "Le calcul des frais de port est indisponible pour le moment. Réessaie plus tard ou contacte-nous.",
        },
        { status: 500 }
      );
    }

    const { addressTo, parcel, parcels } = await request.json();

    const toAddress = mapAddressToShippo(addressTo);
    if (!toAddress) {
      return NextResponse.json(
        { error: "Adresse de destination invalide" },
        { status: 400 }
      );
    }

    const parcelsPayload: ShippoParcel[] = Array.isArray(parcels)
      ? parcels.map((item: ShippoParcel | null) => normalizeParcel(item))
      : [normalizeParcel((parcel as ShippoParcel | null) ?? null)];

    const response = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        Authorization: `ShippoToken ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address_from: addressFrom,
        address_to: toAddress,
        parcels: parcelsPayload,
        async: false,
      }),
    });

    const shipmentBody = (await response
      .json()
      .catch(() => null)) as
      | (ShippoShipmentResponse & ShippoErrorResponse)
      | ShippoErrorResponse
      | null;

    if (
      !response.ok ||
      !shipmentBody ||
      !("rates" in shipmentBody) ||
      !Array.isArray(shipmentBody.rates)
    ) {
      const errorBody = shipmentBody as ShippoErrorResponse | null;
      const errorMessage =
        errorBody?.detail ||
        errorBody?.message ||
        "Impossible de récupérer les tarifs de livraison";

      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    const shipmentData = shipmentBody as ShippoShipmentResponse;

    const rates = shipmentData.rates
      .map((rate: ShippoRateResponse) => {
        const currency =
          typeof rate.currency === "string"
            ? rate.currency.toUpperCase()
            : TARGET_CURRENCY;

        return {
          objectId: rate.object_id,
          amount: Number(rate.amount),
          currency,
          provider: rate.provider,
          serviceLevelName:
            rate.servicelevel?.name ?? rate.servicelevel_name ?? "",
          serviceLevelToken:
            rate.servicelevel?.token ?? rate.servicelevel_token ?? undefined,
          estimatedDays: rate.estimated_days ?? null,
          durationTerms: rate.duration_terms ?? null,
          shipmentId: shipmentData.object_id,
          providerImage75: rate.provider_image_75 ?? undefined,
        };
      })
      .filter(
        (rate) =>
          Boolean(rate.objectId) &&
          Number.isFinite(rate.amount) &&
          rate.currency === TARGET_CURRENCY
      );

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Failed to fetch Shippo rates", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les tarifs de livraison" },
      { status: 500 }
    );
  }
}
