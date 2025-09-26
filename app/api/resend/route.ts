import { NextResponse } from "next/server";
import orderApis from "@/app/strapi/orderApis";
import { RESEND_API_KEY } from "@/app/lib/serverEnv";
import { LOCAL_URL } from "@/app/lib/constants";
import { useEffect } from "react";

type OrderLine = {
  quantity?: number;
  unitPrice?: number;
  product?: { title?: string };
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
  shipping?: { carrier?: string; price?: number } | null;
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
  if (typeof amount !== "number" || Number.isNaN(amount)) return 0;
  return amount >= 1000 ? amount / 100 : amount;
};

const formatAddress = (address?: Address) => {
  if (!address) {
    return "<div style='color:#9ca3af;font-style:italic;'>Non fourni</div>";
  }
  const lines = [
    address.fullName ? `<strong>${address.fullName}</strong>` : null,
    address.company,
    address.address1,
    address.address2,
    [address.postalCode, address.city].filter(Boolean).join(" "),
    address.country,
    address.phone ? `Tél : ${address.phone}` : null,
  ].filter(Boolean);

  return lines.map((l) => `<div style="line-height:1.4">${l}</div>`).join("");
};

const formatOrderLines = (lines: OrderLine[] = []) => {
  if (lines.length === 0) {
    return `<tr><td colspan="3" style="padding:12px;text-align:center;color:#6b7280;">Aucun produit</td></tr>`;
  }

  return lines
    .map((line) => {
      const title = line.product?.title ?? "Produit";
      const qte = line.quantity ?? 0;
      const unit = normalizeAmount(line.unitPrice);
      const total = normalizeAmount(unit * qte);
      return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;">
            ${title}<br><span style="color:#6b7280;font-size:12px;">${currencyFormatter.format(unit)} /u</span>
          </td>
          <td style="padding:10px;text-align:center;border-bottom:1px solid #e5e7eb;">${qte}</td>
          <td style="padding:10px;text-align:right;border-bottom:1px solid #e5e7eb;font-weight:600;">
            ${currencyFormatter.format(total)}
          </td>
        </tr>`;
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
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      /* Base */
      body { background:#f9fafb; font-family:Arial,Helvetica,sans-serif; color:#1f2937; margin:0; padding:16px; }
      .container { max-width:650px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; }
      .header { display:flex; align-items:center; gap:12px; padding:18px 20px; border-bottom:1px solid #e5e7eb; }
      .header img { height:40px; }
      .header-title { font-size:22px; font-weight:700; color:#111827; letter-spacing:.2px; }

      .content { padding:24px; }
      h2 { font-size:20px; margin:0 0 14px; color:#111827; }
      h3.section { font-size:16px; margin:16px 0 8px; color:#111827; }
      p { font-size:14px; color:#374151; line-height:1.6; margin:0 0 14px; }

      /* Cards */
      .card { border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin-top:16px; }

      /* Tables */
      table { width:100%; border-collapse:collapse; }
      th, td { font-size:14px; padding:10px; }
      th { background:#f3f4f6; text-align:left; color:#374151; }
      .td-right { text-align:right; }
      .row-divider td { border-bottom:1px solid #e5e7eb; }

      /* Produits */
      .muted { color:#6b7280; font-size:12px; }

      /* Totaux (table pour compat e-mail clients) */
      .totals { margin-top:10px; }
      .totals-table td { padding:8px 0; font-size:14px; }
      .totals-label { color:#374151; }
      .totals-amount { text-align:right; font-variant-numeric:tabular-nums; }
      .grand { border-top:1px solid #e5e7eb; padding-top:10px; font-weight:700; color:#111827; }

      /* Adresses */
      .address { 
        border: 1px solid #e5e7eb; 
        border-radius: 6px; 
        padding: 16px; 
        font-size: 14px; 
        margin-top: 16px;
        background: #f9fafb;
      }
      .address .pill {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 4px;
        background: #10b981;
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }
      .address .line { 
        line-height: 1.6;
        color: #374151;
      }

      /* Bouton */
      .btn-wrap { 
        text-align: center;
        margin: 24px 0 16px;
      }
      .btn {
        display: inline-block;
        text-decoration: none;
        background: #34d399; /* Vert émeraude plus clair */
        background-image: linear-gradient(180deg, #34d399, #10b981);
        color: #ffffff !important;
        padding: 12px 28px;
        border-radius: 6px;           /* Moins arrondi */
        font-weight: 600;
        font-size: 14px;
        border: none;
        box-shadow: 0 4px 12px rgba(52, 211, 153, 0.25);
        letter-spacing: 0.3px;
        transition: all 0.2s ease;
      }
      .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(52, 211, 153, 0.3);
      }
      .footer { text-align:center; font-size:12px; color:#6b7280; padding:16px; border-top:1px solid #e5e7eb; }
      @media (prefers-color-scheme: dark) {
        body { background:#0b1220; }
        .container { border-color:#1f2937; background:#0f172a; }
        .header { border-bottom-color:#1f2937; }
        th { background:#111827; color:#e5e7eb; }
        .card { border-color:#1f2937; }
        .address { border-color:#1f2937; }
        .footer { border-top-color:#1f2937; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${LOCAL_URL}/image01-high.webp" alt="logo" />
        <div class="header-title">ELEC'CONNECT</div>
      </div>

      <div class="content">
        <h2>Merci pour votre commande 🎉</h2>
        <p>Bonjour ${order.billingAddress?.fullName || "client"},<br />
        Votre commande a bien été reçue.</p>

        <!-- Récap -->
        <div class="card">
          <table role="presentation" aria-label="Récapitulatif">
            <tr>
              <th>N° commande</th>
              <th>Date</th>
              <th>Livraison</th>
            </tr>
            <tr class="row-divider">
              <td>${order.orderNumber || "N/A"}</td>
              <td>${orderDate}</td>
              <td>${order.shipping?.carrier || "Non spécifié"}</td>
            </tr>
          </table>
        </div>

        <!-- Produits -->
        <div class="card">
          <h3 class="section">Produits</h3>
          <table role="presentation" aria-label="Produits">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Qté</th>
                <th class="td-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${formatOrderLines(order.order_lines)}
            </tbody>
          </table>

          <!-- Totaux en tableau: labels espacés des montants -->
          <div class="totals">
            <table class="totals-table" role="presentation" aria-label="Totaux">
              <tr>
                <td class="totals-label">Sous-total</td>
                <td class="totals-amount td-right">${subtotal}</td>
              </tr>
              <tr>
                <td class="totals-label">Livraison</td>
                <td class="totals-amount td-right">${shippingPrice}</td>
              </tr>
              <tr>
                <td class="totals-label grand">Total TTC</td>
                <td class="totals-amount td-right grand">${total}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Adresses, titres en "pill" -->
        <h3 class="section">Adresses</h3>

        <div class="address">
          <div class="pill">Livraison</div><br />
          ${formatAddress(order.shippingAddress)
            .replaceAll("<div", "<div class='line'")}
        </div>

        <div class="address">
          <div class="pill">Facturation</div><br />
          ${formatAddress(order.billingAddress)
            .replaceAll("<div", "<div class='line'")}
        </div>

        <div class="btn-wrap">
          <a href="https://elecconnect.fr/sign-in" class="btn">Accéder à mon compte</a>
        </div>
      </div>

      <div class="footer">© ${new Date().getFullYear()} ElecConnect — Tous droits réservés</div>
    </div>
  </body>
  </html>`;
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
      from: "ElecConnect <no-reply@updates.chajaratmaryam.fr>",
      to: [order.userEmail],
      subject: `Confirmation de commande.`,
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
        { error: "Échec de l'envoi de l'email." },
        { status: 502 }
      );
    }

    const resendResult = await resendResponse.json();
    return NextResponse.json({ success: true, resendId: resendResult.id ?? null });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
