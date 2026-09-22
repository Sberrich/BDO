"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-blue transition-[width] duration-150 ease-out"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "figure";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      queueMicrotask(() => setShown(true));
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function CountUp({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      queueMicrotask(() => setN(value));
      return;
    }
    let started = false;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const duration = 900;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setN(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
}

export function TypeWrite({
  text,
  className = "",
  as: Tag = "p",
  speed = 22,
  startDelay = 280,
  startOnMount = false,
}: {
  text: string;
  className?: string;
  as?: "p" | "blockquote" | "span" | "h1" | "h2";
  speed?: number;
  startDelay?: number;
  startOnMount?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      queueMicrotask(() => {
        setShown(text);
        setDone(true);
      });
      return;
    }
    if (startOnMount) {
      queueMicrotask(() => setActive(true));
      return;
    }
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [text, startOnMount]);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    let i = 0;
    let timer = 0;
    let cancelled = false;
    const start = window.setTimeout(() => {
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setShown(text.slice(0, i));
        if (i < text.length) {
          const ch = text[i - 1];
          const pause =
            ch === "." || ch === "," || ch === "—" || ch === ";" ? speed * 6 : speed;
          timer = window.setTimeout(tick, pause);
        } else {
          setDone(true);
        }
      };
      tick();
    }, startDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
      window.clearTimeout(timer);
    };
  }, [active, text, speed, startDelay]);

  return (
    <Tag ref={ref as never} className={`typewrite ${className}`} aria-label={text}>
      <span className="typewrite__ghost" aria-hidden="true">
        {text}
      </span>
      <span className="typewrite__live" aria-hidden="true">
        {shown}
        <span className={`typewrite__caret ${done ? "is-done" : ""}`} />
      </span>
    </Tag>
  );
}
