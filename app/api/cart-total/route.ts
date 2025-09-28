import { NextResponse } from "next/server";
import productApi from "@/app/strapi/productApis";

type CartTotalItem = {
  id: string | number;
  quantity: number;
};

type StrapiV5Product = {
  id: string | number;
  title?: string;
  price?: unknown;
};

type CalculationResult = {
  total: number;
  items: {
    id: string | number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    title?: string;
    isValid: boolean;
  }[];
};

const parsePrice = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return 0;
};

const normalizeStrapiV5Product = (response: unknown): StrapiV5Product | null => {
  if (!response || typeof response !== 'object') {
    return null;
  }

  if ('data' in response) {
    const data = (response as any).data;
    
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as StrapiV5Product;
    }
    
    if (data && typeof data === 'object' && 'id' in data) {
      return data as StrapiV5Product;
    }
  }

  if (response && typeof response === 'object' && 'id' in response) {
    return response as StrapiV5Product;
  }

  return null;
};

const toSafeQuantity = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 100 ? parsed : 0;
};

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const calculations = await Promise.all(
      items.map(async (item: CartTotalItem) => {
        if (!item || (typeof item.id !== "string" && typeof item.id !== "number")) {
          return {
            id: item?.id || 'unknown',
            quantity: 0,
            unitPrice: 0,
            subtotal: 0,
            isValid: false,
            error: 'Invalid item ID'
          };
        }

        const quantity = toSafeQuantity(item.quantity);
        if (quantity === 0) {
          return {
            id: item.id,
            quantity: 0,
            unitPrice: 0,
            subtotal: 0,
            isValid: false,
            error: 'Invalid quantity'
          };
        }

        try {
          const res = await productApi.getProductById(String(item.id));
          const product = normalizeStrapiV5Product(res?.data ?? null);
          
          if (!product) {
            return {
              id: item.id,
              quantity,
              unitPrice: 0,
              subtotal: 0,
              isValid: false,
              error: 'Product not found'
            };
          }

          const unitPrice = parsePrice(product.price);
          const subtotal = unitPrice * quantity;

          return {
            id: item.id,
            quantity,
            unitPrice,
            subtotal,
            title: product.title,
            isValid: unitPrice > 0 && quantity > 0,
          };

        } catch (error) {
          console.error(`Erreur lors de la récupération du produit ${item.id} :`, error);
          return {
            id: item.id,
            quantity,
            unitPrice: 0,
            subtotal: 0,
            isValid: false,
            error: 'Fetch error'
          };
        }
      })
    );

    const validItems = calculations.filter(item => item.isValid);
    const total = validItems.reduce((sum, item) => sum + item.subtotal, 0);

    return NextResponse.json({ 
      total: Math.round(total * 100) / 100,
      items: calculations 
    });

  } catch (error) {
    console.error("Échec du calcul du total", error);
    return NextResponse.json(
      { error: "Failed to calculate total" },
      { status: 500 }
    );
  }
}