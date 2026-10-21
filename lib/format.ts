/** Compact count for cards (views, etc.). */
export function formatViews(n: number) {
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1).replace(".0", "").replace(".", ",")} k`;
  return `${Math.round(n / 1000)} k`;
}
