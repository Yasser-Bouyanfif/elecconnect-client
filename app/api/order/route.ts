import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import orderApis from "@/app/strapi/orderApis";
import productApis from "@/app/strapi/productApis";

type CartItemPayload = {
  id?: string | number;
};

type RequestBody = {
  cart?: CartItemPayload[];
};

type OrderLineInput = {
  productDocumentId: string;
  quantity: number;
  unitPrice: number;
};

type ProductRecord = {
  documentId?: string;
  id?: string | number;
  price?: number | string;
  attributes?: {
    documentId?: string;
    price?: number | string;
  };
};

const SHIPPING_DETAILS = { carrier: "DHL", price: 9.99 } as const;

const toStringId = (value: string | number) => String(value);

async function buildOrderLines(
  items: Array<[string, { quantity: number }]>
): Promise<{ orderLines: OrderLineInput[]; subtotal: number }> {
  const orderLines: OrderLineInput[] = [];
  let subtotal = 0;
  const failedProductIds: string[] = [];

  for (const [id, { quantity }] of items) {
    try {
      const response = await productApis.getProductById(id);
      const productData = (response?.data?.data?.[0] ??
        response?.data?.data) as ProductRecord | undefined;

      const resolvedDocumentIdValue =
        productData?.documentId ??
        productData?.attributes?.documentId ??
        productData?.id;
      const resolvedDocumentId =
        typeof resolvedDocumentIdValue === "string"
          ? resolvedDocumentIdValue
          : typeof resolvedDocumentIdValue === "number"
          ? String(resolvedDocumentIdValue)
          : undefined;

      const unitPriceValue =
        productData?.price ?? productData?.attributes?.price ?? null;
      const unitPrice = Number(unitPriceValue);

      if (!resolvedDocumentId || !Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error("Invalid product payload");
      }

      subtotal += unitPrice * quantity;
      orderLines.push({
        productDocumentId: resolvedDocumentId,
        quantity,
        unitPrice,
      });
    } catch (error) {
      console.error(`Failed to fetch product ${id}`, error);
      failedProductIds.push(id);
    }
  }

  if (failedProductIds.length > 0 || orderLines.length !== items.length) {
    throw new Error(
      `Unable to resolve order lines for products: ${failedProductIds.join(", ")}`
    );
  }

  return { orderLines, subtotal };
}

export async function POST(request: Request) {
  try {
    const { userId: authenticatedUserId, sessionId } = auth();

    if (!authenticatedUserId || !sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as RequestBody | null;

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { cart }: RequestBody = body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const productMap = new Map<string, { quantity: number }>();

    let invalidCartItem = false;

    cart.forEach((item) => {
      if (!item || (typeof item.id !== "string" && typeof item.id !== "number")) {
        invalidCartItem = true;
        return;
      }

      const key = toStringId(item.id);
      const existing = productMap.get(key);
      const quantity = (existing?.quantity ?? 0) + 1;

      productMap.set(key, { quantity });
    });

    if (invalidCartItem) {
      return NextResponse.json(
        { error: "Invalid cart contents" },
        { status: 400 }
      );
    }

    if (productMap.size === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const entries = Array.from(productMap.entries());
    let orderLinesResult: { orderLines: OrderLineInput[]; subtotal: number };

    try {
      orderLinesResult = await buildOrderLines(entries);
    } catch (error) {
      console.error("Failed to prepare order lines", error);
      return NextResponse.json(
        { error: "Invalid cart contents" },
        { status: 400 }
      );
    }

    const { orderLines, subtotal } = orderLinesResult;

    const total = subtotal + SHIPPING_DETAILS.price;

    const user = await currentUser();
    const emailAddress =
      user?.primaryEmailAddress?.emailAddress ??
      user?.emailAddresses?.[0]?.emailAddress ??
      undefined;

    const orderResponse = await orderApis.createOrder({
      data: {
        orderNumber: randomUUID(),
        userId: authenticatedUserId,
        userEmail: emailAddress,
        address: {
          fullName: "Jean Dupont",
          company: "Ma Société",
          address1: "12 rue des Fleurs",
          address2: "Appartement 34",
          postalCode: 75001,
          city: "Paris",
          country: "France",
          phone: 33123456789,
        },
        shipping: SHIPPING_DETAILS,
        subtotal,
        total,
        orderStatus: "pending",
      },
    });

    const orderDocumentId =
      orderResponse?.data?.data?.documentId ??
      orderResponse?.data?.data?.id ??
      orderResponse?.data?.documentId ??
      orderResponse?.data?.id;

    if (!orderDocumentId) {
      console.error("Order created without documentId", orderResponse?.data);
      return NextResponse.json(
        { error: "Order creation failed" },
        { status: 500 }
      );
    }

    try {
      for (const { productDocumentId, quantity, unitPrice } of orderLines) {
        await orderApis.createOrderLine({
          data: {
            quantity,
            unitPrice,
            order: { connect: [orderDocumentId] },
            product: { connect: [productDocumentId] },
          },
        });
      }
    } catch (orderLineError) {
      console.error("Failed to create order lines", orderLineError);

      try {
        await orderApis.deleteOrder(orderDocumentId);
      } catch (deleteError) {
        console.error("Failed to rollback order", deleteError);
      }

      return NextResponse.json(
        { error: "Order creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, subtotal, total });
  } catch (error) {
    console.error("Failed to process order", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
