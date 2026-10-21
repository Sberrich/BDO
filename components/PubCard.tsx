import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight } from "@/components/icons";

type Props = {
  href: string;
  title: string;
  text: string;
  action: string;
  type?: string;
  cover?: string | null;
  /** Tilted document mock (default). Use with `fill` for edge-to-edge photo covers. */
  landscape?: boolean;
  /** Cover image fills the whole visual panel (object-fit: cover). */
  fill?: boolean;
  /** Overlay chips / badges on the visual (e.g. top corners). */
  overlay?: ReactNode;
  emblem?: ReactNode;
  emblemLabel?: string;
  logo?: { src: string; width: number; height: number };
  className?: string;
  children?: ReactNode;
};

export function PubCard({
  href,
  title,
  text,
  action,
  type,
  cover,
  landscape,
  fill = false,
  overlay,
  emblem,
  emblemLabel,
  logo,
  className = "",
  children,
}: Props) {
  return (
    <Link href={href} className={`pub-card${fill ? " is-fill" : ""} ${className}`.trim()}>
      <span className="pub-card__visual">
        {cover && fill ? (
          <span className="pub-card__cover" aria-hidden>
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 960px) 22rem, (min-width: 640px) 45vw, 100vw"
              className="pub-card__cover-img"
            />
          </span>
        ) : cover ? (
          <span className={`pub-card__book${landscape ? " is-landscape" : ""}`}>
            <Image
              src={cover}
              alt=""
              width={landscape ? 1011 : 409}
              height={landscape ? 715 : 571}
              sizes="(min-width: 960px) 14rem, 50vw"
            />
          </span>
        ) : logo ? (
          <span className="pub-card__logo">
            <Image src={logo.src} alt="" width={logo.width} height={logo.height} unoptimized />
          </span>
        ) : (
          <span className="pub-card__emblem" aria-hidden>
            <span className="pub-card__emblem-icon">{emblem}</span>
            {emblemLabel ? <span className="pub-card__emblem-label">{emblemLabel}</span> : null}
          </span>
        )}
        {overlay ? <span className="pub-card__overlay">{overlay}</span> : null}
      </span>
      <span className="pub-card__body">
        {type ? <span className="pub-card__type">{type}</span> : null}
        <span className={`pub-card__title${type ? " has-type" : ""}`}>{title}</span>
        <span className="pub-card__text">{text}</span>
        {children}
        <span className="pub-card__more">
          {action}
          <IconArrowRight />
        </span>
      </span>
    </Link>
  );
}
