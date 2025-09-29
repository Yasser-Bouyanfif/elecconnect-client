import { NextResponse } from "next/server";
import promotionApi from "@/app/strapi/promotionApi";
import { promotionRequestSchema } from "@/app/lib/validation/promotion";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Corps de requête JSON invalide pour le code promotionnel", error);
      return NextResponse.json(
        { error: "Requête invalide" },
        { status: 400 }
      );
    }

    const validation = promotionRequestSchema.safeParse(body);
    if (!validation.success) {
      const [firstIssue] = validation.error.issues;
      return NextResponse.json(
        {
          error:
            firstIssue?.message ?? "Code promotionnel invalide",
        },
        { status: 400 }
      );
    }

    const { code } = validation.data;

    const { data } = await promotionApi.getPromotionById(code);
    const promotion = data.data[0];

    if (!promotion?.code) {
      return NextResponse.json(
        { error: "Code promotionnel invalide" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      reduction: promotion.reduction,
      code: promotion.code
    });

  } catch (error) {
    console.error("Erreur lors de la vérification du code promotionnel:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la vérification du code" },
      { status: 500 }
    );
  }
}
