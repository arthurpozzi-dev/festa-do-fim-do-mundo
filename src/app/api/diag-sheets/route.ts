// TEMPORÁRIO: diagnóstico Vercel -> Apps Script (senha errada, não grava nada)
export const maxDuration = 60;

async function hop(label: string, init: RequestInit) {
  const t = Date.now();
  try {
    const r = await fetch(process.env.APPS_SCRIPT_URL!, { method: "POST", redirect: "manual", signal: AbortSignal.timeout(12000), ...init });
    return { label, ms: Date.now() - t, status: r.status };
  } catch (e) {
    return { label, ms: Date.now() - t, error: String(e).slice(0, 80) };
  }
}

export async function GET() {
  const body = JSON.stringify({ secret: "senha-errada", name: "x", email: "x@example.com", acceptedTerms: true, governmentLink: false });
  const real = JSON.stringify({ secret: process.env.APPS_SCRIPT_SECRET, name: "TESTE - pode apagar", email: "teste-claude@example.com", acceptedTerms: true, governmentLink: false });
  const sec = process.env.APPS_SCRIPT_SECRET ?? "";
  return Response.json([
    { secretLen: sec.length, secretStart: sec.slice(0, 2) },
    await hop("REAL", { headers: { "Content-Type": "text/plain" }, body: real }),
    await hop("plain", { headers: { "Content-Type": "text/plain" }, body }),
    await hop("charset", { headers: { "Content-Type": "text/plain;charset=utf-8" }, body }),
    await hop("no-store", { headers: { "Content-Type": "text/plain" }, body, cache: "no-store" }),
    await hop("charset+no-store", { headers: { "Content-Type": "text/plain;charset=utf-8" }, body, cache: "no-store" }),
  ]);
}
