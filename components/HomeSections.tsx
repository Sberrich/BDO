import Image from "next/image";
import Link from "next/link";
import { allSessions, data, RESOURCE_COVERS, SHOW, sessionHref } from "@/lib/content";
import type { Intervenant } from "@/lib/cms";
import { CalendarTable } from "@/components/CalendarTable";
import { LeadForm } from "@/components/LeadForm";
import { MediaPressStrip } from "@/components/MediaPressStrip";
import { PriceTeaser } from "@/components/PricingBlock";
import { FacultyShowcase } from "@/components/FacultyShowcase";
import { PubCard } from "@/components/PubCard";
import { VideoBlock } from "@/components/VideoBlock";
import type { Playlist } from "@/lib/playlists";
import { Playlists } from "@/components/Playlists";
import { DeadlineCountdown } from "@/components/DeadlineCountdown";
import { CountUp, Reveal } from "@/components/motion";
import { ButtonLink, Container, Kicker, KickerIcon, SectionHeading } from "@/components/ui";
import { IconArrowRight, IconBook, IconChart, IconGauge, IconUsers } from "@/components/icons";
import { appHref, plain, seminarImage, sessionCode } from "@/lib/text";

const PROFILE_ICONS = [IconUsers, IconChart, IconGauge, IconBook];

const CARRY_ART = [
  "/images/livrables/feuille-de-route.png",
  "/images/livrables/dossier-investissement.png",
  "/images/livrables/certificat.png",
];

const TROPHEE_LOGO = { src: "/images/logos/trophee-bdo-digital-cfos.png", width: 155, height: 61 };

type Props = {
  speakers: Intervenant[];
  speakersLead?: string;
  playlists: Playlist[];
};

export function HomeSections({ speakers, speakersLead, playlists }: Props) {
  const site = data.site;
  const c = site.constat;
  const haut = c.chiffres[0];
  const bas = c.chiffres[1];
  const extras = c.chiffres.slice(2);
  const sessions = allSessions();
  const sessionCount = sessions.length;
  const featured = sessions.filter((s) => s.numero > 0).slice(0, 3);

  return (
    <>
      <section id="constat" className="constat" aria-labelledby="constat-title">
        <Container className="constat__inner">
          <div className="constat-top">
            <header className="constat-head">
              <p className="constat-head__index"><KickerIcon label="Le constat" />01 · Le constat</p>
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

          <Reveal className="gap-chart" delay={40}>
            <div
              className="gap-chart__rows"
              role="group"
              aria-label="L’écart entre intention et feuille de route"
            >
              <div className="gap-chart__row is-high">
                <p className="gap-chart__value">
                  <CountUp value={haut.valeur} suffix="%" />
                </p>
                <div className="gap-chart__meta">
                  <p className="gap-chart__kicker">Intention</p>
                  <p className="gap-chart__label">{haut.libelle}</p>
                </div>
                <div className="gap-chart__track" aria-hidden="true">
                  <span
                    className="gap-chart__fill"
                    style={{ ["--pct" as string]: `${haut.valeur}%` }}
                  />
                </div>
              </div>

              <div className="gap-chart__row is-low">
                <p className="gap-chart__value">
                  <CountUp value={bas.valeur} suffix="%" />
                </p>
                <div className="gap-chart__meta">
                  <p className="gap-chart__kicker">Feuille de route</p>
                  <p className="gap-chart__label">{bas.libelle}</p>
                </div>
                <div className="gap-chart__track" aria-hidden="true">
                  <span
                    className="gap-chart__fill"
                    style={{ ["--pct" as string]: `${bas.valeur}%` }}
                  />
                  <span
                    className="gap-chart__gap"
                    style={{
                      ["--from" as string]: `${bas.valeur}%`,
                      ["--to" as string]: `${haut.valeur}%`,
                    }}
                  >
                    <span className="gap-chart__gap-tag">
                      −{haut.valeur - bas.valeur}&nbsp;pts
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <p className="gap-chart__caption">
              <span className="gap-chart__swatch" aria-hidden="true" />
              L’écart à combler&nbsp;: {haut.valeur - bas.valeur}&nbsp;points entre
              l’intention et la feuille de route.
            </p>
          </Reveal>

          <div className="constat-bottom">
            {extras.map((x, i) => (
              <Reveal key={x.libelle} delay={90 + i * 80} className="constat-signal">
                <p className="constat-signal__kicker">
                  {i === 0 ? "Pilotage prédictif" : "Indicateurs"}
                </p>
                <p className="constat-signal__value">
                  <CountUp value={x.valeur} suffix="%" />
                </p>
                <p className="constat-signal__text">{x.libelle}</p>
              </Reveal>
            ))}

            <Reveal className="constat-resolve" delay={200}>
              <p className="constat-resolve__eyebrow"><KickerIcon label="Pourquoi ce certificat" />Pourquoi ce certificat</p>
              <p className="constat-resolve__text">{c.conclusion}</p>
              <Link href="/candidater" className="constat-resolve__cta">
                Combler l’écart
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          <p className="constat-source">{c.source}</p>
        </Container>
      </section>


      <section id="livrable" className="carry" aria-labelledby="livrable-title">
        <Container className="carry__inner">
          <header className="carry__head">
            <div>
              <p className="carry__index"><KickerIcon label="Le livrable" />02 · Le livrable</p>
              <h2 id="livrable-title" className="carry__title">
                {site.livrable.titre}
              </h2>
            </div>
            <p className="carry__lead">
              Trois acquis concrets. Un seul fil&nbsp;: votre entreprise.
            </p>
          </header>

          <ol className="carry__stages">
            {site.livrable.items.map((it, i) => {
              const tags = ["Feuille de route", "Dossier d’investissement", "Certificat"];
              return (
                <Reveal as="li" key={it.titre} delay={i * 100} className="carry__stage">
                  <div className={`carry__art is-img is-${i + 1}`} aria-hidden="true">
                    <Image
                      src={CARRY_ART[i]}
                      alt=""
                      width={444}
                      height={230}
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                    />
                  </div>
                  <p className="carry__stage-tag">
                    <span>0{i + 1}</span>
                    {tags[i]}
                  </p>
                  <h3 className="carry__stage-title">{it.titre}</h3>
                  <p className="carry__stage-text">{it.texte}</p>
                </Reveal>
              );
            })}
          </ol>
        </Container>
      </section>

      <section id="programme" className="prog" aria-labelledby="programme-title">
        <Container className="prog__inner">
          <div className="prog__top">
            <header>
              <p className="prog__index"><KickerIcon label="Le programme" />03 · Le programme</p>
              <h2 id="programme-title" className="prog__title">
                Neuf séances. <em>Une feuille de route.</em>
              </h2>
            </header>
            <div className="prog__aside">
              <p>
                Chaque séance produit une pièce de votre transformation, jusqu’à la
                soutenance des projets.
              </p>
            </div>
          </div>
          <ol className="prog-pieces__grid prog-pieces__grid--home">
            {featured.map((s) => (
              <li key={s.numero}>
                <Link href={sessionHref(s)} className="prog-piece">
                  <span className="prog-piece__media" aria-hidden="true">
                    <Image src={seminarImage(s.numero)} alt="" fill sizes="(min-width: 900px) 22rem, (min-width: 640px) 45vw, 90vw" />
                  </span>
                  <span className="prog-piece__row">
                    <span className="prog-piece__num">{sessionCode(s)}</span>
                    <span className="prog-piece__date">{plain(s.dates)}</span>
                  </span>
                  <span className="prog-piece__title">{plain(s.titre)}</span>
                  {s.livrable ? <span className="prog-piece__out">{plain(s.livrable)}</span> : null}
                  <span className="prog-piece__more">
                    Voir la séance <IconArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="prog__all">
            <ButtonLink href="/programme" variant="secondary">
              Voir tout le programme ({sessionCount} séances)
              <IconArrowRight />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section id="profil" className="who" aria-labelledby="profil-title">
        <Container className="who__inner">
          <header className="who__head">
            <div>
              <p className="who__index"><KickerIcon label="Le profil" />04 · Le profil</p>
              <h2 id="profil-title" className="who__title">
                {site.profil.titre}
              </h2>
            </div>
            <p className="who__lead">{site.profil.chapeau}</p>
          </header>
          <ul className="who__panels">
            {site.profil.profils.map((p, i) => {
              const Icon = PROFILE_ICONS[i % PROFILE_ICONS.length];
              return (
                <Reveal as="li" key={p.titre} delay={i * 90} className={`who__panel is-${i + 1}`}>
                  <span className="who__panel-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="who__panel-rule" aria-hidden="true" />
                  <h3 className="who__panel-title">{p.titre}</h3>
                  <p className="who__panel-text">{p.texte}</p>
                </Reveal>
              );
            })}
          </ul>
          <p className="who__prereq">
            <span className="who__prereq-tag">Prérequis</span>
            <span>{site.profil.prerequis}</span>
          </p>
        </Container>
      </section>

      <FacultyShowcase speakers={speakers} lead={speakersLead} />

      <section id="playlists" className="voices" aria-labelledby="playlists-title">
        <Container className="voices__inner">
          <header className="voices__head">
            <p className="voices__index"><KickerIcon label="Playlists" />06 · Playlists</p>
            <h2 id="playlists-title" className="voices__title">
              Ils racontent le certificat
            </h2>
            <p className="voices__lead">
              Participants, direction de l’ISCAE, BDO Maroc et intervenants, en vidéo.
            </p>
          </header>

          <Playlists playlists={playlists} />
        </Container>
      </section>



      <section id="medias" className="press-band" aria-labelledby="medias-title">
        <Container className="press-band__inner">
          <MediaPressStrip items={site.medias}>
            <p className="press-band__kicker">
              <KickerIcon label="Revue de presse" />
              Revue de presse
            </p>
            <h2 id="medias-title" className="press-band__title">
              Ils en ont parlé
            </h2>
            <p className="press-band__lead">
              {site.medias.length} médias marocains ont couvert le lancement du certificat.
            </p>
          </MediaPressStrip>
        </Container>
      </section>

      {SHOW.calendrier || SHOW.tarif ? (
      <section
        id={SHOW.calendrier ? "calendrier" : "tarif"}
        className="cal-band"
        aria-labelledby="calendrier-title"
      >
        <span className="cal-band__glow" aria-hidden="true" />
        <span className="cal-band__grid" aria-hidden="true" />
        <Container className="cal-band__inner">
          {SHOW.calendrier ? (
            <>
              <header className="cal-band__head">
                <div>
                  <p className="cal-band__index"><KickerIcon label="Calendrier" />{SHOW.tarif ? "07 · Calendrier et tarif" : "07 · Le calendrier"}</p>
                  <h2 id="calendrier-title" className="cal-band__title">
                    Calendrier de la promotion 1.
                    <br />
                    <em>D’octobre à décembre 2026.</em>
                  </h2>
                </div>
                <p className="cal-band__lead">{data.calendrier.chapeau}</p>
              </header>

              <div className="cal-band__block">
                <p className="cal-band__block-label">Le calendrier</p>
                <CalendarTable />
              </div>
            </>
          ) : (
            <header className="cal-band__head">
              <div>
                <p className="cal-band__index"><KickerIcon label="Tarif" />07 · Le tarif</p>
                <h2 id="calendrier-title" className="cal-band__title">
                  Tarif de la promotion 1.
                </h2>
              </div>
            </header>
          )}

          {SHOW.tarif ? (
            <div className="cal-band__block is-tarif" id={SHOW.calendrier ? "tarif" : undefined}>
              {SHOW.calendrier ? <p className="cal-band__block-label">Le tarif</p> : null}
              <PriceTeaser showCta />
            </div>
          ) : null}
        </Container>
      </section>
      ) : null}


      {SHOW.sessionInfo ? (
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
            <LeadForm kind="session" prefix="s" />
          </div>
        </Container>
      </section>
      ) : null}

      {SHOW.video ? (
      <section id="video" className="videoband" aria-labelledby="video-title">
        <span className="videoband__glow" aria-hidden="true" />
        <span className="videoband__grid" aria-hidden="true" />
        <Container className="videoband__inner">
          <div className="videoband__copy">
            <p className="videoband__index"><KickerIcon label="En vidéo" />En vidéo</p>
            <h2 id="video-title" className="videoband__title">
              Le certificat en{" "}
              <em>quatre-vingt-dix secondes</em>
            </h2>
            <p className="videoband__lead">{site.video.texte}</p>
            <ul className="videoband__beats" aria-label="Points abordés">
              <li>
                <span>01</span> Le cycle
              </li>
              <li>
                <span>02</span> Le projet
              </li>
              {SHOW.soutenance ? (
                <li>
                  <span>03</span> La soutenance
                </li>
              ) : null}
            </ul>
            <p className="videoband__meta">
              <span className="videoband__meta-dot" aria-hidden="true" />
              Durée {site.video.duree}
            </p>
          </div>
          <Reveal className="videoband__stage" delay={80}>
            <VideoBlock />
          </Reveal>
        </Container>
      </section>
      ) : null}

      <section id="dispositif" className="dispo" aria-labelledby="dispositif-title">
        <Container className="dispo__inner">
          <header className="dispo__head">
            <p className="dispo__index"><KickerIcon label="Le dispositif BDO" />08 · Le dispositif BDO</p>
            <h2 id="dispositif-title" className="dispo__title">
              {site.dispositif.titre}
            </h2>
          </header>
          <div className="dispo__grid">
            {site.dispositif.items.map((it) => {
              const baro = it.lien.includes("barometre");
              const livre = it.lien.includes("livre-blanc");
              return (
                <PubCard
                  key={it.titre}
                  href={appHref(it.lien)}
                  type={baro ? "Enquête · 2024" : livre ? "Livre blanc" : "Événement annuel"}
                  title={it.titre}
                  text={it.texte}
                  action={it.action}
                  cover={baro ? RESOURCE_COVERS.barometre : livre ? RESOURCE_COVERS.livreblanc : null}
                  landscape={baro}
                  logo={TROPHEE_LOGO}
                />
              );
            })}
          </div>
        </Container>
      </section>

      <section className="final-cta" aria-labelledby="final-cta-title">
        <Container>
          <div className="final-cta__card">
            <div className="final-cta__copy">
              <p className="final-cta__kicker"><KickerIcon label="Promotion 1 · 25 places" />Promotion 1 · 25 places</p>
              <h2 id="final-cta-title" className="final-cta__title">
                Prêt à rejoindre la promotion&nbsp;1&nbsp;?
              </h2>
              <p className="final-cta__lead">
                Une candidature en {data.site.admission.dureeDossier} environ, puis une réponse sous{" "}
                {data.site.admission.delaiReponse} après réception du dossier complet.
              </p>
              <div className="final-cta__actions">
                <ButtonLink href="/candidater" className="final-cta__primary">
                  Candidater
                  <span aria-hidden="true">→</span>
                </ButtonLink>
                <ButtonLink
                  href="/admissions#rappel"
                  variant="ghost"
                  className="final-cta__secondary"
                >
                  Être rappelé
                </ButtonLink>
              </div>
            </div>
            <DeadlineCountdown className="final-cta__countdown" />
          </div>
        </Container>
      </section>

      {SHOW.partenaires ? (
      <section id="partenaires" className="bg-cream py-12">
        <Container>
          <Kicker>Avec le concours de</Kicker>
          <div className="logo-marquee mt-6">
            <ul className="logo-marquee__track" style={{ animationDuration: "46s" }}>
              {[...site.partenaires, ...site.partenaires].map((p, i) => (
                <li key={`${p.nom}-${i}`} className="partner-marquee__item">
                  <a
                    href={p.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-marquee__link"
                    aria-label={plain(p.nom)}
                  >
                    <Image
                      src={p.logo}
                      alt={plain(p.nom)}
                      width={200}
                      height={56}
                      className="partner-marquee__img"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      ) : null}
    </>
  );
}
