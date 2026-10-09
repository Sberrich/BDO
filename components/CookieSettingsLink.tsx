"use client";

type CmpWindow = Window & { CMP?: { showWidget?: () => void } };

export function CookieSettingsLink() {
  return (
    <button
      type="button"
      className="foot__cookies"
      onClick={() => (window as CmpWindow).CMP?.showWidget?.()}
    >
      Gérer les cookies
    </button>
  );
}
