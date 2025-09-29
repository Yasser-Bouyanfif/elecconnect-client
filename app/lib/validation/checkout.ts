import { z, type RefinementCtx } from "zod";

const MAX_LINE_ITEMS = 50;
const MAX_PRICE_IN_CENTS = 50000000; // 500 000 €

const ensureFiniteNumber = (message: string) =>
  z.coerce.number().superRefine((value: number, ctx: RefinementCtx) => {
    if (!Number.isFinite(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });

export const checkoutItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Le titre de l'article est obligatoire.")
    .max(150, "Le titre de l'article est trop long.")
    .optional(),
  price: ensureFiniteNumber("Le prix doit être un nombre valide.")
    .min(0, "Le prix ne peut pas être négatif.")
    .max(MAX_PRICE_IN_CENTS / 100, "Le prix est trop élevé.")
    .default(0),
  quantity: ensureFiniteNumber(
    "La quantité doit être un nombre entier."
  )
    .int("La quantité doit être un nombre entier.")
    .min(1, "La quantité doit être d'au moins 1.")
    .max(99, "La quantité est trop élevée."),
});

const ensureItemArray = z
  .any()
  .refine(Array.isArray, {
    message: "Les articles transmis sont invalides.",
  })
  .transform((value: unknown) => value as unknown[]);

export const checkoutSessionSchema = z.object({
  items: ensureItemArray
    .pipe(
      z
        .array(checkoutItemSchema, {
          required_error: "La liste des articles est obligatoire.",
        })
        .min(1, "La commande doit contenir au moins un article.")
        .max(MAX_LINE_ITEMS, "La commande contient trop d'articles."),
    )
    .transform(
      (items: unknown[]) => items as Array<z.infer<typeof checkoutItemSchema>>
    ),
});

export type CheckoutSessionPayload = z.infer<typeof checkoutSessionSchema>;
