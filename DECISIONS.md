# DECISIONS.md — Architekturentscheidungen

## ACTIVE DECISIONS

---

### [ADR-001] Vercel-Projekt muss `framework: "nextjs"` explizit gesetzt haben

**Datum:** 2026-07-17

**Entscheidung:** Jedes Next.js-Projekt auf Vercel muss im Vercel-Projekt-Dashboard (oder via API) `framework: "nextjs"` explizit konfiguriert haben. `null` ist nicht akzeptabel.

**Kontext / Problem:**
Das Vercel-Projekt `ki-usecase-scoring` hatte `"framework": null` in den Projekteinstellungen (abrufbar via `vercel pull`). Dadurch verwendete Vercel den Builder `@vercel/static-build` statt `@vercel/next`. Der Builder führte zwar korrekt `next build` aus, wusste aber nicht, dass die Ausgabe in `.next/` liegt. Ergebnis: Nur die `public/`-Dateien (SVGs) landeten im Deployment-Output — alle Routen, inkl. `/`, lieferten `404: NOT_FOUND`. Das Build-Log zeigte "✓ Ready" und korrekte Routen (`○ /`), was die Diagnose erschwerte.

**Lösung:**
Framework via Vercel REST API auf `nextjs` setzen:
```bash
PATCH https://api.vercel.com/v9/projects/{project_id}?teamId={team_id}
Body: {"framework": "nextjs"}
```
Danach `vercel --prod` ausführen. Vercel erkennt dann "Detected Next.js version: X.Y.Z" und verwendet `@vercel/next`.

**Diagnose-Workflow (bei 404 auf Vercel trotz erfolgreichem Build):**
1. `vercel pull --yes --environment production` → `project.json` prüfen → `"framework"` Wert checken
2. Lokales `vercel build --yes` → `.vercel/output/builds.json` öffnen → prüfen ob `"use": "@vercel/next"` oder `"@vercel/static-build"`
3. Falls `@vercel/static-build`: Framework-Setting korrigieren (API oder Dashboard), neu deployen

**Konsequenz:** Framework-Setting ist Pflicht-Check bei jedem neuen Vercel-Projekt. Nie davon ausgehen, dass Vercel Next.js automatisch korrekt erkennt, wenn das Projekt manuell erstellt oder aus einem Non-Framework-Repo migriert wurde.

---

## HISTORICAL ARCHIVE

_(leer)_
