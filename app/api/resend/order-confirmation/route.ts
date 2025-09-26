import { NextResponse } from "next/server";
import orderApis from "@/app/strapi/orderApis";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

const FROM_EMAIL = "ElecConnect <noreply@elecconnect.fr>";

const formatCurrency = (value: number | null | undefined) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value ?? 0);

const formatAddress = (address?: {
  fullName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  postalCode?: string | number;
  city?: string;
  country?: string;
  phone?: string;
}) => {
  if (!address) {
    return "Non renseignée";
  }

  const lines = [
    address.fullName,
    address.company,
    address.address1,
    address.address2,
    address.postalCode && address.city
      ? `${address.postalCode} ${address.city}`
      : address.city ?? address.postalCode,
    address.country,
    address.phone ? `Téléphone : ${address.phone}` : undefined,
  ].filter(Boolean);

  return lines.join("<br />");
};

const formatOrderLinesHtml = (
  orderLines?: Array<{
    quantity?: number;
    unitPrice?: number;
    product?: { title?: string };
  }>
) => {
  if (!orderLines?.length) {
    return "<li>Aucun article</li>";
  }

  return orderLines
    .map((line) => {
      const title = line.product?.title ?? "Article";
      const quantity = line.quantity ?? 0;
      const unitPrice = formatCurrency(line.unitPrice ?? 0);
      return `<li><strong>${title}</strong> &times; ${quantity} — ${unitPrice}</li>`;
    })
    .join("");
};

const formatOrderLinesText = (
  orderLines?: Array<{
    quantity?: number;
    unitPrice?: number;
    product?: { title?: string };
  }>
) => {
  if (!orderLines?.length) {
    return "- Aucun article";
  }

  return orderLines
    .map((line) => {
      const title = line.product?.title ?? "Article";
      const quantity = line.quantity ?? 0;
      const unitPrice = formatCurrency(line.unitPrice ?? 0);
      return `- ${title} x${quantity} — ${unitPrice}`;
    })
    .join("\n");
};

export async function POST(request: Request) {
  try {
    const { stripeSessionId } = await request.json();

    if (!stripeSessionId || typeof stripeSessionId !== "string") {
      return NextResponse.json(
        { error: "Paramètre stripeSessionId manquant" },
        { status: 400 }
      );
    }

    const orderResponse = await orderApis.getOrderByStripeSession(stripeSessionId);

    const order = orderResponse?.data?.data?.[0];

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    const customerEmail = order.userEmail ?? undefined;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Aucun email associé à la commande" },
        { status: 422 }
      );
    }

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Date inconnue";

    const shippingCost = order.shipping?.price ?? 0;
    const subtotal = order.subtotal ?? 0;
    const total = order.total ?? subtotal + shippingCost;

    const subject = `Confirmation de votre commande ${order.orderNumber}`;

    const shippingAddressHtml = formatAddress(order.shippingAddress);
    const billingAddressHtml = formatAddress(order.billingAddress);
    const shippingAddressText = shippingAddressHtml.replace(/<br \/>/g, "\n");
    const billingAddressText = billingAddressHtml.replace(/<br \/>/g, "\n");

    const html = `
      <div style="font-family: Arial, sans-serif; color: #0f172a;">
        <h1 style="color: #0ea5e9;">Merci pour votre commande !</h1>
        <p>Bonjour ${order.shippingAddress?.fullName ?? ""},</p>
        <p>Nous confirmons la réception de votre commande <strong>${order.orderNumber}</strong> passée le ${orderDate}.</p>
        <h2>Détails de la commande</h2>
        <ul>
          ${formatOrderLinesHtml(order.order_lines)}
        </ul>
        <p><strong>Sous-total :</strong> ${formatCurrency(subtotal)}</p>
        <p><strong>Livraison (${order.shipping?.carrier ?? ""}) :</strong> ${formatCurrency(shippingCost)}</p>
        <p><strong>Total :</strong> ${formatCurrency(total)}</p>
        <h2>Adresse de livraison</h2>
        <p>${shippingAddressHtml}</p>
        <h2>Adresse de facturation</h2>
        <p>${billingAddressHtml}</p>
        <p>Vous recevrez une notification lorsque votre commande sera expédiée.</p>
        <p>L'équipe ElecConnect</p>
      </div>
    `;

    const text = `Merci pour votre commande !\n\nCommande : ${order.orderNumber}\nDate : ${orderDate}\n\nArticles :\n${formatOrderLinesText(order.order_lines)}\n\nSous-total : ${formatCurrency(subtotal)}\nLivraison (${order.shipping?.carrier ?? ""}) : ${formatCurrency(shippingCost)}\nTotal : ${formatCurrency(total)}\n\nAdresse de livraison :\n${shippingAddressText}\n\nAdresse de facturation :\n${billingAddressText}\n\nL'équipe ElecConnect`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [customerEmail],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      console.error("Resend API error", errorMessage);
      return NextResponse.json(
        { error: "Échec de l'envoi via Resend" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send confirmation email", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email de confirmation" },
      { status: 500 }
    );
  }
}
