import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import orderApis from "@/app/strapi/orderApis";
import productApis from "@/app/strapi/productApis";
import { STRIPE_SECRET_KEY } from "@/app/lib/serverEnv";

type CartItemPayload = {
  id?: string | number;
  documentId?: string;
};

type ShippingMethod = "standard" | "express";

type CheckoutAddress = {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
};

type RequestBody = {
  cart?: CartItemPayload[];
  stripeSessionId?: string;
  shippingMethod?: ShippingMethod;
  userEmail?: string;
  shippingAddress?: CheckoutAddress;
  billingAddress?: CheckoutAddress;
};

type OrderLineInput = {
  productDocumentId: string;
  quantity: number;
  unitPrice: number;
};

const SHIPPING_OPTIONS: Record<ShippingMethod, { carrier: string; price: number }> = {
  standard: { carrier: "Colissimo Standard", price: 0 },
  express: { carrier: "Chronopost Express", price: 12.9 },
};

const toStringId = (value: string | number) => String(value);

const sanitizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : undefined;

const formatAddress = (address?: CheckoutAddress) => {
  if (!address) {
    return undefined;
  }

  const firstName = sanitizeText(address.firstName) ?? "";
  const lastName = sanitizeText(address.lastName) ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    fullName: fullName || undefined,
    company: sanitizeText(address.company),
    address1: sanitizeText(address.address1),
    address2: sanitizeText(address.address2),
    postalCode: sanitizeText(address.postalCode),
    city: sanitizeText(address.city),
    country: sanitizeText(address.country),
    phone: sanitizeText(address.phone),
  };
};

function generateOrderNumber() {
  const date = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 8);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `EC-${date}-${rand}`;
}

async function buildOrderLines(
  items: Array<[string, { quantity: number }]>
): Promise<{
  orderLines: OrderLineInput[];
  subtotal: number;
  subtotalInCents: number;
}> {
  const orderLines: OrderLineInput[] = [];
  let subtotalInCents = 0;

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

      const unitAmountInCents = Math.round(unitPrice * 100);

      if (!Number.isFinite(unitAmountInCents) || unitAmountInCents <= 0) {
        console.warn(`Invalid price detected for product ${id}`);
        continue;
      }

      subtotalInCents += unitAmountInCents * quantity;
      orderLines.push({
        productDocumentId: resolvedDocumentId,
        quantity,
        unitPrice,
      });
    } catch (error) {
      console.error(`Échec de la récupération du produit ${id}`, error);
    }
  }

  return { orderLines, subtotal: subtotalInCents / 100, subtotalInCents };
}

export async function POST(request: Request) {
  const { userId } = await auth();

  try {    
    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const {
      cart,
      stripeSessionId,
      userEmail,
      shippingMethod,
      shippingAddress: shippingAddressPayload,
      billingAddress: billingAddressPayload,
    }: RequestBody = await request.json();

    const selectedShippingMethod:
      | ShippingMethod
      | undefined = shippingMethod;
    const resolvedShippingMethod: ShippingMethod =
      selectedShippingMethod === "express" || selectedShippingMethod === "standard"
        ? selectedShippingMethod
        : "standard";
    const shippingDetails = SHIPPING_OPTIONS[resolvedShippingMethod];

    if (!stripeSessionId) {
      return NextResponse.json(
        { error: "Session Stripe manquante" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

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
    const { orderLines, subtotal, subtotalInCents } = await buildOrderLines(entries);

    if (orderLines.length === 0) {
      return NextResponse.json(
        { error: "Unable to prepare order lines" },
        { status: 500 }
      );
    }

    const shippingTotalInCents = Math.round(shippingDetails.price * 100);

    if (!Number.isFinite(shippingTotalInCents) || shippingTotalInCents < 0) {
      console.error(
        `Invalid shipping price calculated for method ${resolvedShippingMethod}: ${shippingDetails.price}`
      );
      return NextResponse.json(
        { error: "Montant de livraison invalide" },
        { status: 500 }
      );
    }

    const expectedTotalInCents = subtotalInCents + shippingTotalInCents;
    const amountTotalPaid = session.amount_total;
    const sessionCurrency = session.currency?.toLowerCase();
    const discountedAmount = session.total_details?.amount_discount ?? 0;
    const taxAmount = session.total_details?.amount_tax ?? 0;

    if (discountedAmount > 0 || taxAmount > 0) {
      console.error(
        `Unsupported adjustments detected for session ${stripeSessionId}: discounts=${discountedAmount}, taxes=${taxAmount}`
      );
      return NextResponse.json(
        { error: "La commande contient des remises ou taxes non prises en charge." },
        { status: 400 }
      );
    }

    if (sessionCurrency && sessionCurrency !== "eur") {
      console.error(
        `Unexpected currency for session ${stripeSessionId}: ${session.currency}`
      );
      return NextResponse.json(
        { error: "Devise de paiement invalide." },
        { status: 400 }
      );
    }

    if (typeof amountTotalPaid !== "number") {
      console.error(
        `Unable to read amount_total for session ${stripeSessionId}: ${amountTotalPaid}`
      );
      return NextResponse.json(
        { error: "Montant payé introuvable." },
        { status: 400 }
      );
    }

    if (amountTotalPaid !== expectedTotalInCents) {
      console.error(
        `Amount mismatch for session ${stripeSessionId}: expected=${expectedTotalInCents}, paid=${amountTotalPaid}`
      );
      return NextResponse.json(
        { error: "Le montant payé ne correspond pas au total attendu." },
        { status: 400 }
      );
    }

    const total = subtotal + shippingDetails.price;

    const orderResponse = await orderApis.createOrder({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        userEmail,
        shippingAddress: formatAddress(shippingAddressPayload),
        billingAddress: formatAddress(
          billingAddressPayload ?? shippingAddressPayload
        ),
        shipping: shippingDetails,
        subtotal,
        total,
        orderStatus: "paid",
        stripeSessionId,
      },
    });

    const orderDocumentId =
      orderResponse?.data?.data?.documentId ??
      orderResponse?.data?.data?.id ??
      orderResponse?.data?.documentId ??
      orderResponse?.data?.id;

    if (!orderDocumentId) {
      console.error("Commande créée sans identifiant de document", orderResponse?.data);
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
    console.error("Échec du traitement de la commande", error);
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
    console.error("Échec de la récupération des commandes", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}