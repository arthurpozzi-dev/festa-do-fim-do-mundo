import { z } from "zod";
import { formatPhone, isValidPhone } from "@/lib/phone";

/** Validação compartilhada entre o formulário (client) e a API (server). */
export const rsvpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escreva seu nome ou vulgo")
    .max(80, "Nome muito longo"),
  /** obrigatório; sai normalizado como (16) 99999-9999 */
  whatsapp: z
    .string("Escreva seu WhatsApp com DDD")
    .refine(isValidPhone, "WhatsApp inválido: escreva com DDD")
    .transform(formatPhone),
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
