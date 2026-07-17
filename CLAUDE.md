# ai-use-case-scoring — Project CLAUDE.md

## Project Overview
A Next.js web application for scoring and evaluating AI use cases in organizations. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Package Manager:** npm
- **Runtime:** Node.js

## Project Structure
```
src/app/          — App Router pages and layouts
src/app/layout.tsx — Root layout (fonts, global styles)
src/app/page.tsx   — Home page
src/app/globals.css — Global CSS with Tailwind directives
public/            — Static assets
docs/              — Project documentation (specs, decisions, research)
```

## Documentation
All project documentation lives in `docs/`. This includes:
- Feature specs and requirements
- Architecture decisions (supplement `DECISIONS.md` for major ADRs)
- Research notes and references

## Development Commands
```bash
npm run dev    # Start dev server (localhost:3000)
npm run build  # Production build
npm run lint   # ESLint
```

## Key Conventions
- Use `src/app/` for all new pages and components
- Import alias `@/` maps to `src/`
- Server Components by default; add `'use client'` only when needed
- Prefer `next/image` over `<img>` for all images
- Prefer `next/font` for typography

## Current Project State
**Status:** Fakten-Scorer, Fall-Steckbrief und Rangliste implementiert, Build grün.
**Last milestone:** "Fall speichern"-Button (localStorage-Persistenz, `src/lib/storage.ts`) plus `/faelle`-Rangliste (`src/components/Rangliste.tsx`), sortiert nach Score mit Risiko-Fälle-ans-Ende-Regel. Details in `DECISIONS.md` ADR-003.
**Next step:** Siehe "Offene Punkte" in ADR-002 (Export/Sharing, echte Persistenz/Backend statt localStorage, erweiterte Scoring-Dimensionen, Onboarding).
