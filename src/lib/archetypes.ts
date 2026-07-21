export const ARCHETYP_IDS = [
  "klassifikation",
  "extraktion",
  "zusammenfassung",
  "entwurf",
  "wissensabruf",
  "transformation",
  "matching",
] as const;

export type ArchetypId = (typeof ARCHETYP_IDS)[number];

export type ArchetypReference = {
  label: string;
  was: string;
  typischeProzesse: string;
  voraussetzungen: string;
  nutzen: string;
  fallstricke: string;
  risikoprofil: string;
  scoringHinweise: string;
};

export const ARCHETYPEN: Record<ArchetypId, ArchetypReference> = {
  klassifikation: {
    label: "Klassifikation / Triage",
    was: "Eingehende Objekte einsortieren, priorisieren, weiterleiten.",
    typischeProzesse:
      "E-Mail-Routing, Ticket-Kategorisierung, Beschwerde-Weiterleitung, Bewerbungs-Vorsortierung, Eingangspost-Verteilung.",
    voraussetzungen: "Klar definierte Kategorien; genug Beispiele; ein Anschluss-System.",
    nutzen: "Hoch bei großen Mengen gleichartiger Eingänge.",
    fallstricke:
      "Grenzfälle/neue Kategorien werden falsch einsortiert; braucht Eskalationspfad.",
    risikoprofil: "Moderat — Fehlrouting kann Verzögerungen verursachen.",
    scoringHinweise: "Meist hohe Machbarkeit und Datenverfügbarkeit.",
  },
  extraktion: {
    label: "Extraktion",
    was: "Strukturierte Daten aus unstrukturierten Dokumenten herausziehen.",
    typischeProzesse:
      "Rechnungsdaten, Vertragsklauseln, Formulare, Stammdaten aus E-Mails, Lieferscheine.",
    voraussetzungen: "Definierte Zielfelder; lesbare Quelldokumente (ggf. OCR); Zielsystem.",
    nutzen: "Sehr hoch bei repetitiver, fehleranfälliger Datenerfassung.",
    fallstricke:
      "Uneinheitliche Formate senken Trefferquote; kritische Felder brauchen Prüfschritt.",
    risikoprofil: "Steigt mit Kritikalität der extrahierten Felder.",
    scoringHinweise: "Hohe Häufigkeit typisch; Machbarkeit hängt an Dokumentqualität.",
  },
  zusammenfassung: {
    label: "Zusammenfassung",
    was: "Lange Inhalte auf das Wesentliche verdichten.",
    typischeProzesse:
      "Meeting-Protokolle, E-Mail-Verläufe, Berichte/Studien, Gesprächsnotizen.",
    voraussetzungen: "Zugang zum Ausgangsmaterial; Klarheit über das Ziel der Zusammenfassung.",
    nutzen: "Solide Zeitersparnis, niedrige Einstiegshürde, geringes Risiko.",
    fallstricke: "Weglassen relevanter Nuancen; Vertraulichkeit bei sensiblen Inhalten.",
    risikoprofil: "Meist gering bis überschaubar.",
    scoringHinweise: "Meist hohe Machbarkeit, oft nur mittlerer strategischer Hebel.",
  },
  entwurf: {
    label: "Entwurf / Generierung",
    was: "Erste Textentwürfe, die ein Mensch prüft und finalisiert.",
    typischeProzesse:
      "Antwortentwürfe Kundenservice, Angebots-/Anschreiben-Vorlagen, Produktbeschreibungen, Stellenanzeigen.",
    voraussetzungen: "Kontext/Vorgaben (Tonalität, Fakten); fester Freigabeschritt durch Menschen.",
    nutzen: "Beschleunigt den Start; wirksam bei vielen ähnlichen Texten.",
    fallstricke:
      "Halluzinationsrisiko; ohne Freigabe nicht einsetzbar, wenn Text nach außen geht.",
    risikoprofil: "Erhöht bei externer Wirkung — Freigabe durch Menschen zwingend.",
    scoringHinweise: "Machbarkeit hoch, Risiko systematisch erhöht.",
  },
  wissensabruf: {
    label: "Wissensabruf / RAG",
    was: "Fragen auf Basis eines definierten Dokumentenbestands beantworten, mit Beleg.",
    typischeProzesse:
      "Interner Wissensassistent, Onboarding-Fragen, technischer Support aus Doku, Nachschlagen in Verträgen.",
    voraussetzungen: "Gepflegter, zugänglicher, aktueller Dokumentenbestand.",
    nutzen: "Hoch, wenn Wissen verstreut/schwer auffindbar ist.",
    fallstricke: "Höherer Bauaufwand; veraltete Quellen → falsche Antworten.",
    risikoprofil: "Abhängig von Quellenqualität und Sensibilität der Inhalte.",
    scoringHinweise: "Oft hoher strategischer Wert, aber niedrigere technische Einfachheit.",
  },
  transformation: {
    label: "Transformation",
    was: "Inhalte von einem Format/Stil in ein anderes überführen.",
    typischeProzesse:
      "Übersetzung, Umschreiben in einfache Sprache, Fachtext → Kundentext, Tonalitätsanpassung.",
    voraussetzungen: "Klare Regeln für Ziel-Format/-Stil; verarbeitbares Ausgangsmaterial.",
    nutzen: "Zuverlässig, risikoarm, gut skalierbar bei wiederkehrenden Formatwechseln.",
    fallstricke: "Bei Fachsprache unsichtbare Bedeutungsfehler möglich.",
    risikoprofil: "Meist gering bis mittel, abhängig von Fachlichkeit.",
    scoringHinweise: "Meist hohe Machbarkeit.",
  },
  matching: {
    label: "Abgleich / Empfehlung (Matching)",
    was: "Objekte einander zuordnen oder die passendste Option vorschlagen.",
    typischeProzesse:
      "Bewerber-Matching, Produktempfehlungen, Experten-Suche, ähnliche Fälle, Lieferanten-Vorauswahl.",
    voraussetzungen:
      "Zwei klar beschriebene Seiten; definierte Passungs-Kriterien; ausreichende Datenbasis.",
    nutzen: "Hoch, wenn manuelles Zuordnen aufwändig ist.",
    fallstricke:
      "Bias-Risiko bei Personenbezug (AI-Act-relevant); Ergebnis als Vorschlag, nicht Entscheidung.",
    risikoprofil: "Potenziell hoch bis inakzeptabel bei Personenbezug.",
    scoringHinweise: "Machbarkeit mittel; Risiko besonders bei Personalentscheidungen.",
  },
};

export function isArchetypId(value: string): value is ArchetypId {
  return (ARCHETYP_IDS as readonly string[]).includes(value);
}

export function buildArchetypPromptBlock(): string {
  return ARCHETYP_IDS.map((id) => {
    const a = ARCHETYPEN[id];
    return `### ${id} (${a.label})
Was: ${a.was}
Typische Prozesse: ${a.typischeProzesse}
Voraussetzungen: ${a.voraussetzungen}
Nutzen: ${a.nutzen}
Fallstricke: ${a.fallstricke}
Risikoprofil: ${a.risikoprofil}`;
  }).join("\n\n");
}
