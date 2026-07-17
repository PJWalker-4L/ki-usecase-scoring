# DECISIONS.md — Architekturentscheidungen

## ACTIVE DECISIONS

---

### [ADR-002] Projektstand 2026-07-17 — Feature-Snapshot für Folge-Session

**Datum:** 2026-07-17

**Status:** Vollständig implementiert und TypeScript-Build grün (`npm run build` erfolgreich).

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

_(leer)_
