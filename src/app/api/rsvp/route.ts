// Dá folga para o Apps Script responder (ele pode demorar na primeira execução)
export const maxDuration = 30;

import { saveRsvpToSheet } from "@/lib/sheets";
import { fieldErrors, rsvpSchema } from "@/lib/rsvp-schema";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Dados inválidos", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const { name, whatsapp, website } = parsed.data;
  // Bot preencheu o honeypot: finge sucesso e não grava nada
  if (website) return Response.json({ ok: true });

  try {
    await saveRsvpToSheet({ name, whatsapp });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[rsvp] falha ao salvar na planilha", err);
    return Response.json(
      { error: "Não foi possível confirmar agora. Tente de novo." },
      { status: 502 },
    );
  }
}
