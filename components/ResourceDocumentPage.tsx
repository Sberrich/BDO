import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { Container } from "@/components/ui";
import { IconTick } from "@/components/icons";
import { RESOURCE_COVERS, RESOURCES_MENU } from "@/lib/content";

type DocKind = "brochure" | "barometre" | "livreblanc";

const DOCS: Record<
  DocKind,
  {
    path: string;
    kicker: string;
    title: string;
    lead: string;
    metaTitle: string;
    metaDesc: string;
    formBg: "white" | "cream";
    prefix: string;
    cover: string;
    contents: string[];
    formTitle: string;
  }
> = {
  brochure: {
    path: "/ressources/brochure",
    kicker: "Brochure 2026",
    title: "La brochure du certificat",
    lead: "Le programme, les huit séminaires, le calendrier, le tarif et le processus d’admission.",
    metaTitle: "Brochure du certificat",
    metaDesc: "Recevoir la brochure CFO 4.0 — programme, calendrier, tarif et admissions.",
    formBg: "white",
    prefix: "b",
    cover: RESOURCE_COVERS.brochure,
    contents: [
      "Le programme et les huit séminaires",
      "Le calendrier de la promotion 1",
      "Le tarif et les conditions",
      "Le processus d’admission",
    ],
    formTitle: "Recevoir la brochure",
  },
  barometre: {
    path: "/ressources/barometre",
    kicker: "Enquête",
    title: "Le Baromètre BDO des DAF 2024",
    lead: "L’enquête annuelle de BDO Maroc. Édition 2024, 94 répondants.",
    metaTitle: "Baromètre BDO des DAF 2024",
    metaDesc: "Recevoir le Baromètre BDO des DAF 2024 — enquête auprès de 94 leaders financiers.",
    formBg: "cream",
    prefix: "a",
    cover: RESOURCE_COVERS.barometre,
    contents: [
      "L’enquête annuelle de BDO Maroc",
      "Édition 2024",
      "94 directeurs financiers et leaders financiers interrogés",
    ],
    formTitle: "Recevoir le baromètre",
  },
  livreblanc: {
    path: "/ressources/livre-blanc",
    kicker: "Publication",
    title: "La Fonction Financière Augmentée",
    lead: "Le livre blanc BDO × Maltem Africa sur la transformation de la fonction finance.",
    metaTitle: "La Fonction Financière Augmentée",
    metaDesc: "Recevoir le livre blanc BDO × Maltem Africa sur la fonction financière augmentée.",
    formBg: "white",
    prefix: "l",
    cover: RESOURCE_COVERS.livreblanc,
    contents: [
      "Un livre blanc BDO × Maltem Africa",
      "La transformation de la fonction finance",
      "L’émergence du CFO 4.0",
    ],
    formTitle: "Recevoir le livre blanc",
  },
};

export function resourceMetadata(kind: DocKind): Metadata {
  const d = DOCS[kind];
  return { title: d.metaTitle, description: d.metaDesc };
}

export function ResourceDocumentPage({ kind }: { kind: DocKind }) {
  const d = DOCS[kind];
  const others = RESOURCES_MENU.filter(
    (r) => r.href !== d.path && r.href !== "/insights" && r.cover,
  ).slice(0, 2);

  return (
    <>
      <section className="doc-hero" aria-labelledby="doc-title">
        <Container className="doc-hero__inner">
          <nav className="doc-hero__crumbs" aria-label="Fil d’Ariane">
            <Link href="/ressources">Ressources</Link>
            <span aria-hidden="true">/</span>
            <span>{d.title}</span>
          </nav>
          <div className="doc-hero__grid">
            <div className="doc-hero__copy">
              <p className="doc-hero__kicker">{d.kicker}</p>
              <h1 id="doc-title" className="doc-hero__title">
                {d.title}
              </h1>
              <p className="doc-hero__lead">{d.lead}</p>

              <div className="doc-hero__preview">
                <div className="doc-hero__cover">
                  <Image
                    src={d.cover}
                    alt={`Couverture — ${d.title}`}
                    width={440}
                    height={620}
                    priority
                    sizes="180px"
                  />
                </div>
                <div>
                  <p className="doc-hero__list-title">Ce que vous y trouverez</p>
                  <ul className="doc-hero__list">
                    {d.contents.map((x) => (
                      <li key={x}>
                        <span className="doc-hero__tick" aria-hidden="true">
                          <IconTick />
                        </span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <p className="doc-hero__format">
                    PDF envoyé par e-mail, téléchargeable immédiatement après l’envoi.
                  </p>
                </div>
              </div>
            </div>

            <div className="doc-form">
              <p className="doc-form__title">{d.formTitle}</p>
              <p className="doc-form__lead">Trois champs, et le document est à vous.</p>
              <LeadForm kind="document" document={kind} prefix={d.prefix} />
            </div>
          </div>
        </Container>
      </section>

      {others.length ? (
        <section className="doc-others" aria-labelledby="doc-others-title">
          <Container className="doc-others__inner">
            <div className="doc-others__head">
              <h2 id="doc-others-title" className="doc-others__title">
                Autres publications
              </h2>
              <Link href="/insights" className="doc-others__all">
                Voir les Insights <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="doc-others__grid">
              {others.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="doc-card">
                    <span className="doc-card__cover" aria-hidden>
                      {r.cover ? (
                        <Image src={r.cover} alt="" fill sizes="120px" className="object-cover object-top" />
                      ) : null}
                    </span>
                    <span className="doc-card__body">
                      <span className="doc-card__title">{r.label}</span>
                      <span className="doc-card__desc">{r.desc}</span>
                      <span className="doc-card__more">
                        Recevoir le document <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
