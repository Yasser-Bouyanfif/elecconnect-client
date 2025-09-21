import { NextResponse } from 'next/server';
import productApi from '@/app/strapi/productApis';
import { productsSchema, type Product } from './schema';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const res = await productApi.getProducts();
    const rawData = res?.data?.data;

    const parsed = productsSchema.safeParse(rawData);

    if (!parsed.success) {
      console.error('Validation error for products payload:', parsed.errors);
      return NextResponse.json(
        { error: 'Données de produits invalides' },
        { status: 502 }
      );
    }

    const products: Product[] = parsed.data.map((product) => {
      const attributes = product.attributes;

      return {
        id: product.id,
        title: attributes.title,
        slug: attributes.slug,
        price: attributes.price,
        description: attributes.description,
        weight: attributes.weight,
        bannerUrl: attributes.banner.url,
      };
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Erreur de chargement des produits' },
      { status: 500 }
    );
  }
}
