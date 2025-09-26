import { NextResponse } from "next/server";
import orderApis from "@/app/strapi/orderApis";

const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "re_X7bFcYsr_G8X1YbLriJx1Enh65JtYir3C";

type RequestBody = {
  stripeSessionId?: string;
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

type OrderLine = {
  quantity?: number;
  unitPrice?: number;
  product?: {
    title?: string;
  };
};

type OrderPayload = {
  id?: number;
  orderNumber?: string;
  userEmail?: string;
  subtotal?: number;
  total?: number;
  shipping?: {
    price?: number;
    carrier?: string;
  };
  createdAt?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  order_lines?: OrderLine[];
};

const escapeHtml = (value: unknown) => {
  const stringValue =
    value === null || typeof value === "undefined" ? "" : String(value);

  return stringValue
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const formatCurrency = (value: unknown) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value ?? 0));

const formatAddress = (address?: Address) => {
  if (!address) {
    return {
      html: "",
      text: "",
    };
  }

  const lines = [
    address.fullName,
    address.company,
    address.address1,
    address.address2,
    `${address.postalCode ?? ""} ${address.city ?? ""}`.trim(),
    address.country,
    address.phone ? `Tél: ${address.phone}` : undefined,
  ].filter((line) => Boolean(line && String(line).trim().length));

  const html = lines
    .map((line) => `<div>${escapeHtml(String(line))}</div>`)
    .join("");

  const text = lines.map((line) => String(line)).join("\n");

  return { html, text };
};

const buildOrderLinesHtml = (orderLines: OrderLine[] = []) => {
  if (!orderLines.length) {
    return "<tr><td colspan=\"3\">Aucun article trouvé pour cette commande.</td></tr>";
  }

  return orderLines
    .map((line) => {
      const quantity = Number(line.quantity ?? 0);
      const unitPrice = Number(line.unitPrice ?? 0);
      const productTotal = unitPrice * quantity;

      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(
            line.product?.title ?? "Article"
          )}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(
            productTotal
          )}</td>
        </tr>
      `;
    })
    .join("");
};

const buildOrderLinesText = (orderLines: OrderLine[] = []) => {
  if (!orderLines.length) {
    return "Aucun article trouvé pour cette commande.";
  }

  return orderLines
    .map((line) => {
      const quantity = Number(line.quantity ?? 0);
      const unitPrice = Number(line.unitPrice ?? 0);
      const productTotal = unitPrice * quantity;
      const productTitle = line.product?.title ?? "Article";

      return `- ${productTitle} x${quantity} — ${formatCurrency(productTotal)}`;
    })
    .join("\n");
};

const buildEmailContent = (order: OrderPayload) => {
  const orderNumber = order.orderNumber ?? `#${order.id ?? ""}`;
  const subtotal = formatCurrency(order.subtotal ?? 0);
  const shippingCost = formatCurrency(order.shipping?.price ?? 0);
  const total = formatCurrency(order.total ?? 0);
  const shippingCarrier = order.shipping?.carrier ?? "Livraison";
  const createdAt = order.createdAt
    ? new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(order.createdAt))
    : undefined;

  const shippingAddress = formatAddress(order.shippingAddress);
  const billingAddress = formatAddress(order.billingAddress);

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h1 style="font-size: 24px; margin-bottom: 16px;">Merci pour votre commande !</h1>
      <p style="margin-bottom: 12px;">Votre commande <strong>${escapeHtml(
        orderNumber
      )}</strong> a bien été confirmée${
    createdAt ? ` le ${escapeHtml(createdAt)}` : ""
  }.</p>
      <h2 style="font-size: 20px; margin: 24px 0 12px;">Détails de la commande</h2>
      <table style="width: 100%; border-collapse: collapse; background-color: #f9fafb;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 2px solid #e5e7eb;">Article</th>
            <th style="text-align: center; padding: 8px; border-bottom: 2px solid #e5e7eb;">Qté</th>
            <th style="text-align: right; padding: 8px; border-bottom: 2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${buildOrderLinesHtml(order.order_lines)}
        </tbody>
      </table>
      <div style="margin-top: 16px; text-align: right;">
        <div>Sous-total : <strong>${subtotal}</strong></div>
        <div>${escapeHtml(shippingCarrier)} : <strong>${shippingCost}</strong></div>
        <div style="font-size: 18px; margin-top: 8px;">Total TTC : <strong>${total}</strong></div>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px;">
        <div style="flex: 1 1 240px;">
          <h3 style="font-size: 18px; margin-bottom: 8px;">Adresse de livraison</h3>
          ${shippingAddress.html || "<div>Non renseignée</div>"}
        </div>
        <div style="flex: 1 1 240px;">
          <h3 style="font-size: 18px; margin-bottom: 8px;">Adresse de facturation</h3>
          ${billingAddress.html || "<div>Non renseignée</div>"}
        </div>
      </div>
      <p style="margin-top: 24px;">Nous restons disponibles pour toute question. Merci de votre confiance.</p>
    </div>
  `;

  const text = `Merci pour votre commande !\n\nCommande ${orderNumber}${
    createdAt ? ` confirmée le ${createdAt}` : ""
  }.\n\nArticles:\n${buildOrderLinesText(order.order_lines)}\n\nSous-total : ${subtotal}\n${
    shippingCarrier
  } : ${shippingCost}\nTotal TTC : ${total}\n\nAdresse de livraison:\n${
    shippingAddress.text || "Non renseignée"
  }\n\nAdresse de facturation:\n${
    billingAddress.text || "Non renseignée"
  }\n\nMerci de votre confiance.`;

  return { html, text };
};

export async function POST(request: Request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Clé API Resend manquante" },
        { status: 500 }
      );
    }

    const body: RequestBody = await request.json();
    const stripeSessionId = body?.stripeSessionId?.trim();

    if (!stripeSessionId) {
      return NextResponse.json(
        { error: "stripeSessionId est requis" },
        { status: 400 }
      );
    }

    const orderResponse = await orderApis.getOrderByStripeSession(stripeSessionId);
    const orderData = orderResponse?.data?.data;
    const order = Array.isArray(orderData)
      ? (orderData[0] as OrderPayload | undefined)
      : (orderData as OrderPayload | undefined);

    if (!order || !order.userEmail) {
      return NextResponse.json(
        { error: "Aucune commande trouvée pour cette session Stripe" },
        { status: 404 }
      );
    }

    const recipientEmail = order.userEmail.trim();

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Adresse email de l'utilisateur manquante" },
        { status: 422 }
      );
    }

    const { html, text } = buildEmailContent(order);

    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ElecConnect <no-reply@elecconnect.fr>",
        to: [recipientEmail],
        subject: `Confirmation de commande ${order.orderNumber ?? ""}`.trim(),
        html,
        text,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("Resend API error", resendResponse.status, errorBody);
      return NextResponse.json(
        { error: "Échec de l'envoi de l'email", details: errorBody },
        { status: 502 }
      );
    }

    const resendData = await resendResponse.json();

    return NextResponse.json(
      {
        success: true,
        resendId: resendData?.id ?? null,
        orderId: order.id ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend API route error", error);
    return NextResponse.json(
      { error: "Erreur interne lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
