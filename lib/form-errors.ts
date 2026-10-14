export type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Handled by NameInput / PhoneInput, which render their own message. */
export const SELF_REPORTING = ["prenom", "nom", "telephone"];

export function isField(el: unknown): el is Field {
  return el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;
}

const MISSING: Record<string, string> = {
  email: "Merci d’indiquer votre adresse e-mail.",
  ville: "Merci d’indiquer votre ville.",
  fonction: "Merci d’indiquer votre fonction.",
  cv: "Merci de joindre votre CV.",
  diplome: "Merci d’indiquer vos diplômes.",
  interet: "Merci d’expliquer en quelques lignes votre intérêt pour la formation.",
  consentement: "Merci d’accepter les conditions générales pour envoyer votre candidature.",
  moment: "Choisissez un créneau de rappel.",
  creneau: "Choisissez un créneau.",
};

/** French message for one invalid field; "" when the field is valid. */
export function fieldMessage(el: Field) {
  if (el.validity.valid) return "";
  if (el.validity.customError) return el.validationMessage;
  if (el.validity.valueMissing) {
    if (MISSING[el.name]) return MISSING[el.name];
    if (el.name.endsWith("_autre")) return "Merci de préciser votre réponse.";
    if (el instanceof HTMLSelectElement) return "Choisissez une option.";
    if (el.type === "radio") return "Choisissez une réponse.";
    if (el.type === "checkbox") return "Merci de cocher cette case pour continuer.";
    if (el.type === "file") return "Merci de joindre ce fichier.";
    return "Ce champ est obligatoire.";
  }
  if ((el.validity.typeMismatch || el.validity.patternMismatch) && el.type === "email") {
    return "Adresse e-mail non valide (exemple : nom@entreprise.ma).";
  }
  if (el.validity.tooLong) return "Texte trop long.";
  return el.validationMessage;
}

/**
 * Checks every field of the form (firing `invalid` so self-reporting inputs show their message)
 * and returns the messages of the other invalid fields, keyed by name, plus the first invalid field.
 */
export function collectErrors(form: HTMLFormElement) {
  const errors: Record<string, string> = {};
  let first: Field | null = null;
  for (const el of Array.from(form.elements)) {
    if (!isField(el) || el.disabled || el.closest("fieldset[hidden]") || el.checkValidity()) continue;
    first ??= el;
    if (!SELF_REPORTING.includes(el.name) && !(el.name in errors)) errors[el.name] = fieldMessage(el);
  }
  return { errors, first };
}

export function focusField(el: Field) {
  el.focus({ preventScroll: true });
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}
