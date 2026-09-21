import Image from "next/image";
import { site } from "@/content/site";

function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-left">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}

export function HomeSections() {
  return (
    <>
      <section id="about" className="bg-cream py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/home/about.png"
              alt="Professionnels en séance de travail"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {site.presentation.title}
            </h2>
            <p className="mt-5 leading-relaxed text-muted">{site.presentation.text}</p>
            <a
              href="/inscription"
              className="mt-8 inline-flex rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white hover:bg-navy-dark"
            >
              Inscrivez-vous maintenant
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {site.audience.title}
            </h2>
            <p className="mt-5 leading-relaxed text-muted">{site.audience.text}</p>
            <ul className="mt-6 space-y-3 text-ink">
              {site.audience.profiles.map((p) => (
                <Check key={p}>{p}</Check>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/home/objectives.png"
              alt="Cadre financier en réunion"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section id="objectif" className="bg-cream py-20">
        <div className="mx-auto w-full max-w-3xl px-5 text-center">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {site.objectives.title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted">{site.objectives.intro}</p>
          <ul className="mx-auto mt-8 max-w-xl space-y-4 text-left text-ink">
            {site.objectives.items.map((item) => (
              <Check key={item}>{item}</Check>
            ))}
          </ul>
        </div>
      </section>

      <section id="conference" className="bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/home/conference.png"
              alt="Conférence du certificat"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {site.conference.title}
            </h2>
            <p className="mt-5 leading-relaxed text-muted">{site.conference.text}</p>
            <p className="mt-4 leading-relaxed text-ink">{site.conference.closing}</p>
          </div>
        </div>
      </section>

      <section id="programme" className="bg-cream py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-ink sm:text-4xl">
            Programme
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {site.programme.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-3xl bg-ink"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{item.blurb}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/home/iscae-about.png"
              alt="Groupe ISCAE"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {site.iscae.title}
            </h2>
            <p className="mt-5 leading-relaxed text-muted">{site.iscae.text}</p>
            <ul className="mt-6 space-y-3">
              {site.iscae.items.map((item) => (
                <Check key={item}>{item}</Check>
              ))}
            </ul>
            <a
              href={site.links.iscae}
              className="mt-8 inline-flex rounded-full border border-navy px-7 py-3 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
              rel="noopener noreferrer"
            >
              Afficher plus
            </a>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {site.bdo.title}
            </h2>
            {site.bdo.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 leading-relaxed text-muted">
                {p}
              </p>
            ))}
            <a
              href={site.links.bdo}
              className="mt-8 inline-flex rounded-full border border-navy px-7 py-3 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
              rel="noopener noreferrer"
            >
              Afficher plus
            </a>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/home/bdo.png"
              alt="Équipes BDO Maroc"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-20">
        <div className="mx-auto w-full max-w-6xl px-5">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-ink sm:text-4xl">
            Contact
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <article className="rounded-3xl bg-cream p-8 text-center">
              <h3 className="font-display text-xl font-bold text-ink">Notre adresse</h3>
              <p className="mt-3 text-muted">{site.address}</p>
            </article>
            <article className="rounded-3xl bg-cream p-8 text-center">
              <h3 className="font-display text-xl font-bold text-ink">Contacter-nous</h3>
              <p className="mt-3 text-muted">
                Visitez nos sites web{" "}
                <a className="font-semibold text-navy" href={site.links.iscae}>
                  www.groupeiscae.ma
                </a>{" "}
                —{" "}
                <a className="font-semibold text-navy" href={site.links.bdo}>
                  www.bdo.ma
                </a>
                .
              </p>
            </article>
            <article className="rounded-3xl bg-cream p-8 text-center">
              <h3 className="font-display text-xl font-bold text-ink">E-mail</h3>
              <p className="mt-3 text-muted">
                Envoyez-nous un e-mail à{" "}
                <a className="font-semibold text-navy" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
