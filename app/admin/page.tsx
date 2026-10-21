import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CMS_COOKIE, hasAdminSession } from "@/lib/cms-session";
import { FORM_TYPES, formTypeLabel, readableFields } from "@/lib/emails";
import { fullName } from "@/lib/names";
import { listSubmissions, type Submission } from "@/lib/submissions";

export const metadata: Metadata = {
  title: "Inscriptions et demandes",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ type?: string; q?: string }> };

const SUMMARY_KEY: Record<string, string[]> = {
  candidature: ["niveau", "participation"],
  rappel: ["entreprise", "moment"],
  session: ["entreprise", "creneau"],
  document: ["entreprise", "document"],
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function countSince(list: Submission[], type: string, days: number) {
  const since = Date.now() - days * 24 * 3600 * 1000;
  return list.filter((s) => s.type === type && Date.parse(s.createdAt) > since).length;
}

function matches(s: Submission, q: string) {
  if (!q) return true;
  const hay = Object.values(s.fields).join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w));
}

export default async function AdminPage({ searchParams }: Props) {
  const jar = await cookies();
  if (!(await hasAdminSession(jar.get(CMS_COOKIE)?.value))) redirect("/cms-login?next=/admin");

  const { type: rawType, q: rawQ } = await searchParams;
  const type = (FORM_TYPES as readonly string[]).includes(rawType ?? "") ? rawType! : "candidature";
  const q = (rawQ ?? "").trim().slice(0, 100);

  const all = await listSubmissions();
  const counts = Object.fromEntries(FORM_TYPES.map((t) => [t, all.filter((s) => s.type === t).length]));
  const rows = all.filter((s) => s.type === type && matches(s, q));
  const thisWeek = countSince(all, type, 7);

  return (
    <main className="adm">
      <header className="adm__top">
        <div className="adm__brand">
          <Image src="/images/logo-iscae.png" alt="Groupe ISCAE" width={110} height={92} />
          <span className="adm__sep" aria-hidden />
          <Image src="/images/logo-bdo.png" alt="BDO" width={66} height={24} />
          <span className="adm__app">CFO 4.0 · Administration</span>
        </div>
        <nav className="adm__links">
          <Link href="/keystatic">CMS</Link>
          <Link href="/">Voir le site</Link>
          <a href="/api/cms-logout">Déconnexion</a>
        </nav>
      </header>

      <section className="adm__body">
        <div className="adm__head">
          <div>
            <h1 className="adm__title">Inscriptions et demandes</h1>
            <p className="adm__lead">
              Tous les formulaires envoyés depuis le site. {thisWeek > 0 ? `${thisWeek} cette semaine.` : ""}
            </p>
          </div>
          <a className="adm__export" href={`/api/admin/export?type=${type}`}>
            Exporter en Excel (CSV)
          </a>
        </div>

        <nav className="adm__tabs" aria-label="Type de formulaire">
          {FORM_TYPES.map((t) => (
            <Link
              key={t}
              href={`/admin?type=${t}`}
              className={`adm__tab${t === type ? " is-active" : ""}`}
              aria-current={t === type ? "page" : undefined}
            >
              {formTypeLabel(t)}
              <span>{counts[t]}</span>
            </Link>
          ))}
        </nav>

        <form className="adm__search" action="/admin" method="get">
          <input type="hidden" name="type" value={type} />
          <input type="search" name="q" defaultValue={q} placeholder="Rechercher un nom, un e-mail, une entreprise…" />
          <button type="submit">Rechercher</button>
          {q ? <Link href={`/admin?type=${type}`}>Effacer</Link> : null}
        </form>

        {rows.length === 0 ? (
          <p className="adm__empty">
            {q ? "Aucun résultat pour cette recherche." : "Aucun formulaire reçu pour le moment."}
          </p>
        ) : (
          <ul className="adm__list">
            {rows.map((s) => {
              const fields = readableFields(s.type, s.fields).filter((f) => f.value);
              const by = Object.fromEntries(fields.map((f) => [f.key, f.value]));
              const summary = (SUMMARY_KEY[s.type] ?? []).map((k) => by[k]).filter(Boolean).join(" · ");
              return (
                <li key={s.id}>
                  <details className="adm__item">
                    <summary>
                      <span className="adm__date">{formatDate(s.createdAt)}</span>
                      <span className="adm__who">
                        <strong>{fullName(s.fields) || "Sans nom"}</strong>
                        <span>{by.email}</span>
                      </span>
                      <span className="adm__what">{summary}</span>
                      <span className="adm__phone">{by.telephone ?? ""}</span>
                      <span className="adm__files">
                        {s.files.length ? `${s.files.length} fichier${s.files.length > 1 ? "s" : ""}` : ""}
                      </span>
                    </summary>
                    <div className="adm__detail">
                      <dl>
                        {fields.map((f) => (
                          <div key={f.key}>
                            <dt>{f.label}</dt>
                            <dd>
                              {f.key === "email" ? (
                                <a href={`mailto:${f.value}`}>{f.value}</a>
                              ) : f.key === "telephone" ? (
                                <a href={`tel:${f.value.replace(/\s/g, "")}`}>{f.value}</a>
                              ) : (
                                f.value
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      {s.files.length ? (
                        <div className="adm__downloads">
                          {s.files.map((f) => (
                            <a
                              key={f.filename}
                              href={`/api/admin/files/${s.id}/${encodeURIComponent(f.filename)}`}
                              target="_blank"
                              rel="noopener"
                            >
                              {f.label} · {f.filename}
                            </a>
                          ))}
                        </div>
                      ) : null}
                      <p className="adm__ref">Référence {s.id}</p>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
