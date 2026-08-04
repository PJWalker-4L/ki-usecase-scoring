import type { FallBrief } from "@/types/brief";

/** Satzschablone für Feld „Aktueller Ablauf". */
export const ABLAUF_SCHABLONE = "Ich nehme …, mache …, damit …";

export const AUFGABENBESCHREIBUNG_WIZARD = {
  title: "Fall beschreiben",
  description:
    "Beschreiben Sie den heutigen Ablauf als konkreten Durchlauf — die Satzschablone hilft beim ersten Satz. Ihre Beschreibung fließt nicht in den Punktwert ein.",
} as const;

export const STECKBRIEF_COPY = {
  title: "Fall-Steckbrief",
  intro:
    "Beschreiben Sie den heutigen Ablauf als konkreten Durchlauf — und was am Ende anders sein soll. Die Satzschablone hilft beim ersten Satz.",
  schabloneLabel: "Satzschablone für den Ablauf:",
  beispieleToggle: "Zwei ausgefüllte Beispiele ansehen",
  beispielAblaufLabel: "Ablauf:",
  beispielZielLabel: "Ziel:",
  loeschen: "Steckbrief löschen",
} as const;

export const FELD_ABLAUF = {
  label: "Aktueller Ablauf",
  hint: "Beschreiben Sie den heutigen Durchlauf — Input, Arbeit, Zwischenergebnis.",
  placeholder:
    "Ich nehme eingehende Rechnungen, prüfe Beträge und trage sie ins ERP ein, damit die Buchhaltung weiterarbeiten kann.",
} as const;

export const FELD_ZIEL = {
  label: "Was soll am Ende vorliegen?",
  kurzLabel: "Ziel",
  hint: "Soll-Zustand — was liegt vor, ohne dass Sie alles selbst erledigen müssen? Kontrolle kann bei Ihnen bleiben.",
  placeholder:
    "Am Ende liegen freigegebene Buchungssätze im ERP vor, ohne manuelles Abtippen — die Freigabe bleibt bei mir.",
} as const;

export const FELD_LOESUNG = {
  label: "Lösungsansatz",
} as const;

export const FALL_ZUSAMMENFASSUNG = {
  title: "Fall-Zusammenfassung",
} as const;

export const AUFGABENBESCHREIBUNG_SUCHE = {
  placeholder: "Aktueller Ablauf, Lösung oder Ziel …",
} as const;

export type SteckbriefBeispiel = {
  title: string;
  ablauf: string;
  ziel: string;
};

export const STECKBRIEF_BEISPIELE: SteckbriefBeispiel[] = [
  {
    title: "Rechnungseingang",
    ablauf:
      "Ich nehme täglich eingehende Rechnungen aus dem Postfach, prüfe Beträge und trage sie manuell ins ERP ein, damit die Buchhaltung weiterarbeiten kann.",
    ziel:
      "Am Ende liegen freigegebene Buchungssätze im ERP vor, ohne manuelles Abtippen — die Freigabe bleibt bei mir.",
  },
  {
    title: "Kundenanfragen",
    ablauf:
      "Ich nehme eingehende Kundenanfragen per E-Mail, recherchiere Antworten in drei Systemen und antworte einzeln, damit keine Anfrage offen bleibt.",
    ziel:
      "Am Ende liegt ein Antwortentwurf vor, ohne dass ich in jedem System suchen muss — Versand und Tonfall prüfe ich selbst.",
  },
];

export const STECKBRIEF_FIELDS: {
  key: keyof Pick<FallBrief, "problem" | "ziel">;
  label: string;
  hint: string;
  placeholder: string;
  required: boolean;
}[] = [
  {
    key: "problem",
    label: FELD_ABLAUF.label,
    hint: FELD_ABLAUF.hint,
    placeholder: FELD_ABLAUF.placeholder,
    required: true,
  },
  {
    key: "ziel",
    label: FELD_ZIEL.label,
    hint: FELD_ZIEL.hint,
    placeholder: FELD_ZIEL.placeholder,
    required: true,
  },
];
