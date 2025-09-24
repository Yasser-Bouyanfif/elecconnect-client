import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import orderApis from "@/app/strapi/orderApis";
import { currentUser } from "@clerk/nextjs/server";
import { STRIPE_SECRET_KEY } from "@/app/lib/serverEnv";

type User = {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
  };

export async function POST(request: Request) {
  try {
    const {userId} = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { stripeSessionId } = await request.json();

    if (!stripeSessionId) {
      return NextResponse.json(
        { error: "Session Stripe manquante" },
        { status: 400 }
      );
    }

    // Vérifier d'abord la session Stripe pour la sécurité
    const stripe = require('stripe')(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);


    // Récupérer la commande
    const orderResponse = await orderApis.getOrderByStripeSession(stripeSessionId);
    
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

    const order = {
      orderNumber: fullOrder.attributes.orderNumber,
      total: fullOrder.attributes.total,
      createdAt: fullOrder.attributes.createdAt,
      address: {
        fullName: fullOrder.attributes.address?.fullName,
        company: fullOrder.attributes.address?.company,
        address1: fullOrder.attributes.address?.address1,
        address2: fullOrder.attributes.address?.address2,
        postalCode: fullOrder.attributes.address?.postalCode,
        city: fullOrder.attributes.address?.city,
        country: fullOrder.attributes.address?.country,
        phone: fullOrder.attributes.address?.phone,
      },
      shipping: {
        carrier: fullOrder.attributes.shipping?.carrier,
        price: fullOrder.attributes.shipping?.price,
      }
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