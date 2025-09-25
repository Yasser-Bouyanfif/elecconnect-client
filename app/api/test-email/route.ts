import { NextResponse } from "next/server";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY ?? "re_hNMWqpKj_KUj6JCJ5rkpczCrUkC14dDuL";

interface RegistrationUser {
  email?: string;
  firstName?: string;
  lastName?: string;
}

type EmailType = "registration" | "payment";

interface RegistrationPayload {
  type: "registration";
  user?: RegistrationUser;
  to?: string;
}

interface PaymentPayload {
  type: "payment";
  orderNumber?: string;
  to?: string;
  email?: string;
}

type RequestPayload = RegistrationPayload | PaymentPayload;

function buildRegistrationEmail(user: RegistrationUser) {
  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const displayName = fullName || firstName || lastName;

  const greeting = displayName ? `Bonjour ${displayName},` : "Bonjour,";

  const subject = "Confirmation d'inscription";
  const text = [
    greeting,
    "\n",
    "Nous sommes ravis de confirmer votre inscription.",
    "\n\n",
    "Merci et à très vite !",
  ].join("");

  const html = `<!doctype html>
<html lang="fr">
  <body>
    <p>${greeting}</p>
    <p>Nous sommes ravis de confirmer votre inscription.</p>
    <p>Merci et à très vite&nbsp;!</p>
  </body>
</html>`;

  return { subject, text, html };
}

function buildPaymentEmail(orderNumber: string) {
  const cleanOrderNumber = orderNumber.trim();
  const subject = `Confirmation de paiement - Commande ${cleanOrderNumber}`;
  const text = [
    "Bonjour,",
    "\n",
    `Nous confirmons la réception du paiement pour la commande ${cleanOrderNumber}.`,
    "\n\n",
    "Merci pour votre confiance.",
  ].join("");

  const html = `<!doctype html>
<html lang="fr">
  <body>
    <p>Bonjour,</p>
    <p>Nous confirmons la réception du paiement pour la commande ${cleanOrderNumber}.</p>
    <p>Merci pour votre confiance.</p>
  </body>
</html>`;

  return { subject, text, html };
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

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      {
        error:
          "La clé API Resend est manquante. Merci de définir la variable RESEND_API_KEY.",
      },
      { status: 500 },
    );
  }

  let to = payload.to?.trim();
  let emailContent: ReturnType<typeof buildRegistrationEmail>;

  if (type === "registration") {
    const user = (payload as RegistrationPayload).user;

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Merci de fournir les informations de l’utilisateur pour la confirmation d’inscription.",
        },
        { status: 400 },
      );
    }

    if (!to) {
      const candidate = user.email?.trim();
      if (candidate) {
        to = candidate;
      }
    }

    if (!to) {
      return NextResponse.json(
        {
          error:
            "Merci de renseigner l’adresse e-mail du destinataire pour la confirmation d’inscription.",
        },
        { status: 400 },
      );
    }

    emailContent = buildRegistrationEmail(user);
  } else if (type === "payment") {
    const { orderNumber, email } = payload as PaymentPayload;
    const cleanOrderNumber = orderNumber?.trim();

    if (!cleanOrderNumber) {
      return NextResponse.json(
        {
          error:
            "Merci de renseigner le numéro de commande pour la confirmation de paiement.",
        },
        { status: 400 },
      );
    }

    if (!to) {
      const candidate = email?.trim();
      if (candidate) {
        to = candidate;
      }
    }

    if (!to) {
      return NextResponse.json(
        {
          error:
            "Merci de renseigner l’adresse e-mail du destinataire pour la confirmation de paiement.",
        },
        { status: 400 },
      );
    }

    emailContent = buildPaymentEmail(cleanOrderNumber);
  } else {
    return NextResponse.json(
      { error: "Type de confirmation inconnu." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "no-reply@updates.chajaratmaryam.fr",
        to: [to],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.message ?? "Resend a renvoyé une erreur lors de l’envoi.",
          details: typeof data === "object" ? JSON.stringify(data) : String(data),
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      id: data?.id,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Une erreur inattendue est survenue lors de l’appel à Resend.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
