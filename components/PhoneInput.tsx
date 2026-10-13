"use client";

import { FormEvent, useId, useState } from "react";
import { fieldClass } from "@/components/ui";
import { PHONE_ERROR, PHONE_HINT, normalizePhone, sanitizePhone } from "@/lib/phone";

/** Validity is exposed through setCustomValidity, so form.checkValidity() covers it. */
export function PhoneInput({ label, required }: { label: string; required?: boolean }) {
  const id = useId();
  const [error, setError] = useState("");

  function check(input: HTMLInputElement, show: boolean) {
    const value = input.value.trim();
    const message = value
      ? normalizePhone(value) ? "" : PHONE_ERROR
      : required ? "Merci d’indiquer votre numéro de téléphone." : "";
    input.setCustomValidity(message);
    if (show || !message) setError(message);
  }

  function onInput(e: FormEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const clean = sanitizePhone(input.value);
    if (clean !== input.value) {
      const pos = Math.max(0, (input.selectionStart ?? clean.length) - (input.value.length - clean.length));
      input.value = clean;
      input.setSelectionRange(pos, pos);
    }
    check(input, Boolean(error));
  }

  return (
    <label className="block text-sm font-semibold">
      {label}
      {required ? " *" : ""}
      <input
        className={fieldClass}
        required={required}
        type="tel"
        name="telephone"
        inputMode="tel"
        autoComplete="tel"
        placeholder="06 12 34 56 78"
        maxLength={25}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-hint`}
        onInput={onInput}
        onBlur={(e) => check(e.currentTarget, true)}
        onInvalid={(e) => check(e.currentTarget, true)}
      />
      <span id={`${id}-hint`} className={`mt-1 block text-xs font-normal ${error ? "text-red" : "text-muted"}`} role={error ? "alert" : undefined}>
        {error || PHONE_HINT}
      </span>
    </label>
  );
}
