import { data } from "@/lib/content";
import { ButtonLink } from "@/components/ui";
import { IconTick } from "@/components/icons";
import { plain } from "@/lib/text";

type Props = {
  showCovered?: boolean;
  showCtas?: boolean;
};

export function PricingBlock({ showCovered = true, showCtas = false }: Props) {
  const t = data.site.tarif;
  const fees = t.fraisInscription;
  const formules = t.formules;

  return (
    <div className="pricing">
      <div className="pricing__grid">
        <article className="pricing__card is-fee">
          <span className="pricing__accent" aria-hidden="true" />
          <p className="pricing__kicker">{fees.label}</p>
          <p className="pricing__amount">
            {fees.montant}
            <span> {t.devisePhrase}</span>
          </p>
          <p className="pricing__hint">{fees.mention}</p>
        </article>

        {formules.map((f) => (
          <article
            key={f.id}
            className={`pricing__card ${f.id === "particulier" ? "is-featured" : ""}`}
          >
            <span className="pricing__accent" aria-hidden="true" />
            {f.id === "particulier" ? (
              <span className="pricing__badge">Recommandé</span>
            ) : null}
            <p className="pricing__kicker">{f.titre}</p>
            <p className="pricing__amount">
              {f.montant}
              <span> {t.devisePhrase}</span>
            </p>
            <p className="pricing__hint">{f.mention}</p>
          </article>
        ))}
      </div>

      <p className="pricing__mention">{t.mention}</p>

      {showCovered ? (
        <div className="pricing__cover">
          <div className="pricing__cover-head">
            <h3 className="pricing__cover-title">Ce que le tarif couvre</h3>
            <p className="pricing__cover-lead">Tout est inclus pour dérouler le cycle jusqu’au jury.</p>
          </div>
          <ul className="pricing__cover-list">
            {t.couvre.map((x) => (
              <li key={x}>
                <span className="pricing__tick" aria-hidden="true">
                  <IconTick />
                </span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
          {showCtas ? (
            <div className="pricing__ctas">
              <ButtonLink href="/candidater">Déposer ma candidature</ButtonLink>
              <ButtonLink href="/admissions#tarif" variant="ghost">
                Voir les admissions →
              </ButtonLink>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function PricingConditions() {
  const conditions = data.site.tarif.conditions;
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {conditions.map((cond, i) => (
        <article key={cond.titre} className="rounded-md border border-line bg-white p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">0{i + 1}</p>
          <h3 className="mt-2 text-lg font-bold">{cond.titre}</h3>
          <p className="mt-2 text-sm text-muted">{plain(cond.texte)}</p>
        </article>
      ))}
    </div>
  );
}
