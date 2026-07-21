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
src/app/               — App Router pages and layouts
src/components/ui/     — shadcn/Radix primitives
src/components/shared/ — product composites (PageHeader, ChoiceGroup, FlowShell, …)
src/components/        — feature screens (FaktenScorer, Rangliste, Landing, …)
src/lib/               — scoring, storage, utils
public/                — Static assets
docs/                  — Project documentation (specs, decisions, research)
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
**Status:** v2 Archetyp-Flow implementiert (Backend-Klassifikation, Beispielrichtungen, Risiko-Schritt). Build grün erwartet.
**Last milestone:** Wizard: Steckbrief → Beispielrichtungen → 6 Fragen → Risiko → Ergebnis; Inakzeptabel-Anzeige getrennt; Spec/ADR synchronisiert.
**Next step:** OPENAI_API_KEY setzen, Validierung mit 5–8 echten Fällen (≥70 % brauchbar).
