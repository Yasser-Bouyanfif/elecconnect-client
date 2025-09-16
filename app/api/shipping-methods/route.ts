import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import {
  SENDCLOUD_API_URL,
  SENDCLOUD_PUBLIC_KEY,
  SENDCLOUD_SECRET_KEY,
} from "@/app/lib/constants";

type ShippingMethod = {
  id: string | number;
  name: string;
  price: number;
  currency: string;
  carrier?: string;
  service?: string;
  deliveryEstimate?: string;
};

const DEFAULT_CURRENCY = "EUR";

const toCurrency = (value: unknown) => {
  if (typeof value === "string" && value.trim() !== "") {
    return value.toUpperCase();
  }
  return DEFAULT_CURRENCY;
};

function extractPrice(method: Record<string, unknown>): {
  amount: number;
  currency: string;
} {
  const candidates = [
    method?.price,
    method?.price_excl,
    method?.price_incl,
    method?.default_price,
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined) {
      continue;
    }

    if (typeof candidate === "number" || typeof candidate === "string") {
      const amount = Number(candidate);
      if (!Number.isNaN(amount)) {
        return {
          amount,
          currency: toCurrency(method?.currency),
        };
      }
    }

    if (typeof candidate === "object") {
      const candidateRecord = candidate as Record<string, unknown>;
      const amount = Number(
        candidateRecord.amount ??
          candidateRecord.price ??
          candidateRecord.value ??
          candidateRecord.net_amount ??
          candidateRecord.gross_amount ??
          0
      );

      if (!Number.isNaN(amount)) {
        const currencyRaw =
          candidateRecord.currency ??
          (typeof method?.currency === "string" ? method.currency : null);
        return {
          amount,
          currency: toCurrency(currencyRaw),
        };
      }
    }
  }

  return {
    amount: 0,
    currency: toCurrency(method?.currency),
  };
}

function buildDeliveryEstimate(method: Record<string, unknown>): string | undefined {
  const toNumber = (value: unknown) => {
    if (
      typeof value === "number" ||
      (typeof value === "string" && value.trim() !== "")
    ) {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    return undefined;
  };

  const min = toNumber(method?.min_delivery_time);
  const max = toNumber(method?.max_delivery_time);

  if (min !== undefined && max !== undefined) {
    return `${min}-${max} jours`;
  }

  if (min !== undefined) {
    return `${min} jours`;
  }

  const estimateCandidates = [
    method?.delivery_time,
    method?.delivery_estimate,
    method?.transit_time,
  ];

  for (const candidate of estimateCandidates) {
    if (typeof candidate === "string" && candidate.trim() !== "") {
      return candidate;
    }
  }

  return undefined;
}

function normaliseMethod(rawMethod: Record<string, unknown>): ShippingMethod {
  const { amount, currency } = extractPrice(rawMethod);
  const rawId =
    rawMethod?.id ?? rawMethod?.shipping_method_id ?? randomUUID();
  const id =
    typeof rawId === "string" || typeof rawId === "number"
      ? rawId
      : randomUUID();
  const nameRaw =
    (typeof rawMethod?.name === "string" && rawMethod.name) ||
    (typeof rawMethod?.display_name === "string" && rawMethod.display_name) ||
    (typeof rawMethod?.service === "string" && rawMethod.service) ||
    (typeof rawMethod?.code === "string" && rawMethod.code) ||
    `Méthode ${id}`;

  return {
    id,
    name: nameRaw,
    price: Number.isFinite(amount) ? amount : 0,
    currency,
    carrier:
      (typeof rawMethod?.carrier === "string" && rawMethod.carrier) ||
      undefined,
    service:
      (typeof rawMethod?.service === "string" && rawMethod.service) ||
      (typeof rawMethod?.service_name === "string" && rawMethod.service_name) ||
      undefined,
    deliveryEstimate: buildDeliveryEstimate(rawMethod),
  };
}

export const runtime = "nodejs";

export async function GET() {
  if (!SENDCLOUD_PUBLIC_KEY || !SENDCLOUD_SECRET_KEY) {
    return NextResponse.json(
      { error: "SendCloud credentials are not configured." },
      { status: 500 }
    );
  }

  const baseUrl = SENDCLOUD_API_URL?.replace(/\/$/, "") || "";
  const auth = Buffer.from(
    `${SENDCLOUD_PUBLIC_KEY}:${SENDCLOUD_SECRET_KEY}`
  ).toString("base64");

  try {
    const response = await fetch(`${baseUrl}/shipping_methods`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SendCloud shipping methods error", errorText);
      return NextResponse.json(
        { error: "Failed to fetch shipping methods from SendCloud." },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      shipping_methods?: Record<string, unknown>[];
    };

    const rawMethods =
      Array.isArray(data?.shipping_methods) ? data.shipping_methods : [];
    const shippingMethods = rawMethods.map((method) => normaliseMethod(method));

    return NextResponse.json({ shippingMethods });
  } catch (error) {
    console.error("Failed to retrieve SendCloud shipping methods", error);
    return NextResponse.json(
      { error: "Unable to load shipping methods." },
      { status: 500 }
    );
  }
}
