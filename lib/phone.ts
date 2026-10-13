/** Shared by the forms (browser) and /api/submit (server). */

export const PHONE_HINT = "Exemple : 06 12 34 56 78 ou +212 6 12 34 56 78";
export const PHONE_ERROR = `Numéro de téléphone invalide. ${PHONE_HINT}.`;

/** Characters a phone number may contain while typing: digits, a leading +, spaces, dots, dashes, brackets. */
export function sanitizePhone(raw: string) {
  const kept = raw.replace(/[^\d+\s().-]/g, "");
  const plus = kept.trimStart().startsWith("+");
  return (plus ? "+" : "") + kept.replace(/\+/g, "").replace(/^\s+/, "").slice(0, 25);
}

/**
 * Returns the number in a readable international format, or null when invalid.
 * Morocco: 0 + 9 digits, +212 / 00212 + 9 digits (first digit 5–8).
 * Other countries: + country code, 8 to 15 digits in total.
 */
export function normalizePhone(raw: string): string | null {
  const v = raw.trim();
  if (!v || /[^\d+\s().-]/.test(v) || v.indexOf("+") > 0) return null;
  let digits = v.replace(/\D/g, "");
  const intl = v.startsWith("+") || digits.startsWith("00");
  if (digits.startsWith("00")) digits = digits.slice(2);

  let local: string | null = null;
  if (!intl && /^0[5-8]\d{8}$/.test(digits)) local = digits.slice(1);
  else if (/^212[5-8]\d{8}$/.test(digits)) local = digits.slice(3);
  if (local) {
    return `+212 ${local[0]} ${local.slice(1, 3)} ${local.slice(3, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
  }
  if (intl && !digits.startsWith("212") && /^[1-9]\d{7,14}$/.test(digits)) return `+${digits}`;
  return null;
}
