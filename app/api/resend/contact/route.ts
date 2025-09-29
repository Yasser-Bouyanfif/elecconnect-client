import { NextResponse } from "next/server";
import { RESEND_API_KEY } from "@/app/lib/serverEnv";
import {
  contactFormServerSchema,
  type ContactFormServerPayload,
} from "@/app/lib/validation/contact";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildHtml = ({
  fullName,
  phone,
  email,
  content,
}: ContactFormServerPayload) => `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Nouveau message de contact</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; background:#f9fafb; color:#1f2937; margin:0; padding:24px; }
        .container { max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; }
        .header { background:#10b981; padding:20px; color:#ffffff; }
        .header h1 { margin:0; font-size:20px; }
        .content { padding:24px; }
        .label { font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:#6b7280; margin-bottom:4px; }
        .value { font-size:15px; color:#111827; margin-bottom:16px; }
        .value strong { font-weight:600; }
        .message { white-space:pre-line; line-height:1.6; background:#f3f4f6; padding:16px; border-radius:8px; }
        .footer { background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nouveau message de contact</h1>
        </div>
        <div class="content">
          <div>
            <div class="label">Nom complet</div>
            <div class="value"><strong>${escapeHtml(fullName)}</strong></div>
          </div>
          <div>
            <div class="label">Téléphone</div>
            <div class="value">${escapeHtml(phone || 'Non communiqué')}</div>
          </div>
          <div>
            <div class="label">Email</div>
            <div class="value">${escapeHtml(email)}</div>
          </div>
          <div>
            <div class="label">Message</div>
            <div class="message">${escapeHtml(content)}</div>
          </div>
        </div>
        <div class="footer">
          Ce message a été envoyé depuis le formulaire de contact du site ElecConnect.
        </div>
      </div>
    </body>
  </html>
`;

export async function POST(request: Request) {
  try {
    const jsonBody = await request.json().catch(() => null);
    if (!jsonBody || typeof jsonBody !== "object") {
      return NextResponse.json(
        { error: "Le corps de la requête est invalide." },
        { status: 400 }
      );
    }

    const parsedBody = contactFormServerSchema.safeParse(jsonBody);

    if (!parsedBody.success) {
      const firstIssue = parsedBody.error.issues[0];
      return NextResponse.json(
        {
          error:
            firstIssue?.message ?? "Les données du formulaire de contact sont invalides.",
        },
        { status: 400 }
      );
    }

    const { fullName, phone, email, content } = parsedBody.data;

    const emailPayload = {
      from: "ElecConnect <noreply@updates.chajaratmaryam.fr>",
      to: ["contact@elecconnect.fr"],
      reply_to: email,
      subject: "Nouveau message via le formulaire de contact",
      html: buildHtml({ fullName, phone, email, content }),
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
      console.error("Erreur de l'API Resend pour le contact", errorText);
      return NextResponse.json(
        { error: "Échec de l'envoi du message." },
        { status: 502 }
      );
    }

    const result = await resendResponse.json();
    return NextResponse.json({ success: true, resendId: result.id ?? null });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message de contact", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
