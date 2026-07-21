import { NextResponse } from "next/server";
import {
  AUTOMATISIERUNGSTYP_IDS,
  normalizeAutomatisierungstyp,
} from "@/lib/automatisierungstyp";
import {
  ARCHETYP_IDS,
  buildArchetypPromptBlock,
  isArchetypId,
} from "@/lib/archetypes";
import { resolveGroqModel, groqUsesStrictJsonSchema } from "@/lib/groq-models";
import {
  missingLlmConfigMessage,
  resolveLlmProvider,
} from "@/lib/llm-provider";
import { formatAnswersForPrompt } from "@/lib/scoring";
import type {
  Beispielrichtung,
  ClassifyRequest,
  InitialClassificationResult,
} from "@/types/classification";
import type { RisikoId } from "@/types/brief";
import { RISIKO_OPTIONS } from "@/types/brief";

const RISIKO_STUFEN: RisikoId[] = [
  "gering",
  "ueberschaubar",
  "hoch",
  "inakzeptabel",
];

function isRisikoId(value: string): value is RisikoId {
  return (RISIKO_STUFEN as readonly string[]).includes(value);
}

function buildInitialPrompt(body: Extract<ClassifyRequest, { phase: "initial" }>): string {
  const loesungBlock = body.loesung?.trim()
    ? `\nLösungsansatz (optional): ${body.loesung.trim()}`
    : "";
  const allowedIds = ARCHETYP_IDS.join(" | ");

  return `Du klassifizierst Arbeitsprozesse für ein Beratungstool (Klarsicht).

Ordne den Prozess genau EINEM Archetyp zu und schätze das Risiko beim KI-Einsatz ein. Noch KEINE Beispielrichtungen.

## Erlaubte archetypId: ${allowedIds}

## Archetypen (Referenz)
${buildArchetypPromptBlock()}

## Prozess
Aktueller Ablauf: ${body.ablauf.trim()}
Ziel: ${body.ziel.trim()}${loesungBlock}

Antworte nur mit JSON:
{"archetypId":"...","risikoVorschlag":{"stufe":"gering|ueberschaubar|hoch|inakzeptabel","begruendung":"..."}}`;
}

function buildBeispielePrompt(body: Extract<ClassifyRequest, { phase: "beispiele" }>): string {
  const loesungBlock = body.loesung?.trim()
    ? `\nLösungsansatz (optional): ${body.loesung.trim()}`
    : "";
  const risikoLabel =
    RISIKO_OPTIONS.find((r) => r.id === body.risiko)?.label ?? body.risiko;
  const typIds = AUTOMATISIERUNGSTYP_IDS.join(" | ");

  return `Du bist ein erfahrener KI-Berater für den Mittelstand. Der Nutzer hat seinen Fall beschrieben, Fakten beantwortet und das Risiko gewählt. Jetzt brauchst du passende Automatisierungsoptionen.

## Prozess
Aktueller Ablauf: ${body.ablauf.trim()}
Ziel: ${body.ziel.trim()}${loesungBlock}

## Interner Archetyp (nicht dem Nutzer zeigen): ${body.archetypId}

## Fakten aus dem Wizard
${formatAnswersForPrompt(body.answers)}

## Vom Nutzer gewähltes Risiko: ${risikoLabel}

## Automatisierungstyp pro Vorschlag (Feld "typ")
- agent: KI-Agent — arbeitet teilautonom, plant und führt mehrere Schritte aus
- workflow: Workflow-Automatisierung — fester, wiederholbarer Ablauf (n8n, Make, Zapier)
- assistenz: Assistenz / Einzelaufgabe — Mensch bleibt in der Schleife
- sonstiges: Andere Form (z. B. eingebettet in bestehendes System)

## Qualitätsmaßstab für beispielrichtungen
- 2–4 eigenständige Vorschläge, jeder mit anderer Facette (nicht Synonyme)
- Konjunktiv/Möglichkeitsform, aber unterschiedliche Satzanfänge
- Passend zu Archetyp, Fakten (besonders Datenlage & Wiederholbarkeit) und Risiko
- Jeder Vorschlag bekommt den passenden typ (${typIds})

Antworte nur mit JSON:
{
  "beispielrichtungen": [
    {"text": "...", "typ": "workflow"},
    {"text": "...", "typ": "assistenz"}
  ],
  "fallstricke": ["...", "..."]
}`;
}

const ARCHETYP_ALIASES: Record<string, (typeof ARCHETYP_IDS)[number]> = {
  klassifikation: "klassifikation",
  triage: "klassifikation",
  extraktion: "extraktion",
  extraction: "extraktion",
  zusammenfassung: "zusammenfassung",
  entwurf: "entwurf",
  wissensabruf: "wissensabruf",
  rag: "wissensabruf",
  transformation: "transformation",
  matching: "matching",
};

const RISIKO_ALIASES: Record<string, RisikoId> = {
  gering: "gering",
  niedrig: "gering",
  ueberschaubar: "ueberschaubar",
  überschaubar: "ueberschaubar",
  mittel: "ueberschaubar",
  hoch: "hoch",
  inakzeptabel: "inakzeptabel",
};

function normalizeArchetypId(raw: unknown): (typeof ARCHETYP_IDS)[number] | null {
  if (typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase();
  if (isArchetypId(key)) return key;
  if (ARCHETYP_ALIASES[key]) return ARCHETYP_ALIASES[key];
  for (const id of ARCHETYP_IDS) {
    if (key.includes(id)) return id;
  }
  return null;
}

function normalizeRisikoId(raw: unknown): RisikoId | null {
  if (typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase();
  if (isRisikoId(key)) return key;
  return RISIKO_ALIASES[key] ?? null;
}

function parseBeispielrichtungen(raw: unknown): Beispielrichtung[] {
  if (!Array.isArray(raw)) return [];

  const result: Beispielrichtung[] = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      result.push({ text: item.trim(), typ: "assistenz" });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const text =
      typeof row.text === "string"
        ? row.text.trim()
        : typeof row.beschreibung === "string"
          ? row.beschreibung.trim()
          : "";
    const typ = normalizeAutomatisierungstyp(row.typ ?? row.type ?? row.art);
    if (text && typ) result.push({ text, typ });
  }
  return result.slice(0, 4);
}

function asStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function parseInitial(raw: unknown): InitialClassificationResult | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const archetypId = normalizeArchetypId(data.archetypId);
  if (!archetypId) return null;

  const risikoRaw = data.risikoVorschlag ?? data.risiko;
  if (!risikoRaw || typeof risikoRaw !== "object") return null;
  const rv = risikoRaw as Record<string, unknown>;
  const stufe = normalizeRisikoId(rv.stufe ?? rv.level);
  const begruendung =
    typeof rv.begruendung === "string"
      ? rv.begruendung.trim()
      : typeof rv.reason === "string"
        ? rv.reason.trim()
        : "";
  if (!stufe || !begruendung) return null;

  return { archetypId, risikoVorschlag: { stufe, begruendung } };
}

function parseBeispiele(raw: unknown): {
  beispielrichtungen: Beispielrichtung[];
  fallstricke: string[];
} | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const beispielrichtungen = parseBeispielrichtungen(
    data.beispielrichtungen ?? data.beispiele
  );
  const fallstricke = asStringList(data.fallstricke ?? data.pitfalls).slice(0, 4);
  if (beispielrichtungen.length < 2 || fallstricke.length < 2) return null;
  return { beispielrichtungen, fallstricke };
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return JSON.parse(fenced ? fenced[1].trim() : trimmed);
}

const INITIAL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["archetypId", "risikoVorschlag"],
  properties: {
    archetypId: { type: "string", enum: [...ARCHETYP_IDS] },
    risikoVorschlag: {
      type: "object",
      additionalProperties: false,
      required: ["stufe", "begruendung"],
      properties: {
        stufe: {
          type: "string",
          enum: ["gering", "ueberschaubar", "hoch", "inakzeptabel"],
        },
        begruendung: { type: "string" },
      },
    },
  },
};

const BEISPIELE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["beispielrichtungen", "fallstricke"],
  properties: {
    beispielrichtungen: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["text", "typ"],
        properties: {
          text: { type: "string" },
          typ: { type: "string", enum: [...AUTOMATISIERUNGSTYP_IDS] },
        },
      },
    },
    fallstricke: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: { type: "string" },
    },
  },
};

async function callLlm(
  prompt: string,
  schema: object,
  schemaName: string
): Promise<{ ok: true; content: string } | { ok: false; error: string }> {
  const llm = resolveLlmProvider();
  if (!llm) {
    return { ok: false, error: missingLlmConfigMessage() };
  }

  const model =
    llm.provider === "groq"
      ? await resolveGroqModel(llm.apiKey, llm.model)
      : llm.model;

  const useStrictSchema =
    llm.provider === "groq"
      ? groqUsesStrictJsonSchema(model)
      : llm.responseFormat === "json_schema_strict";

  const responseFormat = useStrictSchema
    ? {
        type: "json_schema" as const,
        json_schema: { name: schemaName, strict: true, schema },
      }
    : { type: "json_object" as const };

  const response = await fetch(llm.chatCompletionsUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${llm.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "Du bist ein präziser Assistent für KI-Prozessberatung im Mittelstand. Antworte nur mit gültigem JSON.",
        },
        { role: "user", content: prompt },
      ],
      response_format: responseFormat,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`${llm.provider} classify failed:`, response.status, detail);
    return { ok: false, error: "Klassifikation fehlgeschlagen." };
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return { ok: false, error: "Leere Klassifikations-Antwort." };
  }
  return { ok: true, content };
}

export async function POST(request: Request) {
  let body: ClassifyRequest;
  try {
    body = (await request.json()) as ClassifyRequest;
  } catch {
    return NextResponse.json({ error: "Ungültiger Request-Body." }, { status: 400 });
  }

  if (!body.ablauf?.trim() || !body.ziel?.trim()) {
    return NextResponse.json(
      { error: "Ablauf und Ziel sind Pflichtfelder." },
      { status: 400 }
    );
  }

  try {
    if (body.phase === "beispiele") {
      if (!body.archetypId || !isArchetypId(body.archetypId)) {
        return NextResponse.json({ error: "archetypId fehlt oder ungültig." }, { status: 400 });
      }
      if (!body.risiko || !isRisikoId(body.risiko)) {
        return NextResponse.json({ error: "risiko fehlt oder ungültig." }, { status: 400 });
      }
      if (!body.answers || typeof body.answers !== "object") {
        return NextResponse.json({ error: "answers fehlen." }, { status: 400 });
      }

      const llmResult = await callLlm(
        buildBeispielePrompt(body),
        BEISPIELE_SCHEMA,
        "prozess_beispiele"
      );
      if (!llmResult.ok) {
        return NextResponse.json({ error: llmResult.error }, { status: 502 });
      }

      const parsed = parseBeispiele(parseJsonContent(llmResult.content));
      if (!parsed) {
        console.error("Invalid beispiele payload:", llmResult.content.slice(0, 1200));
        return NextResponse.json(
          { error: "Klassifikations-Antwort ungültig." },
          { status: 502 }
        );
      }
      return NextResponse.json(parsed);
    }

    const llmResult = await callLlm(
      buildInitialPrompt({ phase: "initial", ablauf: body.ablauf, ziel: body.ziel, loesung: body.loesung }),
      INITIAL_SCHEMA,
      "prozess_initial"
    );
    if (!llmResult.ok) {
      return NextResponse.json({ error: llmResult.error }, { status: 502 });
    }

    const parsed = parseInitial(parseJsonContent(llmResult.content));
    if (!parsed) {
      console.error("Invalid initial payload:", llmResult.content.slice(0, 800));
      return NextResponse.json(
        { error: "Klassifikations-Antwort ungültig." },
        { status: 502 }
      );
    }
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Classify route error:", error);
    return NextResponse.json(
      { error: "Klassifikation fehlgeschlagen." },
      { status: 502 }
    );
  }
}
