import { NextResponse } from "next/server";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY ?? "re_hNMWqpKj_KUj6JCJ5rkpczCrUkC14dDuL";

type EmailType = "registration" | "payment";

interface RegistrationUser {
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface RegistrationConfirmationInput {
  to?: string;
  user: RegistrationUser;
}

interface PaymentConfirmationInput {
  to?: string;
  email?: string;
  orderNumber: string;
}

interface RegistrationPayload extends RegistrationConfirmationInput {
  type: "registration";
}

interface PaymentPayload extends PaymentConfirmationInput {
  type: "payment";
}

type RequestPayload = RegistrationPayload | PaymentPayload;

interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

class EmailError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, options: { status?: number; details?: unknown } = {}) {
    super(message);
    this.status = options.status ?? 500;
    this.details = options.details;
  }
}

function buildRegistrationEmail(user: RegistrationUser): EmailContent {
  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const displayName = fullName || firstName || lastName;

  const greeting = displayName ? `Bonjour ${displayName},` : "Bonjour,";

  const subject = "Bienvenue parmi nous !";
  const text = [
    greeting,
    "\n",
    "Merci pour votre inscription, nous sommes ravis de vous compter parmi nous.",
    "\n\n",
    "À très bientôt sur ElecConnect !",
  ].join("");

  const html = `<!doctype html>
<html lang="fr">
  <body>
    <p>${greeting}</p>
    <p>Merci pour votre inscription, nous sommes ravis de vous compter parmi nous.</p>
    <p>À très bientôt sur ElecConnect&nbsp;!</p>
  </body>
</html>`;

  return { subject, text, html };
}

function buildPaymentEmail(orderNumber: string): EmailContent {
  const cleanOrderNumber = orderNumber.trim();
  const subject = `Merci pour votre paiement - Commande ${cleanOrderNumber}`;
  const text = [
    "Bonjour,",
    "\n",
    `Nous confirmons la réception de votre paiement pour la commande ${cleanOrderNumber}.`,
    "\n\n",
    "Merci pour votre confiance et à très vite !",
  ].join("");

  const html = `<!doctype html>
<html lang="fr">
  <body>
    <p>Bonjour,</p>
    <p>Nous confirmons la réception de votre paiement pour la commande ${cleanOrderNumber}.</p>
    <p>Merci pour votre confiance et à très vite&nbsp;!</p>
  </body>
</html>`;

  return { subject, text, html };
}

async function dispatchEmail(to: string, email: EmailContent) {
  if (!RESEND_API_KEY) {
    throw new EmailError(
      "La clé API Resend est manquante. Merci de définir la variable RESEND_API_KEY.",
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "no-reply@updates.chajaratmaryam.fr",
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new EmailError(
      data?.message ?? "Resend a renvoyé une erreur lors de l’envoi.",
      {
        status: response.status,
        details: typeof data === "object" ? data : String(data),
      },
    );
  }

  return data;
}

export async function sendRegistrationConfirmation({
  to,
  user,
}: RegistrationConfirmationInput) {
  if (!user) {
    throw new EmailError(
      "Merci de fournir les informations de l’utilisateur pour la confirmation d’inscription.",
      { status: 400 },
    );
  }

  const toAddress = to?.trim() || user.email?.trim();

  if (!toAddress) {
    throw new EmailError(
      "Merci de renseigner l’adresse e-mail du destinataire pour la confirmation d’inscription.",
      { status: 400 },
    );
  }

  const emailContent = buildRegistrationEmail(user);
  return dispatchEmail(toAddress, emailContent);
}

export async function sendPaymentConfirmation({
  to,
  email,
  orderNumber,
}: PaymentConfirmationInput) {
  const cleanOrderNumber = orderNumber?.trim();

  if (!cleanOrderNumber) {
    throw new EmailError(
      "Merci de renseigner le numéro de commande pour la confirmation de paiement.",
      { status: 400 },
    );
  }

  const toAddress = to?.trim() || email?.trim();

  if (!toAddress) {
    throw new EmailError(
      "Merci de renseigner l’adresse e-mail du destinataire pour la confirmation de paiement.",
      { status: 400 },
    );
  }

  const emailContent = buildPaymentEmail(cleanOrderNumber);
  return dispatchEmail(toAddress, emailContent);
}

export async function POST(request: Request) {
  const payload: Partial<RequestPayload> & { type?: EmailType } =
    await request.json();

  const type = payload.type;

  if (!type) {
    return NextResponse.json(
      { error: "Merci de préciser le type de confirmation à envoyer." },
      { status: 400 },
    );
  }

  try {
    if (type === "registration") {
      const { to, user } = payload as RegistrationPayload;
      const data = await sendRegistrationConfirmation({ to, user });
      return NextResponse.json({ id: data?.id, data });
    }

    if (type === "payment") {
      const { to, email, orderNumber } = payload as PaymentPayload;
      const data = await sendPaymentConfirmation({ to, email, orderNumber });
      return NextResponse.json({ id: data?.id, data });
    }
  } catch (error) {
    if (error instanceof EmailError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        error: "Une erreur inattendue est survenue lors de l’envoi de l’e-mail.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { error: "Type de confirmation inconnu." },
    { status: 400 },
  );
}
