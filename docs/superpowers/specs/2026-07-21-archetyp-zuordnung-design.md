# Spec: Archetyp-Zuordnung (Klarsicht v2)

*Stand: 2026-07-21 · Entwurf zur Klärung — noch nicht freigegeben zum Bau*  
*Quellen: `docs/idea/concept.md`, `docs/idea/ki_archetypen.md`, aktueller Wizard (`Steckbrief → 6 Fragen → Ergebnis`)*

---

## 1. Ziel

Nach dem Steckbrief (mind. **Aktueller Ablauf** + **Ziel**) ordnet Klarsicht den beschriebenen Prozess einem von **7 Automatisierungs-Archetypen** zu und zeigt typische Voraussetzungen, Nutzen und Fallstricke — als **Einordnung und Beispielrichtung**, nicht als fertige Lösung.

**Produktversprechen bleibt:** „Welchen Anwendungsfall zuerst?“  
**Dieses Feature liefert:** „Was für ein Typ Fall ist das?“ — und speist damit Verständnis und (optional) Vorschläge für die Bewertung.

---

## 2. Nicht-Ziele (explizit)

| Nicht | Warum |
|--------|--------|
| Freie Lösungsarchitektur / Tech-Stack / Implementierungsplan | Anderes Versprechen; verwässert Priorisierung |
| Score still überschreiben (Machbarkeit/Wert/Gesamt) | Widerspricht „Fakten statt Noten“ |
| Archetyp als Pflicht für Ranking | Scoring muss auch ohne Archetyp funktionieren (v1-Kern) |
| Produktions-/Shopfloor-Vision/Steuerung als Kernkatalog | Büro-/Wissensprozesse; Ausnahmen später |
| „KI löst deinen Prozess“-Marketing-Ton | Framing-Regel: Konjunktiv / Beispielmodus |

---

## 3. Framing-Regeln (verbindlich)

1. Formulierung immer im **Konjunktiv / Beispielmodus** („So könnte KI solche Prozesse typischerweise …“).
2. **Human-in-the-loop** bei Außenwirkung (Entwurf, Matching) immer mitkommunizieren.
3. Nutzer kann Zuordnung **korrigieren** oder ablehnen („passt nicht / weiß nicht“).
4. Bei Kombinationen: **dominanter** Archetyp + optional sekundäre Muster — nicht erzwingen genau einen.
5. Machbarkeits-/Risiko-Hinweise im Archetyp sind **Heuristiken**, keine gemessenen Werte — so labeln.

Referenzinhalte: `docs/idea/ki_archetypen.md` (7 Muster + Querschnitt).

---

## 4. Vorgeschlagener Flow (Skizze)

```
Steckbrief (Ablauf + Ziel Pflicht)
    → [v2] Archetyp-Schritt (Vorschlag + Korrektur + Kurzinfos)
    → 6 Fakten-Fragen (unverändert führend für Score)
    → Ergebnis (+ Archetyp in Zusammenfassung / Rangliste)
```

**Prinzip:** Archetyp **vor** den Faktenfragen = Kontext für den Laien und optional Vorbelegung von Hinweisen; die Fragen bleiben die Wahrheitsquelle für den Score.

---

## 5. Persistenz (Absicht)

Erweiterung von `FallBrief` / `SavedCase` um z. B.:

- `archetypId` (dominant, einer der 7 oder `null`)
- optional `archetypSecondaryIds[]`
- optional `archetypSource`: `suggested` | `user` | `skipped`
- **kein** automatisches Überschreiben von `answers` / `result` ohne Nutzeraktion

---

## 6. Scoring-Anbindung (Absicht — zu klären)

| Stufe | Verhalten |
|--------|-----------|
| **MVP** | Nur Anzeige + Speichern der Zuordnung; Score unverändert aus Faktenfragen |
| **v2.1** | Optionale **Vorschläge** (z. B. Risiko-Hinweis, Soft-Hint bei Daten/Standard) — Nutzer bestätigt oder ändert |
| **Nie** | Stiller Override von Punkten ohne sichtbare Bestätigung |

---

## 7. MVP-Umfang (nach Klärung)

**Im MVP:**

- Statische Karten/Texte aus `ki_archetypen.md` (Voraussetzungen, Nutzen, Fallstricke)
- Zuordnung: Nutzer wählt / korrigiert (manuell); optional später LLM-Vorschlag
- Ein Wizard-Schritt + Anzeige in Ergebnis/Rangliste
- Framing und „passt nicht“-Pfad

**Explizit später:**

- LLM-Klassifikation
- Auto-Vorausfüllen von Risiko oder Frage-Antworten
- Matrix-View gekoppelt an Archetyp

---

## 8. Erfolgskriterien

- Fachbereichsnutzer versteht den Vorschlag als **Hilfe**, nicht als Bevormundung (Test-Vorbehalt aus Archetypen-Doc).
- Berater kann Fälle vergleichen („3× Extraktion, 1× RAG“) ohne Implementierungsdiskussion.
- Score bleibt aus Faktenfragen erklärbar; Archetyp ist Zusatzkontext.

---

## 9. Offene Entscheidungen (vor Implementierungsplan)

Siehe Abschnitt unten — werden nacheinander mit Product Owner geklärt und hier eingetragen.

| # | Frage | Optionen (Kurz) | Status |
|---|--------|-----------------|--------|
| Q1 | Wann im Flow? | A nach Steckbrief · B nach Ergebnis · C parallel/optional | offen |
| Q2 | Zuordnung wie? | A manuell · B Regeln · C LLM · D Hybrid | offen |
| Q3 | Scoring-Tiefe im MVP? | A nur Anzeige · B Risiko-Vorschlag · C Frage-Vorbelegung | offen |
| Q4 | Mehrfachzuordnung UI? | A nur dominant · B dominant + 1 sekundär · C Mehrfach frei | offen |
| Q5 | Pflicht vs. überspringbar? | A Pflicht · B überspringbar · C Soft-Skip | offen |
| Q6 | Persistenz-Schema | Felder wie in §5? | offen |
| Q7 | Validierung vor LLM | A 5–10 Abläufe manuell · B direkt LLM-Spike | offen |

---

## 10. Abhängigkeiten / Reihenfolge

1. v1-Kern stabil (Steckbrief-Copy, Wizard, Ranking) — **läuft**
2. Diese Spec freigeben (offene Fragen schließen)
3. Kurzer Nutzertest / Paper-Walkthrough (Empfehlung)
4. Implementierungsplan → MVP ohne LLM, dann optional LLM

---

## Änderungslog

| Datum | Änderung |
|--------|----------|
| 2026-07-21 | Erstentwurf aus concept + ki_archetypen + aktueller App-Flow |
