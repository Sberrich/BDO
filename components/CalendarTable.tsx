import Link from "next/link";
import { CalendarRow, data } from "@/lib/content";
import { appHref, plain } from "@/lib/text";

export function CalendarTable() {
  const cal = data.calendrier;
  const rows = cal.seances as unknown as CalendarRow[];
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-[0.8125rem]">
        <caption className="sr-only">{cal.intitule}</caption>
        <thead>
          <tr className="bg-blue text-white">
            <th className="rounded-tl-md px-4 py-3 font-bold">Séance</th>
            <th className="px-4 py-3 font-bold">Dates</th>
            <th className="px-4 py-3 font-bold">Contenu</th>
            <th className="rounded-tr-md px-4 py-3 font-bold">Jours</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr
              key={s.seance + s.dates}
              className={s.pause ? "bg-white italic text-muted" : i % 2 === 1 ? "bg-cream" : "bg-white"}
            >
              <th scope="row" className="border-b border-line px-4 py-3 font-semibold text-ink">
                {s.seance}
              </th>
              <td className="whitespace-nowrap border-b border-line px-4 py-3">{s.dates}</td>
              <td className="border-b border-line px-4 py-3">
                {s.lien && !s.pause ? (
                  <Link href={appHref(s.lien)} className="font-medium text-blue hover:underline">
                    {s.contenu}
                  </Link>
                ) : (
                  s.contenu
                )}
              </td>
              <td className="border-b border-line px-4 py-3">{s.pause ? "—" : s.jours}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-3 text-xs text-muted">{plain(cal.note)}</p>
    </div>
  );
}
