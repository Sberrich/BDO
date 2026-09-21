import Image from "next/image";
import Link from "next/link";
import { data } from "@/lib/content";
import { CalendarTable } from "@/components/CalendarTable";
import { LeadForm } from "@/components/LeadForm";
import { ProgrammeGrid } from "@/components/ProgrammeGrid";
import { VideoBlock } from "@/components/VideoBlock";
import { CountUp, Reveal } from "@/components/motion";
import { ButtonLink, Container, Kicker, SectionHeading } from "@/components/ui";
import { IconCert, IconChart, IconGauge, IconJury, IconMap } from "@/components/icons";
import { appHref, personPhoto, plain } from "@/lib/text";

export function HomeSections() {
  const site = data.site;
  const c = site.constat;
  const haut = c.chiffres[0];
  const bas = c.chiffres[1];
  const extras = c.chiffres.slice(2);
  const speakers = data.intervenants.intervenants.slice(0, 4);

  return (
    <>
      <section id="constat" className="constat" aria-labelledby="constat-title">
        <Container className="constat__inner">
          <div className="constat-top">
            <header className="constat-head">
              <p className="constat-head__index">01 — Le constat</p>
              <h2 id="constat-title" className="constat-head__title">
                {(() => {
                  const parts = c.titre.split(/(?<=\.)\s+/);
                  if (parts.length < 2) return c.titre;
                  return (
                    <>
                      {parts[0]}{" "}
                      <em>{parts.slice(1).join(" ")}</em>
                    </>
                  );
                })()}
              </h2>
            </header>
            <p className="constat-top__lead">{c.chapeau}</p>
          </div>

          <div className="constat-stage" role="group" aria-label="L’écart entre intention et feuille de route">
            <p className="constat-stage__watermark" aria-hidden="true">
              écart
            </p>

            <Reveal className="constat-stage__col is-high" delay={40}>
              <p className="constat-stage__kicker">Intention</p>
              <p className="constat-stage__value">
                <CountUp value={haut.valeur} suffix="%" />
              </p>
              <div
                className="constat-stage__bar"
                style={{ ["--pct" as string]: `${haut.valeur}%` }}
                aria-hidden="true"
              />
              <p className="constat-stage__label">{haut.libelle}</p>
            </Reveal>

            <div className="constat-stage__delta" aria-hidden="true">
              <span className="constat-stage__delta-line" />
              <span className="constat-stage__delta-pill">
                −{haut.valeur - bas.valeur}&nbsp;pts
              </span>
              <span className="constat-stage__delta-line" />
              <span className="constat-stage__mais">mais</span>
            </div>

            <Reveal className="constat-stage__col is-low" delay={120}>
              <p className="constat-stage__kicker">Feuille de route</p>
              <p className="constat-stage__value">
                <CountUp value={bas.valeur} suffix="%" />
              </p>
              <div
                className="constat-stage__bar"
                style={{ ["--pct" as string]: `${bas.valeur}%` }}
                aria-hidden="true"
              />
              <p className="constat-stage__label">{bas.libelle}</p>
            </Reveal>
          </div>

          <div className="constat-signals">
            <p className="constat-signals__title">Deux signaux supplémentaires</p>
            <ul className="constat-signals__list">
              {extras.map((x, i) => (
                <Reveal as="li" key={x.libelle} delay={90 + i * 80} className="constat-signal">
                  <span
                    className="constat-signal__ring"
                    style={{ ["--pct" as string]: String(x.valeur) }}
                    aria-hidden="true"
                  >
                    <span className="constat-signal__ring-num">
                      <CountUp value={x.valeur} />
                    </span>
                  </span>
                  <span className="constat-signal__body">
                    <span className="constat-signal__icon" aria-hidden="true">
                      {i === 0 ? <IconGauge /> : <IconChart />}
                    </span>
                    <span className="constat-signal__text">{x.libelle}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal className="constat-resolve" delay={140}>
            <div className="constat-resolve__copy">
              <p className="constat-resolve__eyebrow">Pourquoi ce certificat</p>
              <p className="constat-resolve__text">{c.conclusion}</p>
            </div>
            <Link href="/candidater" className="constat-resolve__cta">
              Combler l&apos;écart
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <p className="constat-source">{c.source}</p>
        </Container>
      </section>


      <section id="livrable" className="carry" aria-labelledby="livrable-title">
        <Container className="carry__inner">
          <header className="carry__head">
            <p className="carry__index">02 — Le livrable</p>
            <h2 id="livrable-title" className="carry__title">
              {site.livrable.titre}
            </h2>
            <p className="carry__lead">
              Trois acquis concrets. Un seul fil : votre entreprise.
            </p>
          </header>

          <ol className="carry__stages">
            {site.livrable.items.map((it, i) => (
              <Reveal as="li" key={it.titre} delay={i * 100} className={`carry__stage is-${i + 1}`}>
                <span className="carry__stage-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <span className="carry__stage-icon" aria-hidden="true">
                  {i === 0 ? <IconMap /> : i === 1 ? <IconJury /> : <IconCert />}
                </span>
                <div className="carry__stage-body">
                  <h3 className="carry__stage-title">{it.titre}</h3>
                  <p className="carry__stage-text">{it.texte}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section id="programme" className="prog" aria-labelledby="programme-title">
        <Container className="prog__inner">
          <div className="prog__top">
            <header>
              <p className="prog__index">03 — Le programme</p>
              <h2 id="programme-title" className="prog__title">
                Huit séminaires.
                <br />
                <em>Une feuille de route.</em>
              </h2>
            </header>
            <div className="prog__aside">
              <p>
                Chaque week-end produit une pièce de votre transformation. La conférence inaugurale
                ouvre le cycle ; le jury le clôture.
              </p>
              <Link href="/programme" className="prog__cta">
                Programme complet <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <ProgrammeGrid />
        </Container>
      </section>

      <section id="profil" className="who" aria-labelledby="profil-title">
        <Container className="who__inner">
          <header className="who__head">
            <p className="who__index">04 — Le profil</p>
            <h2 id="profil-title" className="who__title">
              {site.profil.titre}
            </h2>
            <p className="who__lead">{site.profil.chapeau}</p>
          </header>
          <ul className="who__panels">
            {site.profil.profils.map((p, i) => (
              <Reveal as="li" key={p.titre} delay={i * 90} className={`who__panel is-${i + 1}`}>
                <span className="who__panel-num" aria-hidden="true">
                  0{i + 1}
                </span>
                <h3 className="who__panel-title">{p.titre}</h3>
                <p className="who__panel-text">{p.texte}</p>
              </Reveal>
            ))}
          </ul>
          <p className="who__prereq">
            <span>Prérequis</span>
            {site.profil.prerequis}
          </p>
        </Container>
      </section>

      <section id="intervenants" className="faculty" aria-labelledby="intervenants-title">
        <Container className="faculty__inner">
          <header className="faculty__head">
            <div>
              <p className="faculty__index">05 — Les intervenants</p>
              <h2 id="intervenants-title" className="faculty__title">
                La chaire vivante du certificat
              </h2>
            </div>
            <p className="faculty__lead">{data.intervenants.chapeau}</p>
          </header>
          <ul className="faculty__mosaic">
            {speakers.map((p, i) => (
              <Reveal
                as="li"
                key={p.slug}
                delay={i * 70}
                id={p.slug}
                className={`faculty__card ${i === 0 ? "is-lead" : ""}`}
              >
                <div className="faculty__photo">
                  <Image
                    src={personPhoto(p.photo, p.slug)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={i === 0 ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 50vw, 25vw"}
                  />
                  <div className="faculty__caption">
                    <p className="faculty__name">{plain(p.nom)}</p>
                    <p className="faculty__role">
                      {plain(p.fonction)} · {plain(p.institution)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
          <Link href="/intervenants" className="faculty__link">
            Tous les intervenants <span aria-hidden="true">→</span>
          </Link>
        </Container>
      </section>

      <section id="temoignages" className="voices" aria-labelledby="temoignages-title">
        <Container className="voices__inner">
          <header className="voices__head">
            <p className="voices__index">06 — Les témoignages</p>
            <h2 id="temoignages-title" className="voices__title">
              Ce que les anciens en ont fait
            </h2>
          </header>
          {site.temoignages[0] ? (
            <Reveal className="voices__featured" delay={40}>
              <blockquote className="voices__quote">
                « {plain(site.temoignages[0].citation)} »
              </blockquote>
              <div className="voices__meta">
                <Image
                  src={personPhoto(
                    site.temoignages[0].photo,
                    site.temoignages[0].nom.toLowerCase().includes("saad") ? "saad-belfakir" : undefined,
                  )}
                  alt=""
                  width={56}
                  height={56}
                  className="voices__avatar"
                />
                <div>
                  <strong>{plain(site.temoignages[0].nom)}</strong>
                  <p>
                    {plain(site.temoignages[0].fonction)} · {plain(site.temoignages[0].entreprise)}
                  </p>
                  <p className="voices__projet">
                    <span>Projet</span> {plain(site.temoignages[0].projet)}
                  </p>
                </div>
              </div>
            </Reveal>
          ) : null}
          <div className="voices__rest">
            {site.temoignages.slice(1).map((t, i) => (
              <Reveal as="figure" key={t.nom} delay={100 + i * 80} className="voices__card">
                <blockquote>« {plain(t.citation)} »</blockquote>
                <figcaption>
                  <strong>{plain(t.nom)}</strong>
                  <span>
                    {plain(t.fonction)} · {plain(t.entreprise)}
                  </span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>



      <section id="medias" className="bg-cream py-12">
        <Container>
          <Kicker>Ils en ont parlé</Kicker>
          <div className="logo-marquee mt-6">
            <ul className="logo-marquee__track">
              {[...site.medias, ...site.medias].map((m, i) => (
                <li
                  key={`${m.nom}-${i}`}
                  className="flex h-[72px] min-w-[160px] items-center justify-center rounded-md border border-line bg-white px-6 text-sm font-semibold text-muted grayscale opacity-75 transition hover:grayscale-0 hover:opacity-100 hover:text-ink"
                >
                  {plain(m.nom)}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section id="calendrier" className="bg-cream py-16 md:py-[4.5rem]">
        <Container>
          <SectionHeading index="07" kicker="Calendrier et tarif" title={data.calendrier.intitule} lead={data.calendrier.chapeau} />
          <div className="mt-8">
            <CalendarTable />
          </div>
          <div className="mt-10 overflow-hidden rounded-md border border-line bg-white md:grid md:grid-cols-[minmax(240px,300px)_1fr]">
            <div className="bg-cream p-8 text-center md:flex md:flex-col md:justify-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Tarif</p>
              <p className="mt-2 text-5xl font-bold leading-none tracking-[-0.03em] text-ink">{site.tarif.montant}</p>
              <p className="mt-2 font-semibold text-muted">{site.tarif.devisePhrase}</p>
              <p className="mt-2 text-sm text-muted">{site.tarif.mention}</p>
            </div>
            <div className="p-8">
              <h3 className="text-lg font-bold">Ce que le tarif couvre</h3>
              <ul className="mt-4 space-y-2 text-muted">
                {site.tarif.couvre.map((x) => (
                  <li key={x} className="tick flex gap-3">
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/candidater">Déposer ma candidature</ButtonLink>
                <ButtonLink href="/admissions" variant="ghost">
                  Voir les admissions en détail →
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="home-band relative overflow-hidden bg-navy py-16 text-white md:py-[4.5rem]">
        <div className="home-band__glow" aria-hidden />
        <Container className="relative grid items-end gap-8 md:grid-cols-[1.2fr_auto]">
          <div>
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-gold">Candidater</p>
            <h2 className="mt-3 max-w-[20ch] text-[clamp(1.75rem,1.45rem+1.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
              Prêt à rejoindre la promotion 1 ?
            </h2>
            <p className="mt-3 max-w-xl text-white/75">
              Commencez votre candidature en quelques minutes. Réponse sous 48&nbsp;h.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <ButtonLink href="/candidater" className="px-5 py-3">
              Postuler maintenant
            </ButtonLink>
            <ButtonLink
              href="/admissions#rappel"
              variant="ghost"
              className="border-white/35 bg-transparent px-5 py-3 text-white hover:border-white hover:bg-white hover:text-navy"
            >
              Nous contacter
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section id="session-information" className="bg-white py-16 md:py-[4.5rem]">
        <Container className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <SectionHeading kicker="Session d’information" title={site.sessionInfo.titre} lead={site.sessionInfo.texte} />
            <ul className="mt-4 space-y-2 text-muted">
              {site.sessionInfo.creneaux.map((slot) => (
                <li key={slot.id} className="tick flex gap-3">
                  {plain(slot.libelle)}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">{plain(site.sessionInfo.replay)}</p>
          </div>
          <div className="rounded-md bg-cream p-6 sm:p-8">
            <LeadForm kind="session" prefix="s" submitVariant="secondary" />
          </div>
        </Container>
      </section>

      <section id="video" className="bg-cream py-16 md:py-[4.5rem]">
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionHeading kicker="En vidéo" title={site.video.titre} lead={site.video.texte} />
            <p className="mt-2 text-sm text-muted">Durée : {site.video.duree}.</p>
          </div>
          <VideoBlock />
        </Container>
      </section>

      <section id="dispositif" className="bg-white py-16 md:py-[4.5rem]">
        <Container>
          <SectionHeading kicker="Le dispositif BDO" title={site.dispositif.titre} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {site.dispositif.items.map((it) => (
              <Link
                key={it.titre}
                href={appHref(it.lien)}
                className="card-lift group flex flex-col rounded-md border border-line p-7"
              >
                <h3 className="text-lg font-bold">{it.titre}</h3>
                <p className="mt-3 flex-1 text-muted">{it.texte}</p>
                <span className="card-more mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue">
                  {it.action}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section id="partenaires" className="bg-cream py-12">
        <Container>
          <Kicker>Avec le concours de</Kicker>
          <div className="logo-marquee mt-6">
            <ul className="logo-marquee__track" style={{ animationDuration: "46s" }}>
              {[...site.partenaires, ...site.partenaires].map((p, i) => (
                <li
                  key={`${p.nom}-${i}`}
                  className="flex h-[72px] min-w-[160px] items-center justify-center rounded-md border border-line bg-white px-6 text-center text-sm font-semibold text-muted grayscale opacity-75 transition hover:grayscale-0 hover:opacity-100 hover:text-ink"
                >
                  {plain(p.nom)}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
