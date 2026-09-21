"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/content/site";

export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section id="hero" className="bg-white">
      <div className="mx-auto w-full max-w-4xl px-5 pb-8 pt-10 text-center md:pt-16">
        <div className="relative mx-auto mb-10 aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-3xl">
          <Image
            src="/images/home/hero.png"
            alt="Équipe autour d’un ordinateur portable"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lg transition hover:scale-105"
            aria-label="Lire la vidéo de présentation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13l11-6.5L8 5.5z" />
            </svg>
          </button>
        </div>

        <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {site.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {site.tagline}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={site.brochure}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-8 py-3 text-sm font-semibold text-white transition hover:bg-navy-dark"
          >
            Téléchargez la brochure
          </a>
          <Link
            href="/inscription"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-navy px-8 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
          >
            Inscrivez-vous maintenant
          </Link>
        </div>

        <div className="relative mx-auto mt-14 aspect-[16/10] w-full max-w-xl overflow-hidden rounded-3xl">
          <Image
            src="/images/home/campus.png"
            alt="Entrée du campus Groupe ISCAE"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 576px"
          />
        </div>
      </div>

      {videoOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vidéo de présentation"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink"
              onClick={() => setVideoOpen(false)}
            >
              Fermer
            </button>
            <div className="aspect-video">
              <iframe
                title="Présentation du certificat ISCAE × BDO"
                src={`https://player.vimeo.com/video/${site.vimeoId}?autoplay=1`}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
