import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import orderApis from "@/app/strapi/orderApis";
import { STRIPE_SECRET_KEY } from "@/app/lib/serverEnv";

const stripe = new Stripe(STRIPE_SECRET_KEY as string);

type OrderPayload = {
  orderNumber: string;
  total: number;
  userEmail?: string;
  createdAt: string;
  shippingAddress?: {
    fullName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    phone?: string;
  };
  billingAddress?: {
    fullName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    phone?: string;
  };
  shipping?: {
    carrier?: string;
    price?: number;
  };
};

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { stripeSessionId } = await request.json();

    if (typeof stripeSessionId !== "string" || !stripeSessionId) {
      return NextResponse.json(
        { error: "Session Stripe manquante" },
        { status: 400 }
      );
    }

    await stripe.checkout.sessions.retrieve(stripeSessionId);

    const orderResponse = await orderApis.getOrderByStripeSession(
      stripeSessionId
    );

    if (!orderResponse?.data?.data || orderResponse.data.data.length === 0) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    const fullOrder = orderResponse.data.data[0];

    if (fullOrder.userId !== userId) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const order: OrderPayload = {
      orderNumber: fullOrder.orderNumber,
      total: fullOrder.total,
      userEmail: fullOrder.userEmail,
      createdAt: fullOrder.createdAt,
      shippingAddress: {
        fullName: fullOrder.shippingAddress?.fullName,
        company: fullOrder.shippingAddress?.company,
        address1: fullOrder.shippingAddress?.address1,
        address2: fullOrder.shippingAddress?.address2,
        postalCode: fullOrder.shippingAddress?.postalCode,
        city: fullOrder.shippingAddress?.city,
        country: fullOrder.shippingAddress?.country,
        phone: fullOrder.shippingAddress?.phone,
      },
      billingAddress: {
        fullName: fullOrder.billingAddress?.fullName,
        company: fullOrder.billingAddress?.company,
        address1: fullOrder.billingAddress?.address1,
        address2: fullOrder.billingAddress?.address2,
        postalCode: fullOrder.billingAddress?.postalCode,
        city: fullOrder.billingAddress?.city,
        country: fullOrder.billingAddress?.country,
        phone: fullOrder.billingAddress?.phone,
      },
      shipping: {
        carrier: fullOrder.shipping?.carrier,
        price: fullOrder.shipping?.price,
      },
    };

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Failed to fetch order", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la commande" },
      { status: 500 }
    );
  }
}
