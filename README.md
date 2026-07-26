# KI Use Case Scoring

Next.js-App zur Bewertung und Priorisierung von KI-Anwendungsfällen.

## Start

```bash
npm install
cp .env.example .env.local
# GROQ_API_KEY in .env.local eintragen (siehe unten)
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

## LLM-Klassifikation konfigurieren

`POST /api/classify` braucht einen serverseitigen LLM-Zugang. Priorität:

1. **`GROQ_API_KEY`** (empfohlen, Free Tier, Modell `openai/gpt-oss-20b`)
2. `XAI_API_KEY` / `GROK_API_KEY`
3. `OPENAI_API_KEY`
4. **Vercel AI Gateway** — `AI_GATEWAY_API_KEY` oder OIDC (`vercel env pull` / Deployment auf Vercel)

Lokal:

```bash
cp .env.example .env.local
# GROQ_API_KEY=gsk_... eintragen
```

Auf Vercel: Environment Variable `GROQ_API_KEY` (oder `AI_GATEWAY_API_KEY`) unter Project → Settings → Environment Variables setzen und neu deployen.

Ohne Key läuft der Wizard weiter, die KI-Analyse (Archetyp/Beispiele) entfällt.

## Scripts

```bash
npm run dev    # Dev-Server
npm run build  # Production-Build
npm run lint   # ESLint
```
