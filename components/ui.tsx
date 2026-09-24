import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-red text-white hover:bg-red-dark border-red shadow-[var(--shadow-cta)] hover:shadow-[0_8px_22px_rgba(227,6,19,.26)]",
  secondary: "bg-white text-blue border-blue hover:bg-blue hover:text-white",
  ghost: "bg-transparent text-blue border-line hover:border-blue",
};

function cls(variant: Variant, className = "") {
  return `btn-icon inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border px-[1.4rem] py-[0.85rem] text-sm font-bold leading-snug ${variants[variant]} ${className}`;
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

export function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.12em] ${
        light ? "text-white/75" : "text-navy"
      }`}
    >
      <span
        className={`h-[3px] w-7 rounded-full ${light ? "bg-white/70" : "bg-blue"}`}
        aria-hidden
      />
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
  "mt-1 w-full rounded-[10px] border border-line bg-white px-3.5 py-[0.7rem] text-ink outline-none transition hover:border-muted focus:border-blue focus:ring-2 focus:ring-blue/20";

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
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(0,55,104,0.35),transparent_42%),radial-gradient(ellipse_at_90%_20%,rgba(227,6,19,0.22),transparent_40%)]"
        aria-hidden
      />
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

