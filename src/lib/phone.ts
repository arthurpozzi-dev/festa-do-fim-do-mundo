/** Só os dígitos do telefone, sem o +55 do Brasil. */
export function phoneDigits(value: string) {
  let d = value.replace(/\D/g, "");
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  return d.slice(0, 11);
}

/** Formata enquanto a pessoa digita: (16) 99999-9999 ou (16) 3333-4444. */
export function formatPhone(value: string) {
  const d = phoneDigits(value);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  const split = rest.length === 9 ? 5 : 4; // celular tem 9 dígitos
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

/** DDD + número: 10 dígitos (fixo) ou 11 (celular). */
export function isValidPhone(value: string) {
  const d = phoneDigits(value);
  return d.length === 10 || d.length === 11;
}
