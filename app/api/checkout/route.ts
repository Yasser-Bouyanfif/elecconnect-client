import Stripe from "stripe";
import { NextResponse } from "next/server";

type CheckoutItemPayload = {
  title?: string;
  price?: number | string;
  quantity: number | string;
};

type ShippingMethodPayload = {
  id?: string | number;
  name?: string;
  price?: number | string;
  currency?: string;
  carrier?: string;
  service?: string;
  deliveryEstimate?: string;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  const body = (await request.json()) as {
    items?: CheckoutItemPayload[];
    shippingMethod?: ShippingMethodPayload;
  };

  const itemsInput = Array.isArray(body?.items) ? body.items : [];
  const shippingMethod = body?.shippingMethod;

  if (!shippingMethod || typeof shippingMethod !== "object") {
    return NextResponse.json(
      { error: "Veuillez sélectionner un mode de livraison." },
      { status: 400 }
    );
  }

  const shippingPrice = Number(shippingMethod.price ?? 0);

  if (!Number.isFinite(shippingPrice) || shippingPrice < 0) {
    return NextResponse.json(
      { error: "Le tarif de livraison est invalide." },
      { status: 400 }
    );
  }

  const shippingCurrency =
    typeof shippingMethod.currency === "string" &&
    shippingMethod.currency.trim() !== ""
      ? shippingMethod.currency.trim().toLowerCase()
      : "eur";

  const currency = shippingCurrency || "eur";

  const shippingName =
    typeof shippingMethod.name === "string" && shippingMethod.name.trim() !== ""
      ? shippingMethod.name.trim()
      : "Livraison";

  const itemLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  itemsInput.forEach((item) => {
    const quantity = Number(item?.quantity) || 0;
    if (quantity <= 0) {
      return;
    }

    const price = Number(item?.price ?? 0);
    const unitAmount = Math.round(Math.max(price, 0) * 100);
    const name =
      typeof item?.title === "string" && item.title.trim() !== ""
        ? item.title.trim()
        : "Article";

    itemLineItems.push({
      price_data: {
        currency,
        product_data: { name },
        unit_amount: unitAmount,
      },
      quantity,
    });
  });

  const lineItems = [...itemLineItems];

  const shippingAmount = Math.round(Math.max(shippingPrice, 0) * 100);

  if (shippingAmount > 0) {
    lineItems.push({
      price_data: {
        currency,
        product_data: {
          name: `Livraison - ${shippingName}`,
        },
        unit_amount: shippingAmount,
      },
      quantity: 1,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "Aucun article à régler." },
      { status: 400 }
    );
  }

  const origin = request.headers.get("origin") || "";

  const metadata: Record<string, string> = {
    shipping_method_name: shippingName,
    shipping_method_price: shippingPrice.toString(),
    shipping_method_currency: currency.toUpperCase(),
  };

  if (shippingMethod.id !== undefined) {
    metadata.shipping_method_id = String(shippingMethod.id);
  }

  if (typeof shippingMethod.carrier === "string" && shippingMethod.carrier) {
    metadata.shipping_method_carrier = shippingMethod.carrier;
  }

  if (typeof shippingMethod.service === "string" && shippingMethod.service) {
    metadata.shipping_method_service = shippingMethod.service;
  }

  if (
    typeof shippingMethod.deliveryEstimate === "string" &&
    shippingMethod.deliveryEstimate
  ) {
    metadata.shipping_method_estimate = shippingMethod.deliveryEstimate;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${origin}/success`,
    cancel_url: `${origin}/cart`,
    metadata,
  });

  return NextResponse.json({ url: session.url });
}
