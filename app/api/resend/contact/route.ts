import { NextResponse } from "next/server";
import { RESEND_API_KEY } from "@/app/lib/serverEnv";

type ContactPayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  content?: string;
};

const sanitize = (value?: string) =>
  typeof value === "string" ? value.trim() : "";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildHtml = ({ fullName, phone, email, content }: Required<ContactPayload>) => `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Nouveau message de contact</title>
    </head>
    <body>
      <h1>Nouveau message de contact</h1>
      <p><strong>Nom complet :</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Téléphone :</strong> ${escapeHtml(phone || 'Non communiqué')}</p>
      <p><strong>Email :</strong> ${escapeHtml(email)}</p>
      <p><strong>Message :</strong></p>
      <pre>${escapeHtml(content)}</pre>
      <hr />
      <p>Ce message a été envoyé depuis le formulaire de contact du site ElecConnect.</p>
    </body>
  </html>
`;

const buildText = ({ fullName, phone, email, content }: Required<ContactPayload>) =>
  [
    "Nouveau message de contact",
    "",
    `Nom complet : ${fullName}`,
    `Téléphone : ${phone || "Non communiqué"}`,
    `Email : ${email}`,
    "",
    "Message :",
    content,
    "",
    "Ce message a été envoyé depuis le formulaire de contact du site ElecConnect.",
  ].join("\n");

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    const fullName = sanitize(body.fullName);
    const phone = sanitize(body.phone);
    const email = sanitize(body.email);
    const content = sanitize(body.content);

    if (!fullName || !email || !content) {
      return NextResponse.json(
        { error: "Les champs fullName, email et content sont obligatoires." },
        { status: 400 }
      );
    }

    const emailPayload = {
      from: "ElecConnect <noreply@updates.chajaratmaryam.fr>",
      to: ["contact@elecconnect.fr"],
      reply_to: email,
      subject: "Nouveau message via le formulaire de contact",
      html: buildHtml({ fullName, phone, email, content }),
      text: buildText({ fullName, phone, email, content }),
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
