import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import {
  IconBook,
  IconCal,
  IconCert,
  IconChart,
  IconFileText,
  IconGrid,
  IconLayers,
  IconPhone,
  IconPlay,
  IconSearch,
  IconTick,
  IconUsers,
} from "@/components/icons";

/** Three button styles site-wide: primary (red), secondary (outline), text (link). "ghost" = secondary. */
type Variant = "primary" | "secondary" | "ghost" | "text";

const outline = "bg-white text-blue border-line hover:border-blue";

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
  [/session/i, IconPlay],
  [/calendrier|séances?\b|\bdates?\b/i, IconCal],
  [/fil rouge|parcours/i, IconLayers],
  [/parler|rappel|contact/i, IconPhone],
  [/candidat|mention|confidentialit|cgu|conditions|légal/i, IconFileText],
  [/investissement|tarif|financement/i, IconChart],
  [/erreur/i, IconSearch],
  [/confirmation/i, IconTick],
  [/concours|partenaire|intervenant|équipe/i, IconUsers],
  [/certificat|certification/i, IconCert],
  [/séminaire|programme/i, IconBook],
];

function kickerIcon(children: ReactNode) {
  const label = typeof children === "string" ? children : "";
  const Icon = KICKER_ICONS.find(([re]) => re.test(label))?.[1] ?? IconGrid;
  return <Icon />;
}

export function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.12em] ${
        light ? "text-white/75" : "text-navy"
      }`}
    >
      <span
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4 ${
          light ? "bg-white/10 text-white" : "bg-blue/10 text-blue"
        }`}
        aria-hidden
      >
        {kickerIcon(children)}
      </span>
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
  "mt-1 w-full rounded-[10px] border border-line bg-white px-3.5 py-[0.7rem] text-ink outline-none max-sm:px-4 max-sm:py-3.5 max-sm:text-base placeholder:font-normal placeholder:text-muted transition hover:border-muted focus:border-blue focus:ring-2 focus:ring-blue/20";

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

