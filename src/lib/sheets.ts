import "server-only";

export type SheetRsvp = {
  name: string;
  email: string;
  whatsapp: string;
  acceptedTerms: boolean;
  governmentLink: boolean;
};

type ScriptResponse = { ok?: boolean; error?: string };

/**
 * Manda a confirmação para o Web App do Google Apps Script, que grava na planilha.
 *
 * O Apps Script responde ao POST com um 302 para script.googleusercontent.com, onde
 * fica o JSON de resposta. Na Vercel o `redirect: "follow"` do fetch trava nesse caso,
 * então seguimos o redirect na mão: POST (manual) e depois GET no Location.
 */
export async function saveRsvpToSheet(rsvp: SheetRsvp) {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) throw new Error("APPS_SCRIPT_URL/APPS_SCRIPT_SECRET não configurados");

  const started = Date.now();
  let res = await fetch(url, {
    method: "POST",
    // text/plain: o Apps Script lê o corpo cru em e.postData.contents
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...rsvp, secret }),
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  const location = res.headers.get("location");
  if (res.status >= 300 && res.status < 400 && location) {
    res = await fetch(location, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
  }

  const text = await res.text();
  let json: ScriptResponse | null = null;
  try {
    json = JSON.parse(text) as ScriptResponse;
  } catch {
    console.error("[sheets] resposta não-JSON:", res.status, text.slice(0, 300));
  }
  console.info(`[sheets] ${res.status} em ${Date.now() - started}ms`);

  if (!res.ok || !json?.ok) {
    throw new Error(`Apps Script: ${json?.error ?? `HTTP ${res.status}`}`);
  }
}
