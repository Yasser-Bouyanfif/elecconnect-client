import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  const { items, shippingRate, shippingAddress } = await request.json();

  const line_items = (items || [])
    .filter((item: { quantity?: number }) => item && item.quantity > 0)
    .map((item: { title?: string; price?: number; quantity: number }) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.title },
        unit_amount: Math.round(Math.max(item.price || 0, 0) * 100),
      },
      quantity: item.quantity,
    }));

  if (!Array.isArray(items) || line_items.length === 0) {
    return NextResponse.json(
      { error: "Aucun article à régler." },
      { status: 400 }
    );
  }

  if (shippingRate && typeof shippingRate.amount === "number") {
    const shippingAmountCents = Math.round(
      Math.max(shippingRate.amount, 0) * 100
    );
    const shippingCurrency =
      typeof shippingRate.currency === "string"
        ? shippingRate.currency.toLowerCase()
        : "eur";

    line_items.push({
      price_data: {
        currency: shippingCurrency,
        product_data: {
          name: `Shipping - ${shippingRate.provider || "Carrier"}`,
          description: shippingRate.serviceLevelName || undefined,
        },
        unit_amount: shippingAmountCents,
      },
      quantity: 1,
    });
  }

  const origin = request.headers.get("origin") || "";

  const metadata: Record<string, string> = {};

  if (shippingRate?.objectId) {
    metadata.shippo_rate_id = String(shippingRate.objectId);
  }
  if (shippingRate?.shipmentId) {
    metadata.shippo_shipment_id = String(shippingRate.shipmentId);
  }
  if (shippingRate?.provider) {
    metadata.shipping_provider = String(shippingRate.provider);
  }
  if (shippingRate?.serviceLevelName) {
    metadata.shipping_service = String(shippingRate.serviceLevelName);
  }
  if (shippingRate?.currency) {
    metadata.shipping_currency = String(shippingRate.currency);
  }
  if (typeof shippingRate?.amount === "number") {
    metadata.shipping_amount = shippingRate.amount.toString();
  }
  if (shippingAddress) {
    try {
      metadata.shipping_address = JSON.stringify(shippingAddress);
    } catch {
      // ignore serialization issues
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: `${origin}/success`,
    cancel_url: `${origin}/cart`,
    ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
  });

  return NextResponse.json({ url: session.url });
}
