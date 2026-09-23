import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { ButtonLink, Container, PageHero, SectionHeading } from "@/components/ui";
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
      <PageHero kicker="Ressources" title={d.title} lead={d.lead} />
      <section className="bg-cream py-[clamp(2.5rem,6vw,4.5rem)]">
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="resource-doc__cover-wrap mx-auto w-full max-w-[220px] lg:mx-0">
            <div className="resource-doc__cover">
              <Image
                src={d.cover}
                alt={`Couverture — ${d.title}`}
                width={440}
                height={620}
                className="h-auto w-full"
                priority
                sizes="220px"
              />
            </div>
          </div>
          <div>
            <SectionHeading kicker={d.kicker} title={d.title} lead={d.lead} />
            <p className="mt-6 text-sm text-muted">
              Remplissez le formulaire pour recevoir le PDF par e-mail. Vous pourrez aussi le
              télécharger immédiatement après l’envoi.
            </p>
            <div className="mt-8">
              <Link href="/ressources" className="text-sm font-bold text-blue hover:text-blue-dark">
                ← Toutes les ressources
              </Link>
            </div>
          </div>
          <div
            className={`rounded-md p-6 sm:p-8 ${
              d.formBg === "white" ? "bg-white shadow-[var(--shadow-md)]" : "bg-white border border-line"
            }`}
          >
            <LeadForm kind="document" document={kind} prefix={d.prefix} />
          </div>
        </Container>
      </section>

      {others.length ? (
        <section className="border-t border-line bg-white py-[clamp(2rem,4vw,3rem)]">
          <Container>
            <h2 className="text-xl font-bold text-ink">Autres publications</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {others.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="resource-card resource-card--compact group">
                    <span className="resource-card__cover" aria-hidden>
                      {r.cover ? (
                        <Image
                          src={r.cover}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover object-top"
                        />
                      ) : null}
                    </span>
                    <span className="resource-card__body">
                      <span className="resource-card__title">{r.label}</span>
                      <span className="resource-card__desc">{r.desc}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/insights" variant="secondary">
                Voir les Insights
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
