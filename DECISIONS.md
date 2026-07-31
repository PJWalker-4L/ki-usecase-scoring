# DECISIONS.md — Architekturentscheidungen

## ACTIVE DECISIONS

---

### [ADR-011] Scoring-Revision — Auswirkung, Risiko-Abgrenzung, Fragenzählung 7

**Datum:** 2026-07-31

**Entscheidung:**

#### Auswirkung statt „strategische Relevanz" (4 Stufen)

- Kriterium `auswirkung` ersetzt `strategie` in `QUESTIONS` und `Answers`. Frage: **„Wer merkt es, wenn diese Aufgabe liegen bleibt?"** — beobachtbare Reichweite statt Selbsteinschätzung.
- Vier Stufen mit Punktwerten: Frist/Prüfung (100), Kunden/Lieferanten (80), Andere Abteilungen (50), Eigenes Team (20). Fließen **nur in den Nutzen-Score** (`0.7 × timeValue + 0.3 × auswirkung.points`).
- **Legacy-Mapping** für gespeicherte Fälle und `docs/eval/faelle.json`: `ja` → `kunden-lieferanten`, `indirekt` → `andere-abteilungen`, `nein` → `eigenes-team` (`resolveAnswerId()` in `scoring.ts`).

#### Risiko-Tag — eigene Frage, getrennt von Auswirkung

- Verbindlicher Fragetext: **„Was passiert, wenn die Automatisierung einen Fehler macht?"** (Wizard-Titel + `RisikoStep`).
- Bei gewählter Frist-Stufe bei Auswirkung: kontextueller Hinweis, dass hohe Auswirkung ≠ hohes Automatisierungsrisiko.
- Risiko bleibt **Metadaten für Priorisierung** (ADR-003); wirkt nicht in `computeScores()`.
- Stufenbezeichnungen in der Chip-Auswahl mit KI-VO-nahen Klammerzusätzen (v1-Ergänzung), ohne Compliance-Anspruch im Nutzertext.

#### Fragenzählung 7 (reine Anzeige)

- Steckbrief = **Frage 1 von 7**; sechs Bewertungsfragen = **Frage 2–7**. Konstante `WIZARD_QUESTION_COUNT` in `scoring.ts`.
- Fortschrittsbalken (`SegmentProgress`) auf Brief- und Frageschritten: 7 Segmente. Risiko, Beispiele und Ergebnis tragen keine „Frage X von 7"-Nummer.
- Steckbrief-Hinweis: Beschreibung fließt nicht in den Punktwert ein.

**Konsequenz:** Spec in `docs/idea/concept.md` und `klarsicht_scoring_aenderungen.md` ist mit Code synchronisiert. A/B-Fälle mit altem `"strategie": "ja"` können leicht andere Nutzen-Scores liefern (80 statt 100 für die Auswirkungskomponente). Erweitert ADR-005; ersetzt die Drei-Stufen-`strategie`-Logik aus dem historischen Snapshot ADR-002.

---

### [ADR-010] Häufigkeit — Monatsanzeige aus einem Rechenfaktor

**Datum:** 2026-07-31

**Entscheidung:**
- Jede Häufigkeitsstufe hat einen festen **`perMonth`-Wert** in `scoring.ts` (Basis: ca. 20 Arbeitstage/Monat). Die UI-Spalte rechts wird **ausschließlich** via `formatFrequencyPerMonth(perMonth)` erzeugt — keine hardcodierten Korridore (z. B. „40–100×/Monat").
- `ChoiceGroup` erhält Variante **`split`**: Label links, Häufigkeit rechts, immer sichtbar (nur Frage `haeufigkeit`).
- Label „Seltener als monatlich"; Subtitle: normaler Monat, keine Ausnahmewoche.

**Konsequenz:** Anzeige und `computeScores()` können nicht auseinanderlaufen. Korridor-Entwürfe aus dem Stitch-Screen verworfen. Scoring-Formel unverändert (siehe historischer Snapshot ADR-002).

---

### [ADR-012] Steckbrief vereinfacht — Pflicht nur Ablauf und Ziel

**Datum:** 2026-07-29

**Entscheidung:**
- Im Wizard sind **zwei Pflichtfelder** sichtbar: „Aktueller Ablauf" (`problem`) und „Was soll am Ende vorliegen?" (`ziel`). Klare Placeholders und Labels statt generischer „Problem/Lösung"-Sprache.
- **`loesung` entfällt in der UI** — bleibt im Typ `FallBrief` für Legacy-Daten und Ranglisten-Suche, wird beim Speichern nicht mehr abgefragt. Fortschritt im Wizard setzt voraus, dass Ablauf und Ziel ausgefüllt sind.
- Steckbrief-Hinweis: Inhalt dient Kontext für Klassifikation und Beispiele, **fließt nicht in den Punktwert** ein (siehe ADR-011).

**Konsequenz:** Weniger Einstiegshürde; LLM-Prompts nutzen weiterhin `problem`/`ziel` (ggf. mit vorhandenem `loesung` aus alten Fällen). Ergänzt ADR-005.

---

### [ADR-013] v2 — Fortsetzen unterbrochener Bewertungen (geplant)

**Datum:** 2026-07-31

**Status:** In `docs/idea/klarsicht_v2_prd.md` spezifiziert, **noch nicht implementiert**.

**Entscheidung (Zielbild):**
- Aufgabenliste zeigt laufende Bewertungen mit Fortschritt und Deeplink zur letzten offenen Frage.
- Datenmodell ergänzt um Status und Index der zuletzt beantworteten Frage; Wiederherstellung nach Abbruch.
- **Abhängigkeiten:** Benutzerkonten und serverseitige Persistenz (localStorage allein reicht nicht für geräteübergreifendes Fortsetzen).

**Konsequenz:** v1 speichert nur abgeschlossene Fälle in localStorage. Umsetzung folgt mit v2-Inkrement A (Konten + Server-Speicher).

---

### [ADR-009] Gebundene Arbeitszeit sichtbar machen (v1)

**Datum:** 2026-07-31

**Entscheidung:**
- `hoursPerMonth` aus `computeScores()` wird als **gebundene Arbeitszeit** prominent neben dem Gesamt-Score angezeigt (`GebundeneArbeitszeit`-Composite in `shared/`).
- Formatierung: `formatGebundeneArbeitszeit()` — gerundet, „ca.", unter 1 Std./Monat als Text; Herkunftssatz aus `GEBUNDENE_ARBEIT_HERKUNFT`.
- **Rangliste:** kompakte Anzeige ab `sm` neben dem Score; auf schmalen Screens entfällt sie in der Liste (Progressive Disclosure laut Spec).
- Wert wird mit dem Fall persistiert (`SavedCase.result.hoursPerMonth`); bei geänderten Antworten neu berechnet. **Keine** Geldumrechnung, **keine** Ersparnis-Formulierung.
- v2-Zielfeld `baselineStunden` dokumentiert in `klarsicht_v2_prd.md`; v1 behält intern `hoursPerMonth`.

**Konsequenz:** Umsetzung von `klarsicht_v1_zusatzfunktionen.md`. Rechenlogik unverändert. Erweitert ADR-003.

---

### [ADR-008] KLARSICHT Designsystem — Brand-Tokens und Score-Farben

**Datum:** 2026-07-28

**Entscheidung:**
- Farbwelt aus Marken-Mesh-Gradient (Lavender/Coral/Pink/Magenta); Primary `#5868F7`, warmes Coral für Akzente und Risiko „hoch".
- **`tokens.css`** + `globals.css`: semantische Utilities (`surface-highlight`, `surface-inset`, `overlay-scrim`, `score-*`-Varianten). Dark Mode: Deep-Purple-Base.
- **`DESIGN.md`** (Projektroot) als verbindliche UI-Spec; Komponenten (Button, ChoiceGroup, Badges, FlowShell, Rangliste, …) auf Tokens umgestellt.
- Typ-Badges für Automatisierungstypen (`AUTOMATISIERUNGSTYP_BADGE`); empfohlene Beispielrichtung visuell hervorgehoben.
- Score-Skala bleibt **visuell getrennt** von Brand-Primary (Leitprinzip aus Spec).

**Konsequenz:** Ersetzt generisches Indigo/Gold aus frühen Prototypen. Neue UI folgt `DESIGN.md`, nicht ad-hoc Tailwind-Farben.

---

### [ADR-007] Empfehlung einer Automatisierungsoption — degradiert statt zu scheitern

**Datum:** 2026-07-28

**Entscheidung:**
- Phase 2 liefert zusätzlich `empfehlung` (`index` + `begruendung`): das LLM wählt genau **eine** der Beispielrichtungen und begründet sie kurz. Anzeige in BeispielrichtungenListe, FaktenScorer, Rangliste und `BeispielloesungenSheet` (Regenerierung möglich).
- **Empfehlung ist optional, nicht Pflicht:** Unter strict JSON-Schema wird Optionality als `empfehlung: object | null` ausgedrückt (nicht durch Weglassen aus `required` — das lehnen die Provider ab). Ein ungültiger Index wird auf den letzten gültigen Eintrag **begrenzt**; fehlen Index/Begründung oder ist `empfehlung` null, entfällt die Empfehlung. Der Schritt liefert weiterhin 200 mit Optionen und Fallstricken.
- **Kein Rückfall auf `index: 0`**, weil das eine Wahl vortäuscht, die das Modell nicht getroffen hat — und den zu messenden Positions-Bias unsichtbar machen würde.
- **Modellvergleich statt Bauchgefühl:** `npm run ab` (Skript `scripts/ab-classify.mjs`, Fälle in `docs/eval/faelle.json`) vergleicht zwei Modelle über denselben Fallsatz und protokolliert Archetyp-Treffer, Index-Verteilung, Typen-Vielfalt und Formulierungs-Wiederholungen.

**Konsequenz:** Für den Vergleich muss lokal `ALLOW_MODEL_OVERRIDE=true` gesetzt sein. `resolveEmpfehlung()` in `lib/empfehlung.ts` zentralisiert die Anzeige-Logik. Erweitert ADR-005.

---

### [ADR-006] Rangliste v2 — manuelle Reihenfolge, Filter/Suche, localStorage-Härtung

**Datum:** 2026-07-22

**Entscheidung:**

#### Manuelle Reihenfolge (Drag & Drop)

- Gespeicherte Fälle können optional ein Feld `sortOrder?: number` tragen. Sobald **mindestens ein** Fall `sortOrder` hat, gilt die Liste als manuell sortiert; die Anzeige folgt dann `sortOrder`, nicht mehr dem Score.
- **Standard-Sortierung** (ohne `sortOrder`): absteigend nach `gesamtScore`, Fälle mit `risiko === "inakzeptabel"` ans Ende — wie in ADR-003, nur jetzt explizit als Fallback codiert (`sortCasesByScore` in `Rangliste.tsx`).
- Drag & Drop persistiert über `reorderCases()` in `storage.ts`; neue Fälle erhalten `sortOrder`, wenn bereits manuelle Sortierung aktiv ist.
- **Zurücksetzen auf Score-Sortierung:** eigener Hinweis-Banner zwischen Filterleiste und Liste (Button „Nach Gesamt-Score sortieren“), sichtbar nur bei aktiver manueller Reihenfolge. **`resetCasesToScoreOrder()`** entfernt `sortOrder` aus allen Fällen in localStorage.

**Platzierung Reset-Aktion:** bewusst **nicht** in der Filterleiste. Filter steuern Sichtbarkeit (temporär); Reihenfolge ist persistierter Listenzustand (wie DnD). Ein Reset dort würde „nach Score sortieren“ mit dem Score-**Filter** (0–39, 70–100 …) vermischen.

#### Bearbeiten ohne Reihenfolge-Verlust

- `updateCase()` übernimmt `sortOrder` vom bestehenden Datensatz, wenn der Payload keins mitliefert (`entry.sortOrder ?? all[index].sortOrder`). Fix in der Storage-Schicht — nicht in jedem Aufrufer (`FaktenScorer` sendet kein `sortOrder`).

#### localStorage-Normalisierung

- Beim Einlesen validiert `normalizeBrief()` das Feld `risiko` über **`isBriefRisiko()`** (`types/brief.ts`) gegen die erlaubten Werte (`""`, `gering`, `ueberschaubar`, `hoch`, `inakzeptabel`). Ungültige oder korrupte Werte werden auf `""` zurückgesetzt — analog zu den String-Feldern `problem`, `loesung`, `ziel`.

#### Filter, Suche und Drag-Sperre

- **Filter:** Chip-Popover in `RanglisteFilterBar` (Priorisierung, Status, Gesamt-Score-Band, Risiko); Logik in `lib/rangliste-filters.ts`.
- **Volltextsuche:** separates Suchfeld über den Filtern; durchsucht `problem`, `loesung`, `ziel` (case-insensitive Substring). Suche ist kein Filter-Chip, aber **`hasActiveRanglisteConstraints()`** behandelt Suche und Filter gemeinsam.
- **Drag & Drop deaktiviert**, solange Suche oder Filter aktiv sind — Teilansicht + Umordnung wäre irreführend (Platznummern beziehen sich weiterhin auf die **globale** Rangliste).
- „Alle zurücksetzen“ leert Filter **und** Suche.

#### UI-Primitive

- **`PopoverContent`** übergibt `children` explizit als JSX-Kinder (wie `TooltipContent`), nicht nur per `{...props}` auf self-closing Tag — sonst fehlt der Inhalt in Radix-Popovern (Filter-Dropdowns).

**Konsequenz:** Rangliste unter `/faelle` ist für größere Falllisten nutzbar (Suche/Filter), behält strategische Manuelleinsortierung bei und schützt Persistenz gegen korrupte localStorage-Daten und Bearbeitungs-Nebenwirkungen. Erweitert ADR-003, ersetzt es nicht.

---

### [ADR-005] Archetyp-Klassifikation v2 — Backend-only, erweiterter Wizard-Flow

**Datum:** 2026-07-22  
**Letzte Anpassung:** 2026-07-31 (Auswirkung, Fragenzählung — siehe ADR-011)

**Entscheidung:**
- Nach dem Steckbrief folgt ein **LLM-Klassifikations-Call** (`POST /api/classify`): liefert intern `archetypId` und **Risiko-Vorschlag**. `archetypId` wird persistiert, **nie** als Label in der UI gezeigt.
- **Wizard-Reihenfolge:** Steckbrief → (Klassifikation) → 6 Bewertungsfragen → Risiko beim KI-Einsatz → (Beispiel-Klassifikation) → Beispielrichtungen → Ergebnis. Anzeige „Frage 1–7 von 7" nur auf Steckbrief + Bewertungsfragen (ADR-011).
- **Zwei LLM-Phasen:** Phase 1 nach Steckbrief (Archetyp + Risiko-Vorschlag); Phase 2 nach Risiko (Beispiele + Fallstricke + optional Empfehlung, mit Fakten aus den 6 Fragen). Jede Beispielrichtung hat einen **Automatisierungstyp** (agent, workflow, assistenz, sonstiges).
- **Keine Scoring-Vorbelegung:** Die 6 Bewertungsfragen starten ohne Vorauswahl; nur Risiko wird vorgeschlagen.
- **LLM-Fehler:** Beispiel-Schritt entfällt, Hinweis, Nutzer kann weiter — kein statischer Fallback.
- Risiko-Feld **aus dem Steckbrief entfernt**, eigener Wizard-Schritt mit Pflichtauswahl (ADR-003/011).
- Steckbrief nur noch Ablauf + Ziel (ADR-012).

**Konsequenz:** `GROQ_API_KEY` (Groq, `gsk_*`), `XAI_API_KEY` (xAI/Grok) oder `OPENAI_API_KEY` (Fallback) serverseitig. Keys mit Präfix `gsk_` werden automatisch Groq zugeordnet. Dev-Server: `node --use-system-ca` wegen TLS unter Windows. Scoring nutzt `auswirkung` statt `strategie` (ADR-011).

---

### [ADR-004] Zwei-Schichten-UI — shadcn `ui/` + produktweite `shared/`, Wizard ohne Ergebnis-Sidebar

**Datum:** 2026-07-18

**Entscheidung:**
- UI ist zweischichtig: Primitives in `src/components/ui/` (shadcn/Radix), Composites in `src/components/shared/` (PageHeader, SurfaceCard, ChoiceGroup, ChipSelect, SegmentProgress, ScoreMeter, FlowShell, EmptyState, FormField, SectionIcon, NavLink, …). Features importieren Preferenz `shared/*` und `ui/*` — keine ad-hoc `stoic-*`-CSS-Klassen in Features.
- Choice-Selektion nutzt **Ink-Invert** (`--color-text` / inverse), nicht Accent-Glow. Accent bleibt für Primary-CTAs, Fokus-Ring und Links.
- FaktenScorer ist ein **Wizard** (Steckbrief → 6 Bewertungsfragen → Risiko → Beispielrichtungen → Ergebnis) mit `SegmentProgress` oben und sticky Footer-CTA. Die permanente Ergebnis-Sidebar während des Fragens entfällt; Score, gebundene Arbeitszeit und Speichern nur auf dem Ergebnis-Schritt (ADR-009).
- `Card` hat `variant="surface"`; Button `size="lg"` ist volle Pill (`h-11`, `rounded-full`). Mobile Nav nutzt shadcn `Sheet`.

**Konsequenz:** Neue UI-Muster zuerst als Shared-Composite, dann in Features verwenden. Scoring/Persistenz siehe ADR-003 und ADR-011.

---

### [ADR-003] Fall speichern + Rangliste — Persistenz via localStorage, Risiko als reine Sortierregel

**Datum:** 2026-07-17

**Entscheidung:**
- Gespeicherte Fälle (`SavedCase` = Steckbrief + Antworten + Ergebnis) liegen client-seitig in `localStorage` unter dem Key `kist-cases-v1` (`src/lib/storage.ts`) — keine Backend-Anbindung in diesem Schritt.
- Die Rangliste (`/faelle`, `src/components/Rangliste.tsx`) sortiert nach `gesamtScore` absteigend. Fälle mit `risiko === "inakzeptabel"` werden **nur in der Anzeige-Sortierung** ans Ende gestellt — der gespeicherte `gesamtScore` selbst bleibt unverändert. Das respektiert die Regel, dass das Risiko-Tag reine Metadaten ist und den Score nicht beeinflusst.
- **Anzeige bei Inakzeptabel (Ergebnis + Rangliste):** Score bleibt sichtbar; zusätzlich klare Trennung: *„Berechneter Nutzen: {score} — Priorisierung: ausgeschlossen wegen Risiko“*. Kein Score-Nullsetzen.
- `CLASSIFICATION_STYLES` (Farb-Badges je Einordnung) wurde aus `FaktenScorer.tsx` nach `lib/scoring.ts` verschoben, da nun zwei Komponenten sie brauchen.

**Konsequenz:** Fälle sind nur auf dem jeweiligen Gerät/Browser sichtbar. Ein Wechsel auf echte Persistenz (Backend/DB) bleibt offener Punkt — v2-Zielbild in ADR-013.

---

### [ADR-001] Vercel-Projekt muss `framework: "nextjs"` explizit gesetzt haben

**Datum:** 2026-07-17

**Entscheidung:** Jedes Next.js-Projekt auf Vercel muss im Vercel-Projekt-Dashboard (oder via API) `framework: "nextjs"` explizit konfiguriert haben. `null` ist nicht akzeptabel.

**Kontext / Problem:**
Das Vercel-Projekt `ki-usecase-scoring` hatte `"framework": null` in den Projekteinstellungen (abrufbar via `vercel pull`). Dadurch verwendete Vercel den Builder `@vercel/static-build` statt `@vercel/next`. Der Builder führte zwar korrekt `next build` aus, wusste aber nicht, dass die Ausgabe in `.next/` liegt. Ergebnis: Nur die `public/`-Dateien (SVGs) landeten im Deployment-Output — alle Routen, inkl. `/`, lieferten `404: NOT_FOUND`.

**Lösung:**
```bash
PATCH https://api.vercel.com/v9/projects/{project_id}?teamId={team_id}
Body: {"framework": "nextjs"}
```
Danach `vercel --prod` ausführen.

**Konsequenz:** Framework-Setting ist Pflicht-Check bei jedem neuen Vercel-Projekt.

---

## HISTORICAL ARCHIVE

### [ADR-002] Projektstand 2026-07-17 — Feature-Snapshot für Folge-Session

**Datum:** 2026-07-17

**Status:** Historischer Snapshot — überholt durch ADR-004–013 (Wizard, Design, Rangliste, Scoring-Revision). Nur noch Referenz für die ursprüngliche Formel und frühe Dateistruktur.

---

#### Tech Stack

| Schicht | Technologie |
|---|---|
| Framework | Next.js 16.2.10 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first via `@import "tailwindcss"`) |
| UI Components | shadcn/ui (new-york, zinc base, oklch-Variablen) |
| State | React `useState` (kein externe State-Lib) |
| Deployment | Vercel (framework: "nextjs" explizit gesetzt — ADR-001) |

---

#### Dateistruktur (Stand heute)

```
src/
  app/
    layout.tsx          — Root-Layout; lang="de", suppressHydrationWarning, Geist-Font
    page.tsx            — Wrapper: <main> → <FaktenScorer />
    globals.css         — Tailwind v4 + shadcn oklch-Variablen; media-query dark mode
  components/
    FaktenScorer.tsx    — Haupt-Page-Komponente ("use client"), ~290 Zeilen
    FallSteckbrief.tsx  — Geführte Fallbeschreibung (NEU), Card mit 3 Textareas + Risiko-Pills
    ui/
      card.tsx          — shadcn Card
      progress.tsx      — shadcn Progress (erweitert: indicatorClassName-Prop)
      badge.tsx         — shadcn Badge
      button.tsx        — shadcn Button
  lib/
    scoring.ts          — Gesamte Scoring-Logik (QUESTIONS, computeScores, classify, scoreColor, formatHours)
    utils.ts            — shadcn cn() Hilfsfunktion
  types/
    brief.ts            — FallBrief-Typ, EMPTY_BRIEF, RISIKO_OPTIONS, RISIKO_BADGE (NEU)
components.json         — shadcn-Konfiguration
DECISIONS.md            — dieses Dokument
CLAUDE.md               — Projekt-Kontext für Claude
docs/                   — Platz für Specs (aktuell leer)
```

---

#### Feature 1: Fakten-Scorer (vollständig)

Die Haupt-Funktion der App. Nutzer beantwortet 6 konkrete Fragen zu einem KI-Anwendungsfall und bekommt ein Scoring-Ergebnis.

**Scoring-Formel:**
- `hoursPerMonth = (haeufigkeit.perMonth × zeitaufwand.minutes × personen.persons) / 60`
- `timeValue = clamp((hoursPerMonth / 40) × 100)`
- `wertScore = clamp(0.7 × timeValue + 0.3 × strategie.points)`
- `machbarkeitScore = clamp(0.5 × daten.points + 0.5 × standard.points)`
- `gesamtScore = clamp(0.6 × wertScore + 0.4 × machbarkeitScore)`

**4-Quadranten-Klassifikation:**
| Wert | Machbarkeit | Einordnung | Farbe |
|---|---|---|---|
| ≥50 | ≥50 | Quick Win — als Erstes angehen | emerald |
| ≥50 | <50 | Strategischer Fall | amber |
| <50 | ≥50 | Nebenbei-Verbesserung | sky |
| <50 | <50 | Zurückstellen | zinc |

**Sidebar-Reihenfolge (nach Ausfüllen aller 6 Fragen):**
1. Einordnung (Klassifikation als Hero-Block in Quadrantenfarbe)
2. Gesamt-Score (große Zahl, XX/100)
3. ScoreBars für Wert und Machbarkeit (farbcodiert: emerald ≥70, amber 40-69, red <40)
4. Gebundene Arbeitszeit (≈ X Std. / Monat)
5. "Neue Bewertung"-Button (löscht Antworten UND Steckbrief)

---

#### Feature 2: Fall-Steckbrief (vollständig, NEU)

Ersetzt das frühere einfache Namensfeld. Sitzt als erster Block auf der Seite, vor den 6 Scoring-Fragen.

**Felder:**
- Problem / Herausforderung (textarea, rows=2)
- Lösungsansatz (textarea, rows=2)
- Ziel / Erwartetes Ergebnis (textarea, rows=2)
- Risiko-Tag (4 Pill-Buttons: Gering/Überschaubar/Hoch/Inakzeptabel)

**Wichtig:** Das Risiko-Tag ist **reine Metadaten** — es beeinflusst den Score nicht.

**Risiko-Farben:**
| ID | Farbe aktiv | Sidebar-Badge |
|---|---|---|
| gering | emerald | bg-emerald-100 text-emerald-800 |
| ueberschaubar | amber | bg-amber-100 text-amber-800 |
| hoch | orange | bg-orange-100 text-orange-800 |
| inakzeptabel | red | bg-red-100 text-red-800 |

**Sidebar-Zusammenfassung:** Erscheint als separate Card über der Ergebnis-Card, sobald ≥1 Feld ausgefüllt ist. Zeigt Problem/Lösung/Ziel mit `line-clamp-2` und Risiko als farbigen `<Badge>`.

---

#### Wichtige Implementierungsdetails

- **Tailwind v4 Dark Mode:** `@media (prefers-color-scheme: dark)` statt `.dark`-Klasse (shadcn-Konvention überschrieben). Beide Varianten funktionieren, weil shadcn-Variablen auf `:root` liegen.
- **Progress-Komponente:** Hat eine eigene `indicatorClassName`-Prop (nicht im Standard-shadcn enthalten), um die Balkenfarbe pro Score zu setzen.
- **`suppressHydrationWarning`** auf `<html>`: Unterdrückt Hydration-Mismatch durch Browser-Extensions (z. B. ColorZilla), die `className` modifizieren.
- **shadcn init:** Wurde manuell konfiguriert (components.json + lib/utils.ts) statt `npx shadcn init`, da der interaktive Prompt in dieser Umgebung hängt.

---

#### Offene Punkte / Mögliche nächste Features

1. **Export / Sharing** — Ergebnis als PDF, Link oder Bild teilen
2. **Mehrere Use Cases** — Liste von bewerteten Fällen, Vergleich
3. **Speichern** — localStorage oder Backend (Supabase/Vercel Postgres)
4. **Erweiterte Scoring-Dimensionen** — z. B. Datenschutz-Score, Compliance-Gewichtung
5. **Onboarding** — Tooltip-Erklärungen zu den Fragen

---
