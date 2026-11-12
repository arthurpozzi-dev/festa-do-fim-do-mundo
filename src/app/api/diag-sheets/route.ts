// TEMPORÁRIO: diagnóstico da conexão Vercel -> Apps Script (usa senha errada, não grava nada)
export const maxDuration = 60;

async function timed(label: string, p: () => Promise<Response>) {
  const t = Date.now();
  try {
    const r = await p();
    const body = await r.text();
    return { label, ms: Date.now() - t, status: r.status, location: r.headers.get("location")?.slice(0, 80), body: body.slice(0, 120) };
  } catch (e) {
    return { label, ms: Date.now() - t, error: String(e) };
  }
}

export async function GET() {
  const url = process.env.APPS_SCRIPT_URL!;
  const body = JSON.stringify({ secret: "senha-errada-de-diagnostico" });
  const out = [];
  const hop1 = await timed("post-manual", () =>
    fetch(url, { method: "POST", headers: { "Content-Type": "text/plain" }, body, redirect: "manual", signal: AbortSignal.timeout(20000) }),
  );
  out.push(hop1);
  if (hop1.location) {
    const loc = (await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain" }, body, redirect: "manual", signal: AbortSignal.timeout(20000) }).catch(() => null))?.headers.get("location");
    if (loc) out.push(await timed("get-echo", () => fetch(loc, { signal: AbortSignal.timeout(20000) })));
  }
  out.push(await timed("google-home", () => fetch("https://www.google.com/generate_204", { signal: AbortSignal.timeout(10000) })));
  return Response.json(out);
}
