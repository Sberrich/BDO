import Link from "next/link";
import { Container } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { data } from "@/lib/content";

export function PriceBand() {
  const tarif = data.site.tarif;
  return (
    <section className="sem-price" aria-labelledby="sem-price-title">
      <Container className="sem-price__inner">
        <div>
          <p className="sem-price__kicker">Tarif de la promotion 1</p>
          <h2 id="sem-price-title" className="sem-price__title">
            Les huit séminaires, un seul tarif.
          </h2>
        </div>
        <dl className="sem-price__list">
          {tarif.formules.map((f) => (
            <div key={f.id}>
              <dt>{f.titre}</dt>
              <dd>
                {f.montant} <span>{tarif.devisePhrase}</span>
              </dd>
            </div>
          ))}
          <div>
            <dt>{tarif.fraisInscription.label}</dt>
            <dd>
              {tarif.fraisInscription.montant} <span>{tarif.devisePhrase}</span>
            </dd>
          </div>
        </dl>
        <Link href="/admissions#tarif" className="sem-price__link">
          Détail du tarif
          <IconArrowRight />
        </Link>
      </Container>
    </section>
  );
}
