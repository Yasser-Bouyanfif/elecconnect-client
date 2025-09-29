import { z } from "zod";

export const contactFormServerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Le nom complet doit contenir au moins 2 caractères.")
    .max(100, "Le nom complet est trop long."),
  phone: z
    .string()
    .optional()
    .transform((value) => (value ?? "").trim())
    .refine(
      (value) =>
        value.length === 0 || /^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/.test(value),
      "Le numéro de téléphone doit être un numéro français valide."
    )
    .refine((value) => value.length <= 30, "Le numéro de téléphone est trop long."),
  email: z
    .string()
    .trim()
    .min(1, "L'adresse e-mail est obligatoire.")
    .email("Adresse e-mail invalide.")
    .max(320, "L'adresse e-mail est trop longue."),
  content: z
    .string()
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères.")
    .max(2000, "Le message est trop long."),
});

export type ContactFormServerPayload = z.infer<typeof contactFormServerSchema>;
