# Prozess-Archetypen — Backend-Klassifikation für Klarsicht v2

*Ersetzt/aktualisiert `ki_archetypen.md`. Zentrale Korrektur gegenüber der Vorversion: Die Archetyp-Klassifikation ist ein **reiner Backend-Mechanismus**, kein User-facing Feature. Der Nutzer sieht niemals ein Archetyp-Label und bestätigt es auch nicht.*

---

## 1. Zweck der Funktion (was der Nutzer eigentlich will)

Der Nutzer beschreibt einen Arbeitsprozess (**Aktueller Ablauf** + **Ziel**, optional **Lösungsansatz**). Die Funktion soll ihm daraufhin **konkrete, plausible Beispielrichtungen zeigen, wie sich dieser Prozess typischerweise automatisieren lässt** — inklusive der typischen Fallstricke. Ein **Risiko-Vorschlag** wird im selben Backend-Schritt berechnet, dem Nutzer aber erst im Risiko-Schritt angezeigt.

Das ist der Zweck. Alles andere in diesem Dokument ist Mittel zu diesem Zweck.

---

## 2. Warum nicht einfach frei generieren lassen

Ein LLM, das ohne Leitplanken gefragt wird „wie automatisiere ich das?", neigt zu genau den Fehlern, die in einem Beratungstool nicht passieren dürfen: erfundene Lösungswege, unterschlagene Voraussetzungen, überzogene Versprechen, unpassende Risikoeinschätzung.

**Die Lösung:** Der beschriebene Prozess wird zuerst einem von 7 bekannten, wiederkehrenden Automatisierungs-Mustern (Archetypen) zugeordnet. Zu jedem Archetyp existiert vorab kuratiertes, geprüftes Wissen (typische Prozesse, Voraussetzungen, Nutzen, Fallstricke, Risikoprofil). Die Ausgabe an den Nutzer wird aus diesem kuratierten Material erzeugt statt komplett frei generiert.

Klassifikation in ein bekanntes Muster ist für ein LLM eine verlässliche, fehlerarme Aufgabe — freie Lösungsgenerierung ist es nicht. Die Archetypen sind der Guardrail, der die Vorschläge erdet.

---

## 3. Zentrale Korrektur gegenüber der Vorversion dieses Dokuments

**Frühere Annahme (verworfen):** Der Nutzer sieht nach der Kurzbeschreibung ein Panel mit dem zugeordneten Archetyp-Label, das er bestätigen oder korrigieren muss, bevor es weitergeht.

**Warum das falsch war:**

- **Widerspricht dem Kernprinzip des Tools.** Klarsicht fragt bewusst nach konkreten Alltagsfakten statt nach abstrakten Kategorien. Ein Archetyp-Label wie „Extraktion" oder „Abgleich/Matching" ist exakt so eine abstrakte Kategorie.
- **Der Nutzer kann das Label gar nicht sinnvoll korrigieren.** Er kennt die Taxonomie nicht.
- **Korrektur funktioniert über den Output, nicht über das Label.** Wenn die Klassifikation danebenliegt, merkt der Nutzer das daran, dass die Beispielrichtungen nicht passen — ein konkretes, fällbares Urteil.
- **Nur Risiko wird vorbelegt, nicht die 6 Faktenfragen.** Der Archetyp liefert interne Scoring-Hinweise (Prompt-/Berater-Notizen), aber **keine vorausgewählten Antworten** im Wizard. Der Nutzer beantwortet alle 6 Scoring-Fragen selbst, ohne Vorauswahl.

---

## 4. Wo die Funktion im Produkt-Flow sitzt

```
Fall beschreiben (Aktueller Ablauf + Ziel, Lösungsansatz optional)
        │
        ▼
[BACKEND Phase 1] Archetyp + Risiko-Vorschlag
        │
        ▼
6 Faktenfragen (ohne Vorbelegung)
        │
        ▼
Risiko beim KI-Einsatz — Vorschlag bestätigen/ändern
        │
        ▼
[BACKEND Phase 2] Beispielrichtungen + Fallstricke
   (mit Fakten, Risiko, Archetyp — inkl. Automatisierungstyp pro Vorschlag)
        │
        ▼
Beispiele für Automatisierungsoptionen anzeigen
        │
        ▼
Ergebnis (+ Speichern / Ranking)
```

**Backend vs. UI beim Risiko:** Risiko-Vorschlag entsteht in **Phase 1** (nach Steckbrief), Anzeige im **Risiko-Schritt**.

**Beispiele:** Erst in **Phase 2** nach allen Fakten und finalem Risiko — damit Datenlage, Wiederholbarkeit und Risiko in die Vorschläge einfließen.

**Bei LLM-Fehler:** Beispiel-Schritt überspringen, Hinweis anzeigen, direkt zu den 6 Fragen. Kein statischer Fallback. Risiko ohne Vorschlag — Nutzer wählt selbst.

**Wichtig:** Der Archetyp taucht in der UI an keiner Stelle als benanntes Label auf. Der einzige Vorbelegungs-Schritt ist das **Risiko** (mit sichtbarem Vorschlag + Begründung ohne Archetyp-Namen).

---

## 5. Die 7 Archetypen (Referenzdaten fürs Backend)

Diese Beschreibungen sind das kuratierte Material, aus dem die Beispielrichtungen und Fallstricke generiert werden. Sie sind Prompt-/Datengrundlage, kein UI-Text. Die „Scoring-Hinweise" sind **interne Heuristiken** für Prompts und Berater-Sicht — **keine** Wizard-Vorbelegung.

### 5.1 Klassifikation / Triage
**Was:** Eingehende Objekte einsortieren, priorisieren, weiterleiten.
**Typische Prozesse:** E-Mail-Routing, Ticket-Kategorisierung, Beschwerde-Weiterleitung, Bewerbungs-Vorsortierung, Eingangspost-Verteilung.
**Voraussetzungen:** Klar definierte Kategorien; genug Beispiele; ein Anschluss-System.
**Nutzen:** Hoch bei großen Mengen gleichartiger Eingänge. Einer der zuverlässigsten Archetypen.
**Fallstricke:** Grenzfälle/neue Kategorien werden falsch einsortiert; braucht Eskalationspfad.
**Scoring-Hinweise (intern):** Meist hohe Machbarkeit und Datenverfügbarkeit; Risiko moderat.

### 5.2 Extraktion
**Was:** Strukturierte Daten aus unstrukturierten Dokumenten herausziehen.
**Typische Prozesse:** Rechnungsdaten, Vertragsklauseln, Formulare, Stammdaten aus E-Mails, Lieferscheine.
**Voraussetzungen:** Definierte Zielfelder; lesbare Quelldokumente (ggf. OCR); Zielsystem.
**Nutzen:** Sehr hoch bei repetitiver, fehleranfälliger Datenerfassung — klassischer Quick Win.
**Fallstricke:** Uneinheitliche Formate senken Trefferquote; kritische Felder brauchen Prüfschritt.
**Scoring-Hinweise (intern):** Hohe Häufigkeit typisch; Machbarkeit hängt an Dokumentqualität; Risiko steigt mit Kritikalität der Felder.

### 5.3 Zusammenfassung
**Was:** Lange Inhalte auf das Wesentliche verdichten.
**Typische Prozesse:** Meeting-Protokolle, E-Mail-Verläufe, Berichte/Studien, Gesprächsnotizen.
**Voraussetzungen:** Zugang zum Ausgangsmaterial; Klarheit über das Ziel der Zusammenfassung.
**Nutzen:** Solide Zeitersparnis, niedrige Einstiegshürde, geringes Risiko — guter erster sichtbarer Erfolg.
**Fallstricke:** Weglassen relevanter Nuancen; Vertraulichkeit bei sensiblen Inhalten.
**Scoring-Hinweise (intern):** Meist hohe Machbarkeit, niedriges Risiko, oft nur mittlerer strategischer Hebel.

### 5.4 Entwurf / Generierung
**Was:** Erste Textentwürfe, die ein Mensch prüft und finalisiert.
**Typische Prozesse:** Antwortentwürfe Kundenservice, Angebots-/Anschreiben-Vorlagen, Produktbeschreibungen, Stellenanzeigen, Social-Media-Texte.
**Voraussetzungen:** Kontext/Vorgaben (Tonalität, Fakten); fester Freigabeschritt durch Menschen.
**Nutzen:** Beschleunigt den Start; wirksam bei vielen ähnlichen Texten.
**Fallstricke:** Höchstes Halluzinationsrisiko des Sets; ohne Freigabe nicht einsetzbar, wenn Text nach außen geht.
**Scoring-Hinweise (intern):** Machbarkeit hoch, Risiko systematisch erhöht (externe Wirkung).

### 5.5 Wissensabruf / RAG
**Was:** Fragen auf Basis eines definierten Dokumentenbestands beantworten, mit Beleg.
**Typische Prozesse:** Interner Wissensassistent, Onboarding-Fragen, technischer Support aus Doku, Nachschlagen in Verträgen/Normen.
**Voraussetzungen:** Gepflegter, zugänglicher, aktueller Dokumentenbestand.
**Nutzen:** Hoch, wenn Wissen verstreut/schwer auffindbar ist.
**Fallstricke:** Höherer Bauaufwand; veraltete Quellen → falsche Antworten.
**Scoring-Hinweise (intern):** Oft hoher strategischer Wert, aber niedrigere technische Einfachheit.

### 5.6 Transformation
**Was:** Inhalte von einem Format/Stil in ein anderes überführen — Bedeutung bleibt, Form ändert sich.
**Typische Prozesse:** Übersetzung, Umschreiben in einfache Sprache, Fachtext → Kundentext, Vorlagenformat, Tonalitätsanpassung.
**Voraussetzungen:** Klare Regeln für Ziel-Format/-Stil; verarbeitbares Ausgangsmaterial.
**Nutzen:** Zuverlässig, risikoarm, gut skalierbar bei wiederkehrenden Formatwechseln.
**Fallstricke:** Bei Fachsprache unsichtbare Bedeutungsfehler möglich.
**Scoring-Hinweise (intern):** Meist hohe Machbarkeit, geringes bis mittleres Risiko.

### 5.7 Abgleich / Empfehlung (Matching)
**Was:** Objekte einander zuordnen oder die passendste Option vorschlagen.
**Typische Prozesse:** Bewerber-Matching, Produktempfehlungen, Ansprechpartner-/Experten-Suche, ähnliche Fälle/Dokumente, Lieferanten-Vorauswahl.
**Voraussetzungen:** Zwei klar beschriebene Seiten; definierte Passungs-Kriterien; ausreichende Datenbasis beidseitig.
**Nutzen:** Hoch, wenn manuelles Zuordnen aufwändig ist und Kriterien beschreibbar sind.
**Fallstricke:** Bias-Risiko bei Personenbezug (AI-Act-relevant); Ergebnis als Vorschlag, nicht Entscheidung.
**Scoring-Hinweise (intern):** Machbarkeit mittel; Risiko potenziell hoch bis inakzeptabel bei Personenbezug.

---

## 6. Backend-Verarbeitung

**Phase 1** (nach Steckbrief):

1. **Input:** `ablauf` (Pflicht), `ziel` (Pflicht), `loesung` (optional).
2. **LLM-Call** liefert JSON:
   - `archetypId` — dominanter Archetyp (optional Nebenarchetypen intern)
   - `risikoVorschlag.stufe` — `gering` | `ueberschaubar` | `hoch` | `inakzeptabel`
   - `risikoVorschlag.begruendung` — Alltagssprache, **ohne** Archetyp-Namen

**Phase 2** (nach 6 Faktenfragen + finalem Risiko):

1. **Input:** Steckbrief + `archetypId` + `answers` (6 Fakten) + `risiko` (Nutzerwahl).
2. **LLM-Call** liefert JSON:
   - `beispielrichtungen` — 2–4 Objekte mit `text` (Konjunktiv) und `typ`:
     - `agent` — teilautonomer KI-Agent
     - `workflow` — fester Ablauf (n8n, Make, Zapier)
     - `assistenz` — Einzelaufgabe mit Mensch in der Schleife
     - `sonstiges` — andere Form
   - `fallstricke` — 2–4 Strings, auf den Fall zugeschnitten

**Allgemein:**

- **Keine Scoring-Vorbelegung:** Die 6 Faktenfragen werden **nicht** vorausgewählt.
- **Persistenz:** Generierte Texte + `archetypId` werden mit dem Fall gespeichert.
- **Kein Archetyp-Label in der UI.**

Beispiel Phase 1:

```json
{
  "archetypId": "extraktion",
  "risikoVorschlag": {
    "stufe": "hoch",
    "begruendung": "Falsche Beträge könnten direkt in die Buchhaltung gelangen."
  }
}
```

Beispiel Phase 2:

```json
{
  "beispielrichtungen": [
    { "text": "…", "typ": "workflow" },
    { "text": "…", "typ": "agent" }
  ],
  "fallstricke": ["…"]
}
```

---

## 7. Framing-Regel für sichtbare Ausgaben (verbindlich)

Ton: Konjunktiv/Möglichkeitsform (könnte, ließe sich, wäre denkbar) statt Autoritätsaussage.

Nie: „So automatisierst du diesen Prozess."

**Wichtig — keine Phrasen-Wiederholung:** Die Konjunktiv-Form ist ein **Ton**, keine feste Satzschablone. Jede Beispielrichtung muss **anders formuliert** sein — nicht jeder Satz darf mit derselben Phrase (z. B. immer „So könnte KI …") beginnen. Wirkt sonst robotisch/generisch statt wie eine echte Beratungsaussage.

**Substanz statt Checkliste:** Jede Beispielrichtung ist eine **eigenständige** Automatisierungsrichtung, kein Trivialschritt eines einzigen Ablaufs (nicht: „KI liest aus" + „KI speichert" + „KI meldet" als drei separate Punkte für denselben Vorgang). Konkret genug, dass der Nutzer sich etwas vorstellen kann — orientiert an den „Typischen Prozessen" des Archetyps, auf den Fall zugeschnitten.

**Human-in-the-loop:** Nur bei Archetypen mit Außenwirkung (Entwurf, Matching) gehört der Hinweis auf menschliche Freigabe in die Beispielrichtungen — nicht generell bei jedem Archetyp.

---

## 8. Risiko-Schritt in der UI

- **Titel:** Risiko beim KI-Einsatz
- **Subtext:** „Wie gravierend wären Fehler, Datenmissbrauch oder falsche Entscheidungen in diesem Prozess?"
- **Vorschlag:** Wenn `risikoVorschlag` vorhanden, Stufe vorausgewählt + Begründungstext darunter.
- **Nutzer kann ändern:** Risiko ist Pflichtfeld vor Ergebnis (kein optional mehr im Steckbrief).

---

## 9. Inakzeptabel — Anzeige in Ergebnis und Rangliste

Der **Gesamt-Score wird normal berechnet und gespeichert**. Bei `risiko === "inakzeptabel"`:

- **Ergebnis:** Getrennte Anzeige, z. B. *„Berechneter Nutzen: 82 — Priorisierung: ausgeschlossen wegen Risiko“*
- **Rangliste:** Score bleibt sichtbar; Sortierung ans Ende; klare Kennzeichnung der ausgeschlossenen Priorisierung

Der Score wird **nicht** auf null gesetzt.

---

## 10. Optionaler UI-Rest (nice-to-have, nicht MVP)

- **Transparenz-Detail:** Aufklappbares „Warum dieser Vorschlag?" — ggf. mit Archetyp-Namen
- **Berater-/Admin-Sicht:** `archetypId` für methodische Einordnung

---

## 11. Roadmap & Validierung

v2-Feature nach v1-Kern. **Vor Go-Live:** 5–8 echte Fälle, 2–3 Fachbereichs-Nutzer, ≥70 % der Beispielrichtungen als „brauchbar" bewertet.

**Ersetzt:** `docs/superpowers/specs/2026-07-21-archetyp-zuordnung-design.md` (User-facing Archetyp-Schritt — verworfen).
