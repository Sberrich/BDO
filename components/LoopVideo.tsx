"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster: string;
  className?: string;
};

function skipMotion() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    Boolean(conn?.saveData) ||
    /(^|-)2g$/.test(conn?.effectiveType ?? "")
  );
}

/** Decorative muted loop: the file is only fetched after page load, once the card is near the viewport. */
export function LoopVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const posterSrc = getImageProps({ src: poster, alt: "", width: 400, height: 225, quality: 70 }).props.src;

  useEffect(() => {
    const el = ref.current;
    if (!el || skipMotion()) return;
    let io: IntersectionObserver | undefined;
    const start = () => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(true);
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        },
        { rootMargin: "200px" },
      );
      io.observe(el);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      io?.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={active ? src : undefined}
      poster={posterSrc}
      muted
      loop
      playsInline
      autoPlay={active}
      preload="none"
    />
  );
}
