import { NextResponse } from "next/server";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY ?? "re_hNMWqpKj_KUj6JCJ5rkpczCrUkC14dDuL";

interface RequestPayload {
  to?: string;
  subject?: string;
  message?: string;
}

export async function POST(request: Request) {
  const payload: RequestPayload = await request.json();
  const to = payload.to?.trim();
  const subject = payload.subject?.trim();
  const message = payload.message?.trim();

  if (!to || !subject || !message) {
    return NextResponse.json(
      {
        error: "Merci de renseigner le destinataire, l’objet et le message.",
      },
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
        subject,
        html: `<!doctype html><html lang="fr"><body><div>${message.replace(/\n/g, "<br/>")}</div></body></html>`,
        text: message,
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
