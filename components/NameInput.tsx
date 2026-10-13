"use client";

import { FormEvent, useId, useState } from "react";
import { fieldClass } from "@/components/ui";
import { NAME_MAX, cleanName, nameError, type NameKind } from "@/lib/names";

/** Validity is exposed through setCustomValidity, so form.checkValidity() covers it. */
export function NameInput({ kind, required }: { kind: NameKind; required?: boolean }) {
  const id = useId();
  const [error, setError] = useState("");

  function check(input: HTMLInputElement, show: boolean) {
    const message = !input.value.trim() && !required ? "" : nameError(kind, input.value);
    input.setCustomValidity(message);
    if (show || !message) setError(message);
  }

  return (
    <label className="block text-sm font-semibold">
      {kind === "prenom" ? "Prénom" : "Nom"}
      {required ? " *" : ""}
      <input
        className={fieldClass}
        required={required}
        name={kind}
        autoComplete={kind === "prenom" ? "given-name" : "family-name"}
        maxLength={NAME_MAX + 20}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onInput={(e: FormEvent<HTMLInputElement>) => check(e.currentTarget, Boolean(error))}
        onBlur={(e) => {
          const input = e.currentTarget;
          const clean = cleanName(input.value);
          if (clean !== input.value) input.value = clean;
          check(input, true);
        }}
        onInvalid={(e) => check(e.currentTarget, true)}
      />
      {error ? (
        <span id={`${id}-error`} role="alert" className="mt-1 block text-xs font-normal text-red">
          {error}
        </span>
      ) : null}
    </label>
  );
}
