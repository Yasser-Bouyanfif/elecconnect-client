import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import orderApis from "@/app/strapi/orderApis";
import productApis from "@/app/strapi/productApis";
import { STRIPE_SECRET_KEY } from "@/app/lib/serverEnv";

type CartItemPayload = {
  id?: string | number;
  documentId?: string;
};

type RequestBody = {
  cart?: CartItemPayload[];
  stripeSessionId?: string;
};

type OrderLineInput = {
  productDocumentId: string;
  quantity: number;
  unitPrice: number;
};

const SHIPPING_DETAILS = { carrier: "DHL", price: 9.99 } as const;

const toStringId = (value: string | number) => String(value);

async function buildOrderLines(
  items: Array<[string, { quantity: number }]>
): Promise<{ orderLines: OrderLineInput[]; subtotal: number }> {
  const orderLines: OrderLineInput[] = [];
  let subtotal = 0;

  for (const [id, { quantity }] of items) {
    try {
      const response = await productApis.getProductById(id);
      const productData = (response?.data?.data?.[0] ?? response?.data?.data) as
        | { documentId?: string; id?: string; price?: number }
        | undefined;

      const unitPrice = Number(productData?.price ?? 0) || 0;
      const resolvedDocumentId =
        productData?.documentId ??
        (typeof productData?.id === "string" ? productData.id : undefined);

      const strapiProductId =
        typeof productData?.id !== "undefined"
          ? toStringId(productData.id)
          : undefined;

      if (!productData || (strapiProductId && strapiProductId !== toStringId(id))) {
        console.warn(
          `Product lookup mismatch for cart item ${id}: ${JSON.stringify(
            productData
          )}`
        );
        continue;
      }

      if (!resolvedDocumentId) {
        console.warn(`Missing documentId for product ${id}`);
        continue;
      }

      subtotal += unitPrice * quantity;
      orderLines.push({
        productDocumentId: resolvedDocumentId,
        quantity,
        unitPrice,
      });
    } catch (error) {
      console.error(`Failed to fetch product ${id}`, error);
    }
  }

  return { orderLines, subtotal };
}

export async function POST(request: Request) {
  const {userId} = await auth()

  try {    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { cart, stripeSessionId, userEmail } = await request.json();

        // Vérification CRITIQUE de la session Stripe
        if (!stripeSessionId) {
          return NextResponse.json(
            { error: "Session Stripe manquante" },
            { status: 400 }
          );
        }
    
        // Vérifier la session Stripe
        const stripe = require('stripe')(STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    
        // Vérifications importantes
        if (session.payment_status !== 'paid') {
          return NextResponse.json(
            { error: "Paiement non confirmé" },
            { status: 402 }
          );
        }
    
        if (session.status !== 'complete') {
          return NextResponse.json(
            { error: "Session Stripe incomplète" },
            { status: 400 }
          );
        }
    
        // IMPORTANT : éviter les doubles créations de commande
        // Vérifier si une commande existe déjà pour cette session Stripe
        const existingOrder = await orderApis.getOrderByStripeSession(stripeSessionId);
        if (existingOrder.data && existingOrder.data.length > 0) {
          return NextResponse.json(
            { error: "Commande déjà créée pour cette session" },
            { status: 409 }
          );
        }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const productMap = new Map<string, { quantity: number }>();

    cart.forEach((item) => {
      if (!item || (typeof item.id !== "string" && typeof item.id !== "number")) {
        return;
      }

      const key = toStringId(item.id);
      const existing = productMap.get(key);
      const quantity = (existing?.quantity ?? 0) + 1;

      productMap.set(key, {
        quantity,
      });
    });

    if (productMap.size === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const entries = Array.from(productMap.entries());
    const { orderLines, subtotal } = await buildOrderLines(entries);

    if (orderLines.length === 0) {
      return NextResponse.json(
        { error: "Unable to prepare order lines" },
        { status: 500 }
      );
    }

    const total = subtotal + SHIPPING_DETAILS.price;

    const orderResponse = await orderApis.createOrder({
      data: {
        orderNumber: randomUUID(),
        userId,
        userEmail,
        shippingAddress: {
          fullName: "Jean Dupont",
          company: "Ma Société",
          address1: "12 rue des Fleurs",
          address2: "Appartement 34",
          postalCode: 75001,
          city: "Paris",
          country: "France",
          phone: 33123456789,
        },
        billingAddress: {
          fullName: "Jean Dupont",
          company: "Ma Société",
          address1: "12 rue des Fleurs",
          address2: "Appartement 34",
          postalCode: 75001,
          city: "Paris",
          country: "France",
          phone: 33123456789,
        },
        shipping: SHIPPING_DETAILS,
        subtotal,
        total,
        orderStatus: "pending",
        stripeSessionId,
      },
    });

    const orderDocumentId =
      orderResponse?.data?.data?.documentId ??
      orderResponse?.data?.data?.id ??
      orderResponse?.data?.documentId ??
      orderResponse?.data?.id;

    if (!orderDocumentId) {
      console.error("Order created without documentId", orderResponse?.data);
      return NextResponse.json(
        { error: "Order creation failed" },
        { status: 500 }
      );
    }

    await Promise.all(
      orderLines.map(({ productDocumentId, quantity, unitPrice }) =>
        orderApis.createOrderLine({
          data: {
            quantity,
            unitPrice,
            order: { connect: [orderDocumentId] },
            product: { connect: [productDocumentId] },
          },
        })
      )
    );

    return NextResponse.json({ success: true, subtotal, total });
  } catch (error) {
    console.error("Failed to process order", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth(); 

  try {    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const response = await orderApis.getOrdersByUser(userId);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch orders", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}