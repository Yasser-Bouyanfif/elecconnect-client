import { NextResponse } from "next/server";
import crypto from "crypto";
import { GOOGLE_API_KEY, GOOGLE_PLACE_ID } from "@/app/lib/serverEnv";

// Compare deux secrets de façon sécurisée
function timingSafeEquals(a?: string, b?: string) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(req: Request) {
  // Vérifier le header secret
  const headerSecret = req.headers.get("x-internal-secret") || "";
  const envSecret = process.env.INTERNAL_API_SECRET || "";
  if (!timingSafeEquals(headerSecret, envSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  if (!GOOGLE_PLACE_ID || !GOOGLE_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
    GOOGLE_PLACE_ID
  )}&fields=reviews,rating,user_ratings_total&language=fr&key=${encodeURIComponent(GOOGLE_API_KEY)}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json({ reviews: data.result?.reviews || [] });
}
