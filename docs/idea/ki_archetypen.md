# KI-Automatisierungs-Archetypen — Referenz für Klarsicht v2

*Grundlage für die geplante v2-Funktion „Prozess → Archetyp-Zuordnung". Das Tool ordnet einen beschriebenen Arbeitsprozess einem dieser Muster zu und zeigt dessen typische Voraussetzungen, Nutzen und Fallstricke — statt eine freie „Ein-Klick-Lösung" zu erfinden.*

*Framing-Regel (verbindlich): Das Tool präsentiert keine „fertige Lösung", sondern ordnet ein und zeigt Beispielrichtungen. Formulierung immer im Konjunktiv/Beispielmodus („So könnte KI solche Prozesse typischerweise automatisieren"), nie als Autoritätsaussage.*

---

## Warum genau diese Archetypen

Praktisch jeder wissensbasierte Büroprozess lässt sich auf eine überschaubare Zahl wiederkehrender Muster zurückführen. Die Zuordnung „welcher Archetyp?" ist für ein LLM eine verlässliche Klassifikationsaufgabe (fehlerärmer als freie Lösungsgenerierung). Jeder Archetyp verrät bereits viel über die Klarsicht-Scoring-Kriterien — Datenverfügbarkeit, technische Einfachheit, Risiko — und speist damit direkt die Bewertung.

---

## 1. Klassifikation / Triage

**Was:** Eingehende Objekte einsortieren, priorisieren und weiterleiten.

**Typische Prozesse:** E-Mail-Routing, Ticket-Kategorisierung im Support, Beschwerde-Weiterleitung, Bewerbungs-Vorsortierung, Eingangspost-Verteilung.

**Voraussetzungen:** Klar definierte Kategorien; genug Beispiele, um die Kategorien eindeutig zu machen; ein Anschluss-System, an das weitergeleitet wird (Postfach, Ticketsystem).

**Nutzen:** Hoch bei großen Mengen gleichartiger Eingänge — spart Sichtungszeit, beschleunigt Reaktionszeiten. Einer der zuverlässigsten und am schnellsten wirksamen Archetypen.

**Fallstricke:** Grenzfälle und neue, unbekannte Kategorien werden falsch einsortiert. Braucht einen Eskalations-/Unsicherheitspfad („weiß nicht → an Mensch"). Fehlklassifikation kann teuer sein, wenn Dringendes falsch einsortiert wird.

**Bezug zum Scoring:** Meist hohe Machbarkeit und Datenverfügbarkeit; Risiko moderat (abhängig von Fehlerfolgen).

---

## 2. Extraktion

**Was:** Strukturierte Daten aus unstrukturierten Dokumenten herausziehen.

**Typische Prozesse:** Rechnungsdaten erfassen, Vertragsklauseln auslesen, Formulare digitalisieren, Stammdaten aus E-Mails übernehmen, Lieferscheine verarbeiten.

**Voraussetzungen:** Definierte Zielfelder (was genau soll extrahiert werden?); lesbare Quelldokumente (bei Scans zusätzlich OCR); ein Zielsystem, in das die Daten fließen.

**Nutzen:** Sehr hoch bei repetitiver, fehleranfälliger manueller Datenerfassung — klassischer „Quick Win" mit messbarer Zeitersparnis.

**Fallstricke:** Uneinheitliche Dokumentformate senken die Trefferquote; Zahlen/Beträge müssen validiert werden (ein falsch extrahierter Rechnungsbetrag ist gravierend). Braucht Prüfschritt bei kritischen Feldern.

**Bezug zum Scoring:** Hohe Häufigkeit typisch; Machbarkeit hängt stark an der Dokumentqualität; Risiko steigt mit der Kritikalität der Felder (Finanzdaten).

---

## 3. Zusammenfassung

**Was:** Lange Inhalte auf das Wesentliche verdichten.

**Typische Prozesse:** Meeting-Protokolle, Zusammenfassung langer E-Mail-Verläufe, Verdichtung von Berichten/Studien, Gesprächsnotizen aus Telefonaten.

**Voraussetzungen:** Zugang zum Ausgangsmaterial (Transkript, Text); Klarheit, worauf die Zusammenfassung abzielt (Entscheidungen? Aufgaben? Kernaussagen?).

**Nutzen:** Solide Zeitersparnis, niedrige Einstiegshürde, geringes Risiko — gut geeignet als erster, sichtbarer KI-Erfolg im Unternehmen.

**Fallstricke:** Weglassen relevanter Nuancen; bei sensiblen Inhalten (Personalgespräche) Vertraulichkeit beachten. Qualität schwankt mit der Länge/Struktur des Ausgangsmaterials.

**Bezug zum Scoring:** Meist hohe Machbarkeit, niedriges Risiko — aber oft auch nur mittlerer strategischer Hebel.

---

## 4. Entwurf / Generierung

**Was:** Erste Textentwürfe erstellen, die ein Mensch prüft und finalisiert.

**Typische Prozesse:** Antwortentwürfe im Kundenservice, Angebots-/Anschreiben-Vorlagen, Produktbeschreibungen, Stellenanzeigen, Social-Media-Texte.

**Voraussetzungen:** Kontext/Vorgaben (Tonalität, Bausteine, Fakten); ein fester Freigabeschritt durch einen Menschen (human-in-the-loop).

**Nutzen:** Beschleunigt den Start („leeres Blatt" entfällt); besonders wirksam, wo viele ähnliche Texte entstehen.

**Fallstricke:** Höchstes Halluzinationsrisiko dieses Archetyps — erfundene Fakten, falsche Zusagen. Ohne menschliche Freigabe nicht einsetzbar, wenn der Text nach außen geht. Gefahr uniformer, generischer Ergebnisse.

**Bezug zum Scoring:** Machbarkeit hoch, aber Risiko systematisch erhöht (externe Wirkung) — hier ist der Klarsicht-Risiko-Tag besonders relevant.

---

## 5. Wissensabruf / RAG (Retrieval-Augmented Generation)

**Was:** Fragen auf Basis eines definierten Dokumentenbestands beantworten — mit Beleg statt aus dem allgemeinen Modellwissen.

**Typische Prozesse:** Interner Wissensassistent (Richtlinien, Handbücher), Onboarding-Fragen neuer Mitarbeiter, technischer Support aus Produktdokumentation, Nachschlagen in Verträgen/Normen.

**Voraussetzungen:** Ein gepflegter, zugänglicher, aktueller Dokumentenbestand — die wichtigste und oft unterschätzte Bedingung. „Müll rein, Müll raus" gilt hier besonders.

**Nutzen:** Hoch, wenn Wissen verstreut und schwer auffindbar ist; reduziert Rückfragen und Einarbeitungszeit.

**Fallstricke:** Höherer Bauaufwand als die anderen Archetypen (Dokumente aufbereiten, indexieren, aktuell halten). Veraltete Quellen führen zu falschen Antworten. Ohne Quellenangabe sinkt das Vertrauen.

**Bezug zum Scoring:** Oft hoher strategischer Wert, aber niedrigere technische Einfachheit — typischer „komplexer Fall mit Potenzial" in der Wert-/Machbarkeits-Matrix.

---

## 6. Transformation

**Was:** Inhalte von einem Format/Stil in ein anderes überführen — Bedeutung bleibt, Form ändert sich.

**Typische Prozesse:** Übersetzung, Umschreiben in einfache Sprache, Fachtext → Kundentext, Umwandlung in ein festes Vorlagenformat, Tonalitätsanpassung.

**Voraussetzungen:** Klare Regeln für Ziel-Format/-Stil; Ausgangsmaterial in verarbeitbarer Form.

**Nutzen:** Zuverlässig und risikoarm, solange die Bedeutung erhalten bleibt; gut skalierbar bei wiederkehrenden Formatwechseln.

**Fallstricke:** Bei Fachsprache (Recht, Medizin, Technik) können Bedeutungsfehler entstehen, die für Laien unsichtbar sind. Prüfschritt bei kritischen Domänen nötig.

**Bezug zum Scoring:** Meist hohe Machbarkeit, geringes bis mittleres Risiko — abhängig von der Fachlichkeit des Inhalts.

---

## 7. Abgleich / Empfehlung (Matching)

**Was:** Objekte einander zuordnen oder die passendste Option aus vielen vorschlagen.

**Typische Prozesse:** Bewerber zu Stellen matchen, Produktempfehlungen, passende Ansprechpartner/Experten finden, ähnliche Fälle/Dokumente zuordnen, Lieferanten-Vorauswahl.

**Voraussetzungen:** Zwei klar beschriebene Seiten (was wird womit gematcht?); definierte Kriterien für „passend"; ausreichende Datenbasis auf beiden Seiten.

**Nutzen:** Hoch, wenn manuelles Zuordnen aufwändig ist und die Kriterien sich gut beschreiben lassen.

**Fallstricke:** Verzerrungen (Bias) — besonders heikel bei Personen (Bewerber-Matching kann diskriminieren, AI-Act-relevant). Erklärbarkeit der Empfehlung ist oft schwierig. Ergebnisse als Vorschlag, nicht als Entscheidung behandeln.

**Bezug zum Scoring:** Machbarkeit mittel; Risiko potenziell hoch bei Personenbezug — hier greift der Risiko-Tag bis hin zu „inakzeptabel" (AI Act, Hochrisiko-Bereiche wie Personalauswahl).

---

## Querschnitts-Hinweise für die Funktion

- **Mehrfachzuordnung ist normal:** Viele reale Prozesse kombinieren Archetypen (z. B. Extraktion → Klassifikation → Entwurf). Die Funktion sollte den *dominanten* Archetyp nennen und Kombinationen zulassen, statt auf genau einen zu zwingen.
- **Der Archetyp ist der Türöffner zum Scoring:** Sobald das Muster feststeht, lassen sich Datenanforderung, technische Einfachheit und Risiko grob ableiten — die Funktion kann also einen Vorschlag für die Bewertung anbieten, den der Nutzer bestätigt oder korrigiert (passt zum „Fakten statt Noten"-Prinzip).
- **Human-in-the-loop als Standard kommunizieren:** Bei allen Archetypen mit Außenwirkung (Entwurf, Matching) gehört der menschliche Freigabeschritt in die Beispielrichtung — das ist zugleich ein zentrales DSGVO-/AI-Act-Argument für den Mittelstand.

---

## Roadmap-Einordnung

Diese Funktion ist **nicht Teil von v1**. Der Kern (Fälle finden, „Fakten statt Noten", Scoring, Ranking) muss zuerst stehen und sich bewähren. Die Archetyp-Zuordnung ist ein starker Differenzierer für **v2** — ausschließlich in dieser einordnenden Beispiel-Form mit ehrlichem Framing, nicht als „KI löst deinen Prozess".

**Vor dem Bau offen (per Test zu klären):** ob Zielnutzer die Vorschläge als hilfreiche Anregung oder als bevormundend empfinden. Ließe sich mit wenigen echten Prozessbeschreibungen und Rückmeldung von Zielnutzern klären.
