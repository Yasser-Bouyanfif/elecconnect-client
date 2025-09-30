import Stripe from "stripe";
import { NextResponse } from "next/server";
import { STRIPE_SECRET_KEY } from "../../lib/serverEnv";
import { LOCAL_URL, SERVER_URL } from "@/app/lib/constants";
import {
  checkoutSessionSchema,
  type CheckoutSessionPayload,
} from "@/app/lib/validation/checkout";

const stripe = new Stripe(STRIPE_SECRET_KEY as string);
const DEFAULT_PRODUCT_NAME = "Produit ElecConnect";

const buildLineItems = ({ items }: CheckoutSessionPayload) =>
  items.map((item) => {
    const unitAmount = Math.round(item.price * 100);

    return {
      price_data: {
        currency: "eur",
        product_data: { name: item.title ?? DEFAULT_PRODUCT_NAME },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    };
  });

export async function POST(request: Request) {
  try {
    const jsonBody = await request.json().catch(() => null);
    if (!jsonBody || typeof jsonBody !== "object") {
      return NextResponse.json(
        { error: "Le corps de la requête est invalide." },
        { status: 400 }
      );
    }

    const parsedBody = checkoutSessionSchema.safeParse(jsonBody);
    if (!parsedBody.success) {
      const firstIssue = parsedBody.error.issues[0];
      return NextResponse.json(
        {
          error:
            firstIssue?.message ??
            "Les données de la commande sont invalides.",
        },
        { status: 400 }
      );
    }

    const line_items = buildLineItems(parsedBody.data);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${LOCAL_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${LOCAL_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session de paiement", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: "Échec de la création de la session de paiement." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
