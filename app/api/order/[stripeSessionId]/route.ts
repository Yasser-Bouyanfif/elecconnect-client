import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import orderApis from "@/app/strapi/orderApis";
import { currentUser } from "@clerk/nextjs/server";
import { STRIPE_SECRET_KEY } from "@/app/lib/serverEnv";

type RouteParams = {
  params: {
    stripeSessionId: string;
  };
};

type User = {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
  };

export async function GET(request: Request, { params }: RouteParams) {
  try {
  const user = await currentUser() as User;
  const userId = user.id
  const userEmail = user.emailAddresses[0].emailAddress
    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { stripeSessionId } = params;

    if (!stripeSessionId) {
      return NextResponse.json(
        { error: "Session Stripe manquante" },
        { status: 400 }
      );
    }

    // Vérifier d'abord la session Stripe pour la sécurité
    const stripe = require('stripe')(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

    // Vérifier que l'utilisateur a le droit de voir cette commande

    if (session.customer_email && session.customer_email !== userEmail) {
      return NextResponse.json(
        { error: "Accès non autorisé à cette commande" },
        { status: 403 }
      );
    }

    // Récupérer la commande
    const orderResponse = await orderApis.getOrderByStripeSession(stripeSessionId);

    console.log(orderResponse)
    
    if (!orderResponse?.data?.data || orderResponse.data.data.length === 0) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    const order = orderResponse.data.data[0];

    // Vérifier que la commande appartient bien à l'utilisateur
    if (order.attributes.userId !== userId) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Failed to fetch order", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la commande" },
      { status: 500 }
    );
  }
}