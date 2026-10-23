import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { PubCard } from "@/components/PubCard";
import { ButtonLink, Container, KickerIcon } from "@/components/ui";
import { IconArrowRight, IconTick } from "@/components/icons";
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
    coverSize: [number, number];
    contents: string[];
    formTitle: string;
  }
> = {
  brochure: {
    path: "/ressources/brochure",
    kicker: "Brochure 2026",
    title: "La brochure du certificat",
    lead: "Le programme, les séminaires, le tarif et le processus d’admission.",
    metaTitle: "Brochure du certificat",
    metaDesc: "Recevoir la brochure CFO 4.0 : programme, séminaires, tarif et admissions.",
    formBg: "white",
    prefix: "b",
    cover: RESOURCE_COVERS.brochure,
    coverSize: [636, 900],
    contents: [
      "Le programme et les séminaires",
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
    metaDesc: "Recevoir le Baromètre BDO des DAF 2024, enquête auprès de 94 leaders financiers.",
    formBg: "cream",
    prefix: "a",
    cover: RESOURCE_COVERS.barometre,
    coverSize: [1011, 715],
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
    coverSize: [409, 571],
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
  const landscape = d.coverSize[0] > d.coverSize[1];
  const others = RESOURCES_MENU.filter(
    (r) => r.href !== d.path && r.href !== "/playlists" && r.cover,
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
              <h1 id="doc-title" className="sr-only">
                {d.title}
              </h1>

              <div className={`doc-hero__preview ${landscape ? "is-landscape" : ""}`}>
                <div className="doc-book">
                  <span className="doc-book__glow" aria-hidden />
                  <div className="doc-book__page">
                    <Image
                      src={d.cover}
                      alt={`Couverture : ${d.title}`}
                      width={d.coverSize[0]}
                      height={d.coverSize[1]}
                      priority
                      sizes={landscape ? "(min-width: 1024px) 22rem, 70vw" : "(min-width: 1024px) 15rem, 45vw"}
                    />
                  </div>
                  <span className="doc-book__tag">PDF · {d.kicker}</span>
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
                  <p className="doc-hero__lead doc-hero__desc">{d.lead}</p>
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
              <p className="doc-others__kicker"><KickerIcon label="Publications" />Pour aller plus loin</p>
              <h2 id="doc-others-title" className="doc-others__title">
                Autres publications
              </h2>
            </div>
            <ul className="doc-others__grid">
              {others.map((r) => (
                <li key={r.href}>
                  <PubCard
                    href={r.href}
                    title={r.label}
                    text={r.desc}
                    action="Recevoir le document"
                    cover={r.cover}
                    landscape={r.icon === "barometre"}
                  />
                </li>
              ))}
            </ul>
            <div className="doc-others__foot">
              <ButtonLink href="/ressources" variant="ghost" className="doc-others__all">
                Toutes les ressources
                <IconArrowRight />
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
