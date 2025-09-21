import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import strapiClient from "@/app/api/_lib/strapiClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await strapiClient.post("/orders", body);

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error("Failed to create order", error);
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message = error.response?.data ?? {
        error: "Failed to create order",
      };
      return NextResponse.json(message, { status });
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
