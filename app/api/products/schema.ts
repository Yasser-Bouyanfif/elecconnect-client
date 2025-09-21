import { z } from "@/lib/zod";

const productAttributesSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  price: z.number(),
  description: z.string(),
  weight: z.number(),
  banner: z.object({
    url: z.string(),
  }),
});

const productSchema = z.object({
  id: z.number(),
  attributes: productAttributesSchema,
});

export const productsSchema = z.array(productSchema);

export type Product = {
  id: number;
  title: string;
  slug?: string;
  price: number;
  description: string;
  weight: number;
  bannerUrl: string;
};
