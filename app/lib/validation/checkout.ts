import { z } from "zod";

const MAX_LINE_ITEMS = 50;
const ensureFiniteNumber = (message: string) =>
  z.coerce.number().superRefine((value, ctx) => {
    if (!Number.isFinite(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }
  });

const productIdentifierSchema = z.union([
  z
    .string()
    .trim()
    .min(1, "L'identifiant de produit est obligatoire."),
  z
    .number()
    .int("L'identifiant de produit doit être un entier.")
    .min(1, "L'identifiant de produit est invalide."),
]);

export const checkoutItemSchema = z.object({
  id: productIdentifierSchema,
  quantity: ensureFiniteNumber("La quantité doit être un nombre entier.")
    .int("La quantité doit être un nombre entier.")
    .min(1, "La quantité doit être d'au moins 1.")
    .max(99, "La quantité est trop élevée."),
});

// Si "items" est manquant, on renvoie un message clair
const ensureItemArray = z.any()
  .refine((v) => v !== undefined, { message: "La liste des articles est obligatoire." })
  .refine(Array.isArray, { message: "Les articles transmis sont invalides." })
  .transform((value) => value as unknown[]);

export const checkoutSessionSchema = z.object({
  items: ensureItemArray.pipe(
    z.array(checkoutItemSchema)
      .min(1, "La commande doit contenir au moins un article.")
      .max(MAX_LINE_ITEMS, "La commande contient trop d'articles.")
  ),
  shippingMethod: z
    .enum(["standard", "express"], {
      errorMap: () => ({
        message: "Le mode de livraison sélectionné est invalide.",
      }),
    })
    .optional(),
});

export type CheckoutSessionPayload = z.infer<typeof checkoutSessionSchema>;
