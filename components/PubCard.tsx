import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowRight } from "@/components/icons";

type Props = {
  href: string;
  title: string;
  text: string;
  action: string;
  cover?: string | null;
  landscape?: boolean;
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
  cover,
  landscape,
  emblem,
  emblemLabel,
  logo,
  className = "",
  children,
}: Props) {
  return (
    <Link href={href} className={`pub-card ${className}`}>
      <span className="pub-card__visual" aria-hidden>
        {cover ? (
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
          <span className="pub-card__emblem">
            <span className="pub-card__emblem-icon">{emblem}</span>
            {emblemLabel ? <span className="pub-card__emblem-label">{emblemLabel}</span> : null}
          </span>
        )}
      </span>
      <span className="pub-card__body">
        <span className="pub-card__title">{title}</span>
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
