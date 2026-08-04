# KLARSICHT — Konzeptzusammenfassung

*Stand: 31. Juli 2026 — dieses Dokument ist die verbindliche Quelle der Wahrheit für die Weiterentwicklung des KI Use Case Scoring Tools (Projektname: **KLARSICHT**, früher KIST). Änderungen an der Bewertungslogik seit dem Ursprungsstand (17. Juli 2026) sind in `klarsicht_scoring_aenderungen.md` nachgewiesen; die Umsetzung in Code und UI folgt der Checkliste dort.*

---

## 1. Das Problem

Mittelstandsteams sollen entscheiden, welche KI-Anwendungsfälle sie zuerst angehen — können aber allein keine vertrauenswürdige, vergleichbare Priorisierung erzeugen. Das Problem zerfällt in zwei Teile, die im aktuellen Prototyp miteinander verschmolzen sind:

**1.1 Fälle finden.** Der nicht-analytische Fachbereichsmitarbeiter steht vor einem leeren Namensfeld und weiß nicht, was überhaupt ein „Use Case" ist oder wie er einen benennt. Das bestehende Bewertungsraster setzt voraus, dass dieser Schritt schon an anderer Stelle passiert ist — er tut es aber nicht.

**1.2 Fälle bewerten.** Das Tool verlangt abstrakte Selbstnoten auf einer Skala (z. B. 1–5) für Kriterien wie „strategische Relevanz". Der Nutzer muss sein stilles Alltagswissen selbst in eine Note übersetzen — das ist die eigentliche Zumutung. Zwei Personen meinen mit „4" oft Verschiedenes; die Werte sind kaum vergleichbar und lassen sich leicht schönrechnen.

**Wurzelursache:** Das Tool lädt die analytische Übersetzungsleistung genau der Person auf, die sie am wenigsten mitbringt, und geht implizit davon aus, dass ein Moderator die Lücke füllt. In einem Werkzeug, das auch ohne Moderator laufen soll, liegt diese Lücke offen zutage.

**Warum bestehende Lösungen zu kurz greifen:**
- **Berater-Excel und generische Scoring-Frameworks** sind von Analytikern für Analytiker gebaut. Sie brauchen eine moderierende Hand, helfen nicht beim *Finden* der Fälle, und ihre Zahlen suggerieren eine Vergleichbarkeit, die real nicht besteht.
- **Papiervorlagen** (z. B. das KI.NRW-Use-Case-Template) bieten gute Leitfragen, sind aber statisch: kein Live-Ranking, kein Selbstbedienungsmodus, ohne Workshop kaum nutzbar.
- **Der bisherige KLARSICHT-Prototyp** (früher KIST) sieht modern aus, fragte in frühen Ständen aber abstrakte Selbstnoten ab, hatte das Leere-Seite-Problem und vermischte Finden und Bewerten in einem Schritt.
- **Bauchgefühl / informelle Priorisierung** führt zu fehlender Nachvollziehbarkeit und dazu, dass sich Priorität nach Hierarchie statt nach Substanz richtet.

**Warum das Problem zählt:**
- **Für das Unternehmen:** Ohne reibungsarme, glaubwürdige Priorisierung stockt die KI-Initiative (Analyse-Lähmung vor der leeren Seite) oder startet mit dem falschen Fall (lauteste Stimme statt bester Hebel). Beides verbrennt knappe Ressourcen und gefährdet das Momentum, das über die gesamte KI-Einführung entscheidet.
- **Für den Buy-in:** Bewerten die Fachleute nicht selbst und ehrlich, tragen sie die daraus resultierende Roadmap auch nicht mit — der eigentliche Zweck des Workshops verpufft.
- **Für den Berater (Sebastian):** Das Tool ist Kompetenznachweis. Liefert es nicht-vergleichbare, angreifbare Zahlen oder muss bei jeder Eingabe an die Hand genommen werden, scheitert es doppelt — als methodischer Beleg gegenüber Auftraggebern und als übergabefähiges Instrument, das beim Kunden bleiben kann.

---

## 2. Die Zielgruppe

Es gibt eine bewusste Zweiteilung zwischen wer das Tool mitbringt/besitzt und wer die Dateneingabe tatsächlich vornimmt. Diese Trennung ist zentral und darf nicht verwischt werden — der Komfort der einen Seite darf nicht die Verständlichkeit für die andere kosten.

**2.1 Zielkunde / Eigentümer: der KI-Berater im Mittelstand** (Archetyp: Sebastian selbst)
Bringt das Tool in Beratungsprojekte mit. Braucht ein Instrument, das sowohl im moderierten Workshop überzeugt als auch eigenständig beim Kunden funktioniert, wenn kein Moderator im Raum ist. Hat hohes methodisches Verständnis und erkennt sofort den Wert vergleichbarer, faktenbasierter Bewertungen.

**2.2 Kritischer Eingabe-Nutzer: der Fachbereichsleiter/-mitarbeiter im produzierenden Mittelstand** (z. B. Fertigung, Logistik, Auftragsabwicklung)
Kennt seinen Prozess im Detail, ist aber weder analytisch geschult noch KI-affin. Denkt konkret („das Sortieren frisst jeden Dienstag zwei Stunden"), nicht in abstrakten Kategorien wie „strategische Relevanz = 4". Hoher Leidensdruck bei repetitiven Prozessen, aber auf ein Werkzeug angewiesen, das ihn ohne Vorwissen durch die Bewertung führt.

**2.3 Weitere Rolle: die Führungskraft**
Legt den Adoption-Faktor separat im Vier-Augen-Gespräch fest (nicht im Fachbereichs-Workshop, da offene Ablehnung dort selten zugegeben wird). Konsumiert primär die fertige Prioritätenliste, bedient das Tool kaum selbst.

**2.4 Offener Punkt — noch nicht final entschieden:**
Möglicherweise wird es zwei Nutzerrollen in der Anwendung geben: einen Admin-Modus (z. B. für Sebastian) mit Zusatzfunktionen wie Datenexport, und einen eingeschränkteren Modus für reguläre Nutzer ohne diese Funktionen. Diese Rollentrennung ist als Idee festgehalten, aber noch nicht beschlossen und fließt erst bei der Umsetzung ein, wenn sie final entschieden ist.

---

## 3. Die Lösung

**Lösungsstatement:**
Ich baue ein geführtes Priorisierungs-Werkzeug, das KI-Berater und ihre Mittelstandskunden gemeinsam zu einer belastbaren, gemeinsam getragenen Reihenfolge ihrer KI-Anwendungsfälle bringt — indem es nach konkreten Alltagsfakten fragt statt nach abstrakten Noten und so den Moderator dort ersetzt, wo keiner im Raum ist.

**Der Kern des Werts:**
Der eigentliche Gewinn ist nicht die Punktzahl, sondern ein Gespräch mit klarem Ergebnis, das alle mittragen. Das Werkzeug fragt in der Sprache der Nutzer — „Wie oft macht ihr das? Wie lange dauert es? Wer merkt es, wenn die Aufgabe liegen bleibt? Liegen die Daten sauber vor?" — und leitet die Bewertung selbst daraus ab, statt eine abstrakte Selbstnote zu verlangen. So entsteht eine Reihenfolge, auf die sich das Team einigt, weil sie aus nachvollziehbaren Fakten kommt und nicht aus dem Bauchgefühl der lautesten Abteilung.

Für den Fachbereichsmitarbeiter heißt das: Er kann etwas beitragen, ohne KI zu verstehen oder sich analytisch verbiegen zu müssen. Für den Berater heißt es: ein Ergebnis, das vor erfahrenen Ansprechpartnern standhält und das er beim Kunden lassen kann, ohne dass es ohne ihn zusammenbricht.

**Warum der Ansatz die Mühe wert ist:**
Der entscheidende Unterschied zu bestehenden Lösungen ist eine bewusste Verlagerung: Nicht der Mensch übersetzt sein Wissen in eine Note, sondern das Werkzeug übersetzt seine Antworten in die Bewertung. Das macht Ergebnisse zwischen Personen und Abteilungen erst vergleichbar, senkt die Einstiegshürde für genau die Person, die den Prozess am besten kennt, und löst das Doppel-Modus-Problem an der Wurzel: Ein Werkzeug, das seine eigenen Fragen stellt und einordnet, funktioniert im moderierten Workshop und allein am Schreibtisch — weil die Führung im Werkzeug steckt, nicht im Moderator.

---

## Bewertungsablauf und Scoring (Stand v1)

Dieser Abschnitt fasst den verbindlichen Stand der Bewertungslogik zusammen — abgestimmt mit `klarsicht_scoring_aenderungen.md`. **Rechenlogik:** ausschließlich `computeScores()` in `src/lib/scoring.ts`; keine zweite Berechnungsstelle, keine Umrechnung in Geld.

### Was unverändert ist (Abgrenzung)

- Die **sechs inhaltlichen Bewertungskriterien** bleiben: Häufigkeit, Dauer pro Vorgang, Anzahl beteiligter Personen, **Auswirkung** (vormals „strategische Relevanz"), Datenverfügbarkeit, Wiederholbarkeit.
- Die **Formel für die gebundene Arbeitszeit** bleibt: Häufigkeit × Dauer × Personenzahl → Std./Monat (Anzeige gerundet, intern ungerundet).
- **Dauer, Personen, Datenverfügbarkeit, Wiederholbarkeit** haben inhaltlich dieselben Skalen wie im Ursprungskonzept (Wiederholbarkeit: Immer gleich / Meist gleich / Stark unterschiedlich).

### Fragenzählung im Ablauf — 7 statt 6 (reine Anzeige)

**Ablauf:** Steckbrief → Beispielrichtungen → sechs Bewertungsfragen → Risiko → Ergebnis.

Der **Steckbrief zählt als Frage 1 von 7**; die sechs Bewertungsfragen sind Frage 2 bis 7. Beispielrichtungen und Ergebnis tragen keine Nummer. Der Steckbrief fließt **nicht** in `computeScores()` ein (explizit in der UI ausgewiesen). Das ist eine Zähl- und Anzeigefrage, keine Änderung der Rechenlogik.

### Häufigkeit — Monatswerte je Stufe

Jede Auswahlstufe hat einen festen **`perMonth`-Faktor** in `scoring.ts`. Die rechte Spalte in der UI wird daraus abgeleitet (`formatFrequencyPerMonth`) — **eine Quelle** für Anzeige und Berechnung, damit „ca. 20×/Monat" und gebundene Arbeitszeit nicht auseinanderlaufen.

| Stufe | `perMonth` (Rechenwert) | Anzeige |
|---|---:|---|
| Mehrmals täglich | 40 | ca. 40×/Monat |
| Täglich | 20 | ca. 20×/Monat |
| Mehrmals pro Woche | 12 | ca. 12×/Monat |
| Wöchentlich | 4 | ca. 4×/Monat |
| Monatlich | 1 | ca. 1×/Monat |
| Seltener als monatlich | 0,3 | unter 1×/Monat |

Basis der Faktoren: ca. 20 Arbeitstage pro Monat. Korridor-Anzeigen (z. B. „40–100×") sind verworfen — sie wichen von den Rechenwerten ab.

### Auswirkung (vormals „strategische Relevanz") — vier Stufen, Reichweite

Statt abstrakter Selbsteinschätzung („große / geringe / indirekte Auswirkungen") gilt eine **beobachtbare Reichweitenfrage:**

**„Wer merkt es, wenn diese Aufgabe liegen bleibt?"**

1. Eine Frist oder Prüfung hängt daran (Behörde, Wirtschaftsprüfung, Zertifizierung, vertraglicher Termin)
2. Kunden oder Lieferanten
3. Andere Abteilungen
4. Nur unser eigenes Team

Die Zuordnung Stufe → Punktwert in `computeScores()` ist neu (vier statt drei Stufen). Stufe 1 fließt **nur in den Nutzen-Score** ein, nicht in den Risiko-Tag (siehe Abgrenzung unten).

### Risiko-Tag — eigene Frage, Abgrenzung zu „Auswirkung"

Der Risiko-Tag ist **kein** siebtes Scoring-Kriterium mit eigener Skala, sondern Metadaten mit Auswirkung auf die **Priorisierung** (bei „inakzeptabel" wird der Fall ausgeschlossen).

**Fragetext (verbindlich):** „Was passiert, wenn die Automatisierung einen Fehler macht?" — nicht „Wie riskant ist diese Aufgabe?", damit keine Doppelabfrage mit „Auswirkung" entsteht.

| | Auswirkung | Risiko-Tag |
|---|---|---|
| Fragt nach | Folgen, wenn die Aufgabe **liegen bleibt** | Folgen, wenn die **KI einen Fehler macht** |
| Gilt auch ohne KI-Einsatz | ja | nein |
| Wirkt auf | Nutzen-Score (hebt) | Priorisierung / Ausschluss (bremst; bei inakzeptabel: null) |

**Stufen:** gering / überschaubar / hoch / inakzeptabel — in v1 mit KI-VO-nahen Klammerzusätzen in der Auswahl (minimales / begrenztes / Hochrisiko / verboten), **ohne** Compliance-Zusage im Nutzertext.

**Kontext-Hinweis in der UI:** Wenn zuvor die Frist-Stufe bei „Auswirkung" gewählt wurde, erklärt ein Hinweistext, dass hohe Auswirkung und hohes Automatisierungsrisiko getrennt zu bewerten sind.

### Gebundene Arbeitszeit — Sichtbarmachung (v1)

Der Wert aus Häufigkeit × Dauer × Personen wird als **gebundene Arbeitszeit** (ca. X Std./Monat) neben dem Score angezeigt und persistiert — Ist-Zustand für die Baseline, keine Geldumrechnung. Spezifikation: `klarsicht_v1_zusatzfunktionen.md`. Interner Key in v1: `hoursPerMonth`; v2-Zielfeld: `baselineStunden`. **v2** ergänzt eine Nutzenprognose **pro Beispielrichtung** (Restzeit Y + mögliche Ersparnis X, Konjunktiv) — siehe `klarsicht_v2_prd.md` und ADR-019; die Baseline-Zahl selbst bleibt ohne Ersparnis-Label.

---

## Bereits identifizierte inhaltliche Bausteine (aus KI.NRW-Analyse) — priorisiert für v1 vs. v2

Diese Punkte wurden aus dem Dokument „KI.Schnellstart 2026" (KI.NRW) abgeleitet. Die Einstufung in **wichtig (v1)** und **sekundär (später)** ist verbindlich für die Umsetzungsreihenfolge — v1 soll nur die wichtigen Punkte enthalten.

### Wichtig — Teil von v1

- **Risiko-Tag (minimale Ausprägung).** Auswahlfeld mit den Stufen *gering / überschaubar / hoch / inakzeptabel*, Fragetext und Abgrenzung zu „Auswirkung" siehe Abschnitt „Bewertungsablauf und Scoring". Setzt bei „inakzeptabel" die Priorisierung auf ausgeschlossen (Score bleibt sichtbar, Rangfolge wird gebremst). **Kein** vollwertiges zusätzliches Scoring-Kriterium mit eigener 1–5-Skala. Begründung: Ein hoch bewerteter Fall mit Rechts- oder Fehlerrisiko darf nicht allein wegen guter Machbarkeit oben im Ranking stehen.
- **Strukturierte Kurzbeschreibung pro Anwendungsfall** (drei Felder: Problem/Herausforderung, Lösungsansatz, Ziel/Ergebnis), angelehnt an das KI.NRW-Use-Case-Template — zählt als **Frage 1 von 7**, fließt nicht in den Score ein. Begründung: Struktur gegen die „leere Seite" beim nicht-analytischen Nutzer; passt zum Ansatz „führen statt abstrahieren lassen" (Abschnitt 3).
- **Gebundene Arbeitszeit sichtbar machen.** Kennzahl neben dem Score, aus denselben Faktoren wie die Berechnung; persistiert als Baseline für v2. Keine Geldumrechnung.

### Sekundär — nach v1, nicht Teil des ersten Release

- **Wert-×-Machbarkeit-Matrix** als zweite Ansicht neben dem linearen Ranking (2×2-Quadranten-Darstellung, macht strategische Interpretation sichtbar, z. B. „Quick Win" vs. „komplexer Fall mit Potenzial"). Eigene Visualisierungslogik, löst aber nicht das Kernproblem — daher v1.1.
- **Kundennutzen-Kriterium** als viertes Wert-Kriterium (neben Zeitersparnis, Häufigkeit, Auswirkung). Inhaltlich sinnvoll, aber jedes zusätzliche Kriterium verlängert den Fragenkatalog. Erst nachlegen, wenn der Kernmechanismus sich bewährt hat.
- **Wiedervorlage statt Löschen** — Status-Feld plus Review-Termin für niedrig bewertete oder aktuell nicht machbare Fälle, statt sie zu entfernen. Reines Komfort-/Vollständigkeitsfeature, leicht nachrüstbar, kein Bezug zum Kernmechanismus.

### Explizit nicht v1 — abhängig von noch offener Grundsatzentscheidung

- **Divergenz-Anzeige im Workshop** (sichtbar machen, wenn z. B. zwei Abteilungen bei „Häufigkeit" auf 2 und 5 kommen). Diese Funktion setzt Mehrbenutzer-Fähigkeit voraus — mehrere Personen scoren live denselben Fall. Das ist an die in Abschnitt 2.4 genannte, noch nicht entschiedene Rollenfrage (Admin/Nutzer, Mehrbenutzer-Betrieb) gekoppelt. **Diese Funktion erst angehen, wenn die Rollenfrage entschieden ist** — nicht vorher isoliert bauen.

## Offene Fragen für die nächsten Schritte

- **Umsetzung der Scoring-Änderungen in Code und Texte** — erledigt laut Checkliste in `klarsicht_scoring_aenderungen.md` (Abschnitt 8).
- Schärfung der zwei Personas (Berater und Fachbereichsleiter) im Detail.
- Endgültige Entscheidung zur Admin-/Nutzer-Rollentrennung (Abschnitt 2.4; Voraussetzung u. a. für Fortsetzen unterbrochener Bewertungen in v2, siehe `klarsicht_v2_prd.md`).
