import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import orderApis from "@/app/strapi/orderApis";
import { currentUser } from "@clerk/nextjs/server";
import { STRIPE_SECRET_KEY } from "@/app/lib/serverEnv";
import { useUser } from "@clerk/nextjs";

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
      orderNumber: fullOrder.orderNumber,
      total: fullOrder.total,
      userEmail: fullOrder.userEmail,
      createdAt: fullOrder.createdAt,
      address: {
        fullName: fullOrder.address?.fullName,
        company: fullOrder.address?.company,
        address1: fullOrder.address?.address1,
        address2: fullOrder.address?.address2,
        postalCode: fullOrder.address?.postalCode,
        city: fullOrder.address?.city,
        country: fullOrder.address?.country,
        phone: fullOrder.address?.phone,
      },
      shipping: {
        carrier: fullOrder.shipping?.carrier,
        price: fullOrder.shipping?.price,
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