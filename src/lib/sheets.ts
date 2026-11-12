import "server-only";

export type SheetRsvp = {
  name: string;
  email: string;
  acceptedTerms: boolean;
  governmentLink: boolean;
};

/**
 * Manda a confirmação para o Web App do Google Apps Script, que grava na planilha.
 * O Apps Script responde 302 para outra URL do Google; o fetch segue o redirect sozinho.
 */
export async function saveRsvpToSheet(rsvp: SheetRsvp) {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) throw new Error("APPS_SCRIPT_URL/APPS_SCRIPT_SECRET não configurados");

  const res = await fetch(url, {
    method: "POST",
    // text/plain: o Apps Script lê o corpo cru em e.postData.contents
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...rsvp, secret }),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !json?.ok) {
    throw new Error(`Apps Script: ${json?.error ?? `HTTP ${res.status}`}`);
  }
}
