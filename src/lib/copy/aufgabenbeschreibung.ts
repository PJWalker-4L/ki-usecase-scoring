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
    "Beschreiben Sie einen konkreten Arbeitsprozess von Anfang bis Ende. Womit fangen Sie an, was machen Sie damit, und was liegt am Ende vor? Denken Sie an das letzte Mal, als Sie das gemacht haben. Die Satzschablone hilft beim ersten Satz.",
  schabloneLabel: "Satzschablone für den Ablauf:",
  beispieleToggle: "Zwei ausgefüllte Beispiele ansehen",
  beispielAblaufLabel: "Aktueller Ablauf:",
  beispielZielLabel: "Ziel:",
  loeschen: "Steckbrief löschen",
} as const;

export const FELD_ABLAUF = {
  label: "Aktueller Ablauf",
  hint: "Beschreiben Sie den heutigen Durchlauf: Input, Arbeit, Zwischenergebnis.",
  placeholder:
    "Ich nehme eingehende Rechnungen, prüfe Beträge und trage sie ins ERP ein, damit die Buchhaltung weiterarbeiten kann.",
} as const;

export const FELD_ZIEL = {
  label: "Was soll nach der Automatisierung vorliegen?",
  kurzLabel: "Ziel",
  hint: "Was soll nach der Automatisierung anders sein als heute — und kurz: was übernimmt die KI, was bleibt in Ihrer Verantwortung?",
  placeholder:
    "Freigegebene Buchungssätze liegen im ERP vor. Übernehmen soll die KI das Abtippen und Zuordnen; bei mir bleibt die Freigabe.",
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
    title: "Eingangsrechnungen",
    ablauf:
      "Ich nehme die Eingangsrechnungen aus dem Mailpostfach, trage Betrag, Lieferant und Kostenstelle in die Tabelle ein und lege die PDFs im Ordner ab, damit die Buchhaltung am Monatsende alles beisammen hat.",
    ziel:
      "Die Tabelle liegt am Monatsende vollständig vor, ohne dass jemand jede Rechnung einzeln abtippt. Übernehmen soll die KI das Auslesen der Werte aus dem PDF und den Eintrag in die Tabelle; bei mir bleibt die Freigabe strittiger Beträge.",
  },
  {
    title: "Lieferavis-Abgleich",
    ablauf:
      "Ich nehme die Lieferavise der Spediteure aus Mail und Fax, gleiche sie mit den Bestellungen im ERP ab und melde Abweichungen an den Einkauf, damit die Fertigung weiß, was wirklich ankommt.",
    ziel:
      "Jeden Morgen liegt eine Liste der Abweichungen vor, ohne dass jemand die Avise einzeln durchgeht. Übernehmen soll die KI den Abgleich und das Markieren der Abweichungen; bei mir bleibt die Entscheidung, wen ich anrufe.",
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
