/** Nutzertexte zur Score-Einordnung (Ergebnis-Screen). */

export const SCORE_BAND_LABEL = {
  high: "hoch",
  mid: "im Mittelfeld",
  low: "niedrig",
} as const;

export const GESAMT_SCORE_HELP = {
  meaning:
    "Der Gesamt-Score fasst Nutzen und Machbarkeit zu einer Priorität zusammen — zum Vergleichen deiner Fälle, keine Schulnote.",
  formula: "So rechnen wir: 60 % Nutzen-Score + 40 % Machbarkeits-Score.",
} as const;

export const NUTZEN_SCORE_HELP = {
  meaning:
    "Wie stark der Fall heute Arbeitszeit und Wirkung bindet. Ein hoher Wert heißt: Automatisierung würde spürbar entlasten.",
  formula:
    "So rechnen wir: 70 % gebundene Arbeitszeit + 30 % Reichweite der Auswirkung.",
} as const;

export const MACHBARKEIT_SCORE_HELP = {
  meaning:
    "Wie gut Daten und Ablauf heute schon für Automatisierung taugen. Ein niedriger Wert heißt: erst vorbereiten, dann leicht umsetzen.",
  formula:
    "So rechnen wir: 50 % Datenverfügbarkeit + 50 % Wiederholbarkeit des Ablaufs.",
} as const;

/** Kurzer Nachsatz zur Lesart unter dem Gesamt-Score — abhängig vom Quadranten. */
export const GESAMT_SCORE_LESART_TAIL = {
  high: "hoher Nutzen und gut machbar — guter Startpunkt",
  mid: "starker Nutzen, aber die Umsetzung braucht noch Vorbereitung",
  accent: "leicht machbar, aber begrenzter Hebel",
  neutral: "aktuell weder großer Hebel noch leicht machbar",
} as const;
