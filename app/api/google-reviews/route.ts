import { NextResponse } from "next/server";
import { GOOGLE_API_KEY, GOOGLE_PLACE_ID } from "@/app/lib/serverEnv";

export async function GET() {
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
