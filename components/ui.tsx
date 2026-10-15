import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  IconBarChart,
  IconBook,
  IconCal,
  IconCert,
  IconChart,
  IconDownload,
  IconFileText,
  IconGrid,
  IconJury,
  IconLayers,
  IconMail,
  IconPhone,
  IconPlay,
  IconSearch,
  IconTick,
  IconTrophy,
  IconUsers,
} from "@/components/icons";

/** Three button styles site-wide: primary (red), secondary (outline), text (link). "ghost" = secondary. */
type Variant = "primary" | "secondary" | "ghost" | "text";

const outline = "btn-outline bg-white text-blue border-line";

const variants: Record<Variant, string> = {
  primary: "bg-red text-white border-red hover:bg-red-dark hover:border-red-dark",
  secondary: outline,
  ghost: outline,
  text: "border-transparent bg-transparent !px-1 text-blue underline-offset-4 hover:underline",
};

export function cls(variant: Variant, className = "") {
  return `btn-icon inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm font-bold leading-snug ${variants[variant]} ${className}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}: LinkProps & { children: ReactNode; variant?: Variant; className?: string }) {
  return (
    <Link href={href} className={cls(variant, className)} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={cls(variant, className)} {...props}>
      {children}
    </button>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1160px] px-4 sm:px-5 ${className}`}>{children}</div>;
}

/** First match wins; IconGrid otherwise. */
const KICKER_ICONS: [RegExp, (props: { size?: number }) => ReactNode][] = [
  [/session|vidéo|témoignage|playlist/i, IconPlay],
  [/calendrier|séances?\b|\bdates?\b|promotion|rentrée|candidatures ouvertes/i, IconCal],
  [/fil rouge|parcours/i, IconLayers],
  [/parler|rappel/i, IconPhone],
  [/contact/i, IconMail],
  [/constat|baromètre|enquête/i, IconBarChart],
  [/livrable|produisez|candidat|admission|mention|confidentialit|cgu|conditions|légal/i, IconFileText],
  [/investissement|tarif|financement/i, IconChart],
  [/erreur|faq|question/i, IconSearch],
  [/confirmation/i, IconTick],
  [/dispositif|trophée/i, IconTrophy],
  [/soutenance|jury|signature/i, IconJury],
  [/concours|partenaire|intervenant|équipe|enseignant|profil/i, IconUsers],
  [/institution|certificat|certification|cosign|à propos/i, IconCert],
  [/séminaire|programme|workshop|conférence|clôture|insight|publication|aller plus loin|continuer/i, IconBook],
  [/ressource|brochure|pdf|document/i, IconDownload],
  [/presse|médias?\b/i, IconFileText],
];

/** Icon tile for section labels; colours follow the label's text colour. */
export function KickerIcon({
  label,
  bare = false,
  className = "",
}: {
  label: string;
  bare?: boolean;
  className?: string;
}) {
  const Icon = KICKER_ICONS.find(([re]) => re.test(label))?.[1] ?? IconGrid;
  return (
    <span className={`kicker-icon${bare ? " is-bare" : ""} ${className}`} aria-hidden="true">
      <Icon />
    </span>
  );
}

export function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`inline-flex items-center text-[0.8125rem] font-bold uppercase tracking-[0.12em] ${
        light ? "text-white/75" : "text-navy"
      }`}
    >
      <KickerIcon label={typeof children === "string" ? children : ""} className={light ? "text-white" : "text-blue"} />
      {children}
    </p>
  );
}

export function SectionHeading({
  kicker,
  title,
  lead,
  index,
}: {
  kicker: string;
  title: string;
  lead?: ReactNode;
  index?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        {index ? (
          <span className="font-mono text-sm font-bold tabular-nums text-blue">{index}</span>
        ) : null}
        <Kicker>{kicker}</Kicker>
      </div>
      <h2 className="mt-3 text-[clamp(1.75rem,1.45rem+1.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
        {title}
      </h2>
      {lead ? <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p> : null}
    </div>
  );
}

export const fieldClass =
  "mt-1 w-full rounded-[10px] border border-line bg-white px-3.5 py-[0.7rem] text-ink outline-none max-sm:rounded-[12px] max-sm:px-5 max-sm:py-[1.125rem] max-sm:text-[1.125rem] placeholder:font-normal placeholder:text-muted transition hover:border-muted focus:border-blue focus:ring-2 focus:ring-blue/20";

export function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero relative overflow-hidden bg-navy text-white">
      <Container className="relative z-[1] py-[clamp(2.75rem,6vw,4.5rem)]">
        <Kicker light>{kicker}</Kicker>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.05rem,1.5rem+2.2vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white">
          {title}
        </h1>
        {lead ? <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">{lead}</p> : null}
        {children}
      </Container>
    </section>
  );
}

