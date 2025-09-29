import { z } from "zod";

export const promotionCodeSchema = z
  .string()
  .trim()
  .min(1, {
    message: "Veuillez entrer un code promotionnel.",
  })
  .max(32, {
    message: "Le code promotionnel ne peut pas dépasser 32 caractères.",
  })
  .regex(/^[A-Za-z0-9_-]+$/, {
    message: "Le code promotionnel contient des caractères invalides.",
  });

export const promotionRequestSchema = z.object({
  code: promotionCodeSchema,
});

export type PromotionRequest = z.infer<typeof promotionRequestSchema>;
