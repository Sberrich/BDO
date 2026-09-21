import type { Metadata } from "next";
import { Container, Kicker } from "@/components/ui";
import { ds } from "@/lib/ds";

export const metadata: Metadata = {
  title: "Design system — Foundations",
  robots: { index: false, follow: false },
};

const brandSwatches = [
  { name: "Red CTA", var: "--brand-red", hex: ds.brand.red, role: "Primary action only" },
  { name: "Red dark", var: "--brand-red-dark", hex: ds.brand.redDark, role: "CTA hover" },
  { name: "Blue", var: "--brand-blue", hex: ds.brand.blue, role: "Links, kickers, focus" },
  { name: "Blue dark", var: "--brand-blue-dark", hex: ds.brand.blueDark, role: "Link hover" },
  { name: "Navy", var: "--brand-navy", hex: ds.brand.navy, role: "Authority / inverse" },
];

const surfaces = [
  { name: "Surface 0", var: "--surface-0", note: "Page / cards" },
  { name: "Surface 1", var: "--surface-1", note: "Section cream" },
  { name: "Surface 2", var: "--surface-2", note: "Deeper wash" },
  { name: "Accent", var: "--surface-accent", note: "Soft blue tint" },
];

const textRoles = [
  { name: "Primary", var: "--text-primary", sample: "Construisez la feuille de route" },
  { name: "Secondary", var: "--text-secondary", sample: "Vingt jours sur cinq mois, à Rabat." },
  { name: "Tertiary", var: "--text-tertiary", sample: "Meta · dates · captions" },
  { name: "Link", var: "--text-link", sample: "Être rappelé sous 48 h" },
];

export default function DesignSystemPage() {
  return (
    <div className="bg-[var(--surface-1)]">
      <section className="relative overflow-hidden border-b border-line bg-white py-14 md:py-20">
        <Container className="relative">
          <Kicker>Design system · Step 1</Kicker>
          <h1 className="mt-3 max-w-2xl text-[clamp(2rem,1.5rem+2vw,3rem)] font-bold leading-[1.1]">
            Foundations for {ds.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Brand-locked tokens that raise hierarchy and consistency — without changing your content or journey.
          </p>
          <ol className="mt-8 flex flex-wrap gap-2">
            {ds.steps.map((s) => (
              <li
                key={s.id}
                className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${
                  s.status === "now"
                    ? "bg-blue text-white"
                    : "bg-[var(--surface-1)] text-muted"
                }`}
              >
                {s.id}. {s.title}
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-line bg-white py-14">
        <Container>
          <Kicker>Principles</Kicker>
          <h2 className="mt-2 text-[var(--text-2xl)] font-bold">Rules that keep the brand sharp</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {ds.principles.map((p, i) => (
              <li key={p} className="rounded-[var(--radius-md)] border border-line bg-[var(--surface-1)] p-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue">0{i + 1}</span>
                <p className="mt-2 font-semibold text-ink">{p}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-line py-14">
        <Container>
          <Kicker>Color</Kicker>
          <h2 className="mt-2 text-[var(--text-2xl)] font-bold">Brand palette (locked)</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {brandSwatches.map((c) => (
              <article key={c.var} className="overflow-hidden rounded-[var(--radius-md)] border border-line bg-white shadow-[var(--shadow-sm)]">
                <div className="h-24" style={{ background: `var(${c.var})` }} />
                <div className="p-4">
                  <p className="font-bold">{c.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted">{c.hex}</p>
                  <p className="mt-2 text-sm text-muted">{c.role}</p>
                </div>
              </article>
            ))}
          </div>

          <h3 className="mt-12 text-lg font-bold">Surfaces</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {surfaces.map((s) => (
              <div key={s.var} className="rounded-[var(--radius-md)] border border-line p-4" style={{ background: `var(${s.var})` }}>
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-muted">{s.note}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-12 text-lg font-bold">Text roles</h3>
          <ul className="mt-4 space-y-3 rounded-[var(--radius-md)] border border-line bg-white p-6">
            {textRoles.map((t) => (
              <li key={t.var}>
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">{t.name}</span>
                <p className="text-lg font-semibold" style={{ color: `var(${t.var})` }}>
                  {t.sample}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-line bg-white py-14">
        <Container>
          <Kicker>Typography</Kicker>
          <h2 className="mt-2 text-[var(--text-2xl)] font-bold">Type ramp — Mulish</h2>
          <p className="mt-3 max-w-2xl text-muted">
            One family, clearer steps. Display and body stay Mulish for BDO continuity; scale does the hierarchy work.
          </p>
          <div className="mt-8 space-y-6 rounded-[var(--radius-md)] border border-line bg-[var(--surface-1)] p-6 md:p-8">
            <p className="font-bold leading-[1.06]" style={{ fontSize: "var(--text-4xl)" }}>
              Home hero — text-4xl
            </p>
            <p className="font-bold leading-[1.1]" style={{ fontSize: "var(--text-3xl)" }}>
              Page hero — text-3xl
            </p>
            <p className="font-bold leading-[1.2]" style={{ fontSize: "var(--text-2xl)" }}>
              Section title — text-2xl
            </p>
            <p className="text-muted" style={{ fontSize: "var(--text-lg)" }}>
              Section lead — text-lg. Chaque séminaire dure deux jours…
            </p>
            <p style={{ fontSize: "var(--text-base)" }}>Body — text-base. Le certificat s’adresse aux dirigeants…</p>
            <p className="font-bold uppercase tracking-[0.1em] text-blue" style={{ fontSize: "var(--text-sm)" }}>
              Kicker — text-sm
            </p>
            <p className="font-bold tabular-nums text-blue" style={{ fontSize: "var(--text-stat)" }}>
              78 %
            </p>
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {ds.typeRamp.map((r) => (
              <li key={r.token} className="flex gap-2 text-sm">
                <code className="rounded bg-[var(--surface-1)] px-2 py-0.5 font-mono text-blue">{r.token}</code>
                <span className="text-muted">{r.use}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-line py-14">
        <Container>
          <Kicker>Space & radius</Kicker>
          <h2 className="mt-2 text-[var(--text-2xl)] font-bold">Rhythm and corners</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-line bg-white p-6">
              <h3 className="font-bold">Spacing scale (4px base)</h3>
              <ul className="mt-4 space-y-2">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => (
                  <li key={n} className="flex items-center gap-3">
                    <span className="w-16 font-mono text-xs text-muted">space-{n}</span>
                    <span className="h-3 rounded-sm bg-blue" style={{ width: `var(--space-${n})` }} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-md)] border border-line bg-white p-6">
              <h3 className="font-bold">Radius</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {ds.radius.map((r) => (
                  <div key={r.token} className="text-center">
                    <div
                      className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-blue bg-[var(--brand-blue-soft)]"
                      style={{ borderRadius: `var(--${r.token})` }}
                    />
                    <p className="mt-2 font-mono text-xs text-blue">{r.token}</p>
                    <p className="text-xs text-muted">{r.use}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-white py-14">
        <Container>
          <Kicker>Elevation & motion</Kicker>
          <h2 className="mt-2 text-[var(--text-2xl)] font-bold">Depth and timing</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ds.elevation.map((e) => (
              <div
                key={e.token}
                className="rounded-[var(--radius-md)] border border-line bg-white p-5"
                style={{ boxShadow: `var(--${e.token})` }}
              >
                <p className="font-mono text-xs font-bold text-blue">{e.token}</p>
                <p className="mt-2 text-sm text-muted">{e.use}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["--duration-fast", "150ms", "Hover / icon nudge"],
              ["--duration-base", "220ms", "Cards, chips"],
              ["--duration-enter", "550ms", "Scroll reveal"],
            ].map(([token, val, use]) => (
              <div key={token} className="rounded-[var(--radius-md)] bg-[var(--surface-1)] p-5">
                <p className="font-mono text-xs text-blue">{token}</p>
                <p className="mt-1 text-2xl font-bold">{val}</p>
                <p className="mt-1 text-sm text-muted">{use}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <Kicker>Do / don’t</Kicker>
          <h2 className="mt-2 text-[var(--text-2xl)] font-bold">CTA discipline</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-line bg-white p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue">Do</p>
              <p className="mt-2 font-semibold">One red button per viewport</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex rounded-[var(--radius-sm)] bg-red px-4 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-cta)]">
                  Déposer ma candidature
                </span>
                <span className="inline-flex rounded-[var(--radius-sm)] border border-blue px-4 py-2.5 text-sm font-bold text-blue">
                  Recevoir la brochure
                </span>
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-line bg-white p-6 opacity-80">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Don’t</p>
              <p className="mt-2 font-semibold">Two red CTAs competing</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex rounded-[var(--radius-sm)] bg-red px-4 py-2.5 text-sm font-bold text-white">
                  Candidater
                </span>
                <span className="inline-flex rounded-[var(--radius-sm)] bg-red px-4 py-2.5 text-sm font-bold text-white">
                  Brochure
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[var(--radius-md)] border border-blue/20 bg-white p-6 md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-blue">Next</p>
            <h3 className="mt-2 text-xl font-bold">Step 2 — Components</h3>
            <p className="mt-2 max-w-2xl text-muted">
              Button, Field, Card, Chip, Badge, SectionHeading, PageHero — rebuilt on these tokens so every page speaks the same language.
            </p>
            <p className="mt-4 text-sm font-semibold text-ink">
              Approve Step 1 and I’ll build Step 2.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
