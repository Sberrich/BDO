/**
 * CFO 4.0 Design System — documented token map (Step 1)
 * Use these names in components; CSS vars live in styles/tokens.css
 */

export const ds = {
  name: "CFO 4.0",
  version: "1.0.0-step1",
  principles: [
    "One red CTA per screen — BDO red is conversion only",
    "Blue is interactive — links, kickers, focus, secondary actions",
    "Navy is authority — deep surfaces, footer weight, institutional moments",
    "Cream is rhythm — alternate sections, never compete with content",
    "Same content, clearer hierarchy — no IA changes",
  ],
  brand: {
    red: "#E81A3B",
    redDark: "#B7132E",
    blue: "#0062B8",
    blueDark: "#004B8D",
    navy: "#003768",
  },
  roles: {
    cta: "brand-red",
    interactive: "brand-blue",
    authority: "brand-navy",
    surfaceQuiet: "surface-1",
    textBody: "text-primary",
    textSupport: "text-secondary",
  },
  typeRamp: [
    { token: "text-xs", use: "Captions, legal microcopy" },
    { token: "text-sm", use: "Kickers, chips, meta, nav" },
    { token: "text-base", use: "Body, form labels" },
    { token: "text-md", use: "Leads, hero support" },
    { token: "text-lg", use: "Section leads" },
    { token: "text-2xl", use: "Section titles (h2)" },
    { token: "text-3xl", use: "Page heroes (h1)" },
    { token: "text-4xl", use: "Home hero only" },
    { token: "text-stat", use: "Big numbers / constat" },
  ],
  radius: [
    { token: "radius-sm", use: "Buttons, inputs, cards (default 6px)" },
    { token: "radius-md", use: "Larger panels, media" },
    { token: "radius-lg", use: "Feature blocks" },
    { token: "radius-full", use: "Chips, avatars, pills" },
  ],
  elevation: [
    { token: "shadow-xs", use: "Subtle resting" },
    { token: "shadow-sm", use: "Cards at rest" },
    { token: "shadow-md", use: "Card hover / sticky" },
    { token: "shadow-lg", use: "Journey panel, modals" },
    { token: "shadow-cta", use: "Primary red CTA only" },
  ],
  steps: [
    { id: 1, title: "Foundations", status: "now", detail: "Color, type, space, radius, elevation, motion" },
    { id: 2, title: "Components", status: "next", detail: "Button, Field, Card, Chip, Kicker, Section, Hero" },
    { id: 3, title: "Patterns", status: "later", detail: "Doors CTA, Journey, Constat, Forms, FAQ" },
    { id: 4, title: "Apply", status: "later", detail: "Roll onto home → programme → admissions → rest" },
  ],
} as const;
