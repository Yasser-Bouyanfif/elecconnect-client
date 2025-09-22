import { NextResponse } from "next/server";
import promotionApi from "@/app/strapi/promotionApi";

type RequestBody = {
  code: string;
};

export async function POST(request: Request) {
  try {
    const { code } = await request.json() as RequestBody;

    if (!code) {
      return NextResponse.json(
        { error: "Code promotionnel requis" },
        { status: 400 }
      );
    }

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