import { NextResponse } from "next/server";
import orderApis from "@/app/strapi/orderApis";
import { RESEND_API_KEY } from "@/app/lib/serverEnv";

type OrderLine = {
  quantity?: number;
  unitPrice?: number;
  product?: {
    title?: string;
  };
};

type Address = {
  fullName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  postalCode?: string | number;
  city?: string;
  country?: string;
  phone?: string;
};

type OrderPayload = {
  orderNumber?: string;
  createdAt?: string;
  subtotal?: number;
  total?: number;
  userEmail?: string;
  shipping?: {
    carrier?: string;
    price?: number;
  } | null;
  shippingAddress?: Address;
  billingAddress?: Address;
  order_lines?: OrderLine[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

const normalizeAmount = (amount: number | string | null | undefined) => {
  if (typeof amount === "string") {
    const parsed = Number(amount);
    amount = Number.isNaN(parsed) ? undefined : parsed;
  }

  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return 0;
  }

  return amount >= 1000 ? amount / 100 : amount;
};

const formatAddress = (address?: Address) => {
  if (!address) {
    return "Informations indisponibles";
  }

  const addressLines = [
    address.fullName,
    address.company,
    address.address1,
    address.address2,
    [address.postalCode, address.city].filter(Boolean).join(" "),
    address.country,
    address.phone ? `Téléphone : ${address.phone}` : undefined,
  ]
    .filter((line) => Boolean(line))
    .map((line) => `<div>${line}</div>`)
    .join("");

  return addressLines || "Informations indisponibles";
};

const formatOrderLines = (orderLines: OrderLine[] = []) => {
  if (orderLines.length === 0) {
    return "<tr><td colspan='3'>Aucun produit trouvé pour cette commande.</td></tr>";
  }

  return orderLines
    .map((line) => {
      const title = line.product?.title ?? "Produit";
      const quantity = typeof line.quantity === "number" ? line.quantity : 0;
      const unitPrice = typeof line.unitPrice === "number" ? line.unitPrice : 0;
      const total = normalizeAmount(unitPrice * quantity);

      return `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${title}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${quantity}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${currencyFormatter.format(total)}</td>
        </tr>
      `;
    })
    .join("");
};

const buildEmailHtml = (order: OrderPayload) => {
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date inconnue";

  const subtotal = currencyFormatter.format(normalizeAmount(order.subtotal));
  const shippingPrice = currencyFormatter.format(normalizeAmount(order.shipping?.price));
  const total = currencyFormatter.format(normalizeAmount(order.total));

  return `
    <div style="font-family: Arial, sans-serif; color: #111827;">
      <h1 style="font-size: 20px;">Confirmation de commande</h1>
      <p>Bonjour ${order.shippingAddress?.fullName ?? ""},</p>
      <p>Merci pour votre achat. Voici le récapitulatif de votre commande.</p>

      <div style="margin: 24px 0;">
        <strong>Commande n°:</strong> ${order.orderNumber}<br />
        <strong>Date:</strong> ${orderDate}<br />
        <strong>Mode de livraison:</strong> ${order.shipping?.carrier ?? "Non spécifié"}
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="text-align: left; padding: 8px 12px;">Produit</th>
            <th style="text-align: center; padding: 8px 12px;">Quantité</th>
            <th style="text-align: right; padding: 8px 12px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${formatOrderLines(order.order_lines ?? [])}
        </tbody>
      </table>

      <div style="margin-bottom: 24px;">
        <div>Sous-total : ${subtotal}</div>
        <div>Livraison : ${shippingPrice}</div>
        <div style="font-weight: bold;">Total : ${total}</div>
      </div>

      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        <div>
          <h2 style="font-size: 16px; margin-bottom: 8px;">Adresse de livraison</h2>
          ${formatAddress(order.shippingAddress)}
        </div>
        <div>
          <h2 style="font-size: 16px; margin-bottom: 8px;">Adresse de facturation</h2>
          ${formatAddress(order.billingAddress)}
        </div>
      </div>

      <p style="margin-top: 24px;">Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      <p>L'équipe ElecConnect</p>
    </div>
  `;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stripeSessionId = body?.stripeSessionId;

    if (!stripeSessionId || typeof stripeSessionId !== "string") {
      return NextResponse.json(
        { error: "Le paramètre stripeSessionId est requis." },
        { status: 400 }
      );
    }

    const orderResponse = await orderApis.getOrderByStripeSession(stripeSessionId);
    const order = orderResponse?.data?.data?.[0] as OrderPayload | undefined;

    if (!order) {
      return NextResponse.json(
        { error: "Aucune commande trouvée pour cette session Stripe." },
        { status: 404 }
      );
    }

    if (!order.userEmail) {
      return NextResponse.json(
        { error: "Aucune adresse email n'est associée à cette commande." },
        { status: 422 }
      );
    }

    const emailPayload = {
      from: "ElecConnect <no-reply@elecconnect.com>",
      to: [order.userEmail],
      subject: `Confirmation de commande ${order.orderNumber}`,
      html: buildEmailHtml(order),
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error", errorText);
      return NextResponse.json(
        { error: "Échec de l'envoi de l'email de confirmation." },
        { status: 502 }
      );
    }

    const resendResult = await resendResponse.json();

    return NextResponse.json({ success: true, resendId: resendResult.id ?? null });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

