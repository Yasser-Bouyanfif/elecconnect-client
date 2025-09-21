// app/api/products/route.js
import { NextResponse } from 'next/server';
import productApi from "@/app/strapi/productApis";

export async function GET() {
  try {
    const res = await productApi.getProducts();
    const data = res?.data?.data;

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Erreur de chargement des produits' },
      { status: 500 }
    );
  }
}