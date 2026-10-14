import { PriceTeaser } from "@/components/PricingBlock";
import { Container } from "@/components/ui";
import { SHOW } from "@/lib/content";

export function PriceBand() {
  if (!SHOW.tarif) return null;
  return (
    <section className="sem-price" aria-labelledby="sem-price-title">
      <Container>
        <div className="sem-price__head">
          <div>
            <p className="sem-price__kicker">Tarif de la promotion 1</p>
            <h2 id="sem-price-title" className="sem-price__title">
              Toutes les séances, un seul tarif.
            </h2>
          </div>
        </div>
        <PriceTeaser />
      </Container>
    </section>
  );
}
