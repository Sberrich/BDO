import Link from "next/link";
import { PricingBlock } from "@/components/PricingBlock";
import { Container } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";

export function PriceBand() {
  return (
    <section className="sem-price" aria-labelledby="sem-price-title">
      <Container>
        <div className="sem-price__head">
          <div>
            <p className="sem-price__kicker">Tarif de la promotion 1</p>
            <h2 id="sem-price-title" className="sem-price__title">
              Les huit séminaires, un seul tarif.
            </h2>
          </div>
          <Link href="/admissions#tarif" className="sem-price__link">
            Détail du tarif
            <IconArrowRight />
          </Link>
        </div>
        <PricingBlock showCovered={false} />
      </Container>
    </section>
  );
}
