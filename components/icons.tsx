import type { ReactNode } from "react";

export function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconDownload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v11" />
      <path d="M7.5 11.5 12 16l4.5-4.5" />
      <path d="M5 19.5h14" />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M9 14.2l2 2 4-4" />
    </svg>
  );
}

export function IconBook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 6.5C10.4 5 8.2 4.3 4.5 4.3v13.4c3.7 0 5.9.7 7.5 2.2 1.6-1.5 3.8-2.2 7.5-2.2V4.3c-3.7 0-5.9.7-7.5 2.2z" />
      <path d="M12 6.5v13.4" />
    </svg>
  );
}

export function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 3.5h3.2l1.6 4-2.1 1.5a11.5 11.5 0 0 0 5.8 5.8l1.5-2.1 4 1.6v3.2a1.5 1.5 0 0 1-1.7 1.5C10.4 18.4 5.6 13.6 4 5.2A1.5 1.5 0 0 1 5.5 3.5z" />
    </svg>
  );
}

export function IconWhatsApp({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function IconCal() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

export function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 18.5c.6-3 2.7-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M14.2 14.2c1.9.3 3.5 1.4 4.3 3.3" />
    </svg>
  );
}

export function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s7-6.4 7-11.2a7 7 0 1 0-14 0C5 14.6 12 21 12 21z" />
      <circle cx="12" cy="9.8" r="2.6" />
    </svg>
  );
}

export function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.4l3.6 2.1" />
    </svg>
  );
}

export function IconPlay() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="6" width="12.5" height="12" rx="2.5" />
      <path d="M15.5 10.5 21 7.5v9l-5.5-3" />
    </svg>
  );
}

export function IconArrow() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h14" />
      <path d="M12.5 6.5 19 12l-6.5 5.5" />
    </svg>
  );
}

function S({ children }: { children: ReactNode }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

export const seminarIcons = [
  () => (
    <S>
      <ellipse cx="12" cy="6" rx="7.5" ry="2.8" />
      <path d="M4.5 6v12c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8V6" />
      <path d="M4.5 12c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8" />
    </S>
  ),
  () => (
    <S>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3.5" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" />
      <path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4" />
    </S>
  ),
  () => (
    <S>
      <path d="M7 16.5h9.2a4.3 4.3 0 0 0 .4-8.6 6 6 0 0 0-11.4 1.5A3.8 3.8 0 0 0 7 16.5z" />
    </S>
  ),
  () => (
    <S>
      <rect x="3.5" y="8" width="7" height="8" rx="1.5" />
      <rect x="13.5" y="8" width="7" height="8" rx="1.5" />
      <path d="M10.5 12h3" />
    </S>
  ),
  () => (
    <S>
      <circle cx="9" cy="12" r="5" />
      <path d="M13.2 8.2a5 5 0 1 1 0 7.6" />
    </S>
  ),
  () => (
    <S>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M3.5 10h17" />
      <circle cx="8" cy="14.2" r="1.1" />
    </S>
  ),
  () => (
    <S>
      <path d="M12 3.5 19 7v5.2c0 4.2-3 6.8-7 8.3-4-1.5-7-4.1-7-8.3V7z" />
    </S>
  ),
  () => (
    <S>
      <path d="M8 20.5V10l4-3 4 3v10.5" />
      <path d="M5 20.5h14" />
    </S>
  ),
];

export function IconMap() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="5.5" r="2.5" />
      <path d="M8 18.5h6a3.5 3.5 0 0 0 0-7h-4a3.5 3.5 0 0 1 0-7h6" />
    </svg>
  );
}

export function IconJury() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="11.5" rx="2" />
      <path d="M12 15.5V19M8 21l4-2 4 2M7.5 11.5l2.5-3 2.5 2.2 4-4.2" />
    </svg>
  );
}

export function IconCert() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.2 13.6 8 21.5l4-2.1 4 2.1-1.2-7.9" />
    </svg>
  );
}

export function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 3.5v17h16" />
      <path d="M7.5 15.5 11 11l3 2.4 4.5-6.2" />
    </svg>
  );
}

export function IconGauge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.8 17.5a8.2 8.2 0 1 1 16.4 0" />
      <path d="M12 17.5l4.6-4.6" />
      <circle cx="12" cy="17.5" r="1.3" />
    </svg>
  );
}

export function IconLinkedIn({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function IconSearch({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

export function IconSort({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 5v14" />
      <path d="M3.5 15.5 7 19l3.5-3.5" />
      <path d="M17 19V5" />
      <path d="M13.5 8.5 17 5l3.5 3.5" />
    </svg>
  );
}

export function IconTick({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

export function IconBarChart({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 19V10" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </svg>
  );
}

export function IconFileText({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M8.5 12.5h7" />
      <path d="M8.5 16h5" />
    </svg>
  );
}

export function IconLayers({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 4 8 4.2-8 4.2-8-4.2L12 4z" />
      <path d="m4 12.2 8 4.2 8-4.2" />
      <path d="m4 16.4 8 4.2 8-4.2" />
    </svg>
  );
}

export function IconJuryMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3.5 14.2 9.8 21 10.2 15.8 14.4 17.4 21 12 17.8 6.6 21 8.2 14.4 3 10.2 9.8 9.8 12 3.5z" />
    </svg>
  );
}

export function IconGrid({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </svg>
  );
}

export function IconInbox({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 13.5 6.2 5.8A1.5 1.5 0 0 1 7.65 4.75h8.7A1.5 1.5 0 0 1 17.8 5.8L20 13.5" />
      <path d="M4 13.5h4.2l1.3 2.2h5l1.3-2.2H20V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-5.5z" />
    </svg>
  );
}

export function IconMail({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m5.5 8 6.5 5 6.5-5" />
    </svg>
  );
}
