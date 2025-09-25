import { NextResponse } from "next/server";

type SendMailRequest = {
  to?: string;
  subject?: string;
  text?: string;
};

const RESEND_API_KEY = "re_fJK5mYuv_3XhuqndoLVfQW1VLX3mfkXDX";

export async function POST(request: Request) {
  const { to, subject, text }: SendMailRequest = await request.json().catch(() => ({}));

  if (!to || !subject || !text) {
    return NextResponse.json(
      {
        success: false,
        error: "Merci de renseigner les champs destinataire, sujet et message.",
      },
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
        from: "Elecconnect <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof data?.message === "string"
          ? data.message
          : "Une erreur est survenue lors de l'envoi de l'e-mail.";

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        error: "Impossible de contacter le service d'envoi d'e-mails.",
      },
      { status: 500 },
    );
  }
}
