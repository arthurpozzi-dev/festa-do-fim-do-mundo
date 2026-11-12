import { z } from "zod";

/** Validação compartilhada entre o formulário (client) e a API (server). */
export const rsvpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escreva seu nome ou vulgo")
    .max(80, "Nome muito longo"),
  email: z.string().trim().toLowerCase().max(160).pipe(z.email("E-mail inválido")),
  acceptedTerms: z.literal(true, "Você precisa aceitar os termos"),
  governmentLink: z.boolean().default(false),
  /** honeypot anti-spam: humanos deixam vazio */
  website: z.string().optional(),
});

export type RsvpInput = z.input<typeof rsvpSchema>;
export type RsvpFieldErrors = Partial<Record<keyof RsvpInput, string>>;

export function fieldErrors(error: z.ZodError): RsvpFieldErrors {
  const out: RsvpFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof RsvpInput;
    out[key] ??= issue.message;
  }
  return out;
}
