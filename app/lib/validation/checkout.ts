import { z } from "zod";

const MAX_LINE_ITEMS = 50;
const MAX_PRICE_IN_CENTS = 50000000; // 500 000 €

export const checkoutItemSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Le titre de l'article est obligatoire.")
      .max(150, "Le titre de l'article est trop long.")
      .optional(),
    price: z
      .coerce.number({
        invalid_type_error: "Le prix doit être un nombre valide.",
      })
      .min(0, "Le prix ne peut pas être négatif.")
      .max(MAX_PRICE_IN_CENTS / 100, "Le prix est trop élevé.")
      .default(0),
    quantity: z
      .coerce.number({
        invalid_type_error: "La quantité doit être un nombre entier.",
      })
      .int("La quantité doit être un nombre entier.")
      .min(1, "La quantité doit être d'au moins 1.")
      .max(99, "La quantité est trop élevée."),
  })
  .refine(
    (item) => Number.isFinite(item.price),
    "Le prix doit être un nombre valide."
  );

export const checkoutSessionSchema = z.object({
  items: z
    .array(checkoutItemSchema, {
      required_error: "La liste des articles est obligatoire.",
      invalid_type_error: "Les articles transmis sont invalides.",
    })
    .min(1, "La commande doit contenir au moins un article.")
    .max(MAX_LINE_ITEMS, "La commande contient trop d'articles."),
});

export type CheckoutSessionPayload = z.infer<typeof checkoutSessionSchema>;
