import { NextResponse } from "next/server";
import {
  ARCHETYP_IDS,
  buildArchetypPromptBlock,
  isArchetypId,
} from "@/lib/archetypes";
import {
  missingLlmConfigMessage,
  resolveLlmProvider,
} from "@/lib/llm-provider";
import { resolveGroqModel, groqUsesStrictJsonSchema } from "@/lib/groq-models";
import type { ClassificationResult, ClassifyRequest } from "@/types/classification";
import type { RisikoId } from "@/types/brief";

const RISIKO_STUFEN: RisikoId[] = [
  "gering",
  "ueberschaubar",
  "hoch",
  "inakzeptabel",
];

function isRisikoId(value: string): value is RisikoId {
  return (RISIKO_STUFEN as readonly string[]).includes(value);
}

function buildPrompt(body: ClassifyRequest): string {
  const loesungBlock = body.loesung?.trim()
    ? `\nLösungsansatz (optional): ${body.loesung.trim()}`
    : "";

  const allowedIds = ARCHETYP_IDS.join(" | ");

  return `Du bist ein erfahrener KI-Berater und schreibst für einen Fachbereichs-Nutzer im Mittelstand, der KEINE KI-Fachbegriffe kennt. Du kennst dich mit realen Automatisierungsprojekten aus und schreibst konkret, nicht werblich.

Ordne den beschriebenen Prozess genau EINEM dominanten Archetyp zu und leite daraus SUBSTANZIELLE, konkrete Automatisierungsrichtungen ab — keine generische Checkliste.

## Erlaubte archetypId-Werte (EXAKT einer dieser Strings, keine anderen Wörter!)
${allowedIds}

## Archetypen (Referenz — nutze "Typische Prozesse" und "Nutzen" als Grundlage für konkrete, fallbezogene Vorschläge)
${buildArchetypPromptBlock()}

## Beschriebener Prozess
Aktueller Ablauf: ${body.ablauf.trim()}
Ziel: ${body.ziel.trim()}${loesungBlock}

## Wie gute beispielrichtungen aussehen (Qualitätsmaßstab)
- Jeder Satz deckt eine ANDERE FACETTE des Falls ab — keine Synonyme derselben Aussage (nicht: "KI liest die Rechnung aus" / "KI erfasst die Rechnungsdaten" / "KI übernimmt das Auslesen" — das ist dreimal dieselbe Idee).
- Denkbare unterschiedliche Facetten, je nach Fall auswählen: (a) der Kernmechanismus des Archetyps auf den Fall angewendet, (b) eine Prüf-/Qualitätssicherungs-Facette (z. B. Plausibilitätscheck, Abgleich mit einer Referenz), (c) eine Weiterverarbeitungs-/Integrations-Facette (z. B. automatischer Anschluss an ein Folgesystem oder einen Freigabeschritt), (d) eine Facette für Sonderfälle/Ausnahmen (z. B. Eskalation bei Unsicherheit).
- Konkret genug, dass der Nutzer sich etwas vorstellen kann: welche Art von Information, welches System, welche Entscheidung — orientiert an den "Typischen Prozessen" des Archetyps, aber auf DIESEN Fall zugeschnitten.
- Realistischer Beratungston, keine Marketing-Versprechen ("automatisiert alles", "spart 100%").
- Formuliere im Konjunktiv/Möglichkeitsform (könnte, ließe sich, wäre denkbar), aber VARIIERE die Formulierung zwischen den Punkten — nicht jeden Satz mit derselben Phrase beginnen (also NICHT jedes Mal "So könnte KI …").

## Pflicht-JSON-Struktur (Feldnamen exakt so)
{
  "archetypId": "<einer der erlaubten Werte>",
  "beispielrichtungen": ["<Vorschlag 1>", "<Vorschlag 2>", "..."],
  "fallstricke": ["<Fallstrick 1>", "<Fallstrick 2>", "..."],
  "risikoVorschlag": { "stufe": "<gering|ueberschaubar|hoch|inakzeptabel>", "begruendung": "<Text>" }
}

## Regeln
- archetypId: NUR einer von: ${allowedIds}. Niemals andere Wörter wie "automatisierung".
- beispielrichtungen: genau 2–4 eigenständige, konkrete Vorschläge (siehe Qualitätsmaßstab oben). Unterschiedliche Satzanfänge.
- fallstricke: genau 2–4 Sätze, typische Fallstricke des Archetyps auf diesen Fall zugeschnitten, konkret statt generisch.
- risikoVorschlag.stufe: NUR einer von: gering, ueberschaubar, hoch, inakzeptabel.
- risikoVorschlag.begruendung: Alltagssprache, ohne Archetyp-Namen oder Fachjargon.
- Nur bei entwurf oder matching: Hinweis auf menschliche Freigabe in mindestens einer Beispielrichtung.
- Antworte ausschließlich mit dem JSON-Objekt, ohne Markdown, ohne Codeblock.`;
}

const ARCHETYP_ALIASES: Record<string, (typeof ARCHETYP_IDS)[number]> = {
  klassifikation: "klassifikation",
  triage: "klassifikation",
  classification: "klassifikation",
  extraktion: "extraktion",
  extraction: "extraktion",
  ocr: "extraktion",
  zusammenfassung: "zusammenfassung",
  summary: "zusammenfassung",
  summarization: "zusammenfassung",
  entwurf: "entwurf",
  generierung: "entwurf",
  generation: "entwurf",
  drafting: "entwurf",
  wissensabruf: "wissensabruf",
  rag: "wissensabruf",
  knowledge: "wissensabruf",
  transformation: "transformation",
  matching: "matching",
  abgleich: "matching",
  empfehlung: "matching",
};

const RISIKO_ALIASES: Record<string, RisikoId> = {
  gering: "gering",
  niedrig: "gering",
  low: "gering",
  ueberschaubar: "ueberschaubar",
  überschaubar: "ueberschaubar",
  mittel: "ueberschaubar",
  medium: "ueberschaubar",
  hoch: "hoch",
  high: "hoch",
  inakzeptabel: "inakzeptabel",
  unacceptable: "inakzeptabel",
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

function asStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function inferArchetypFromText(texts: string[]): (typeof ARCHETYP_IDS)[number] | null {
  const blob = texts.join(" ").toLowerCase();
  const scores: Record<(typeof ARCHETYP_IDS)[number], number> = {
    klassifikation: 0,
    extraktion: 0,
    zusammenfassung: 0,
    entwurf: 0,
    wissensabruf: 0,
    transformation: 0,
    matching: 0,
  };

  const rules: { id: (typeof ARCHETYP_IDS)[number]; terms: string[] }[] = [
    { id: "extraktion", terms: ["extrah", "auslesen", "ocr", "rechnung", "formular", "felder"] },
    { id: "klassifikation", terms: ["kategor", "routing", "sortier", "triage", "weiterleit"] },
    { id: "zusammenfassung", terms: ["zusammenfass", "protokoll", "verdicht"] },
    { id: "entwurf", terms: ["entwurf", "generier", "vorlage", "anschreiben", "antworttext"] },
    { id: "wissensabruf", terms: ["wissens", "rag", "dokumentenbestand", "nachschlag"] },
    { id: "transformation", terms: ["übersetz", "umschreib", "format", "tonalität"] },
    { id: "matching", terms: ["matching", "zuordn", "empfehl", "bewerber"] },
  ];

  for (const rule of rules) {
    for (const term of rule.terms) {
      if (blob.includes(term)) scores[rule.id] += 1;
    }
  }

  const ranked = ARCHETYP_IDS.map((id) => ({ id, score: scores[id] })).sort(
    (a, b) => b.score - a.score
  );
  return ranked[0].score > 0 ? ranked[0].id : null;
}

function parseClassification(raw: unknown): ClassificationResult | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  let archetypId = normalizeArchetypId(
    data.archetypId ?? data.archetypeId ?? data.archetyp ?? data.archetype
  );

  const beispielrichtungen = asStringList(
    data.beispielrichtungen ?? data.beispiele ?? data.directions
  ).slice(0, 4);
  const fallstricke = asStringList(
    data.fallstricke ?? data.pitfalls ?? data.risiken
  ).slice(0, 4);

  if (beispielrichtungen.length < 2 || fallstricke.length < 2) return null;

  if (!archetypId) {
    archetypId = inferArchetypFromText([...beispielrichtungen, ...fallstricke]);
  }
  if (!archetypId) return null;

  const risikoRaw =
    data.risikoVorschlag ?? data.risiko ?? data.risk ?? data.riskSuggestion;
  if (!risikoRaw || typeof risikoRaw !== "object") return null;
  const rv = risikoRaw as Record<string, unknown>;
  const stufe = normalizeRisikoId(rv.stufe ?? rv.level ?? rv.id);
  const begruendung =
    typeof rv.begruendung === "string"
      ? rv.begruendung.trim()
      : typeof rv.reason === "string"
        ? rv.reason.trim()
        : typeof rv.begruendungText === "string"
          ? rv.begruendungText.trim()
          : "";

  if (!stufe || !begruendung) return null;

  return {
    archetypId,
    beispielrichtungen,
    fallstricke,
    risikoVorschlag: { stufe, begruendung },
  };
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(jsonText);
}

const CLASSIFICATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "archetypId",
    "beispielrichtungen",
    "fallstricke",
    "risikoVorschlag",
  ],
  properties: {
    archetypId: { type: "string", enum: [...ARCHETYP_IDS] },
    beispielrichtungen: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: { type: "string" },
    },
    fallstricke: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: { type: "string" },
    },
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

export async function POST(request: Request) {
  const llm = resolveLlmProvider();
  if (!llm) {
    return NextResponse.json({ error: missingLlmConfigMessage() }, { status: 503 });
  }

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
        json_schema: {
          name: "prozess_klassifikation",
          strict: true,
          schema: CLASSIFICATION_SCHEMA,
        },
      }
    : { type: "json_object" as const };

  try {
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
          { role: "user", content: buildPrompt(body) },
        ],
        response_format: responseFormat,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`${llm.provider} classify failed:`, response.status, detail);
      return NextResponse.json(
        { error: "Klassifikation fehlgeschlagen." },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Leere Klassifikations-Antwort." },
        { status: 502 }
      );
    }

    const parsedJson = parseJsonContent(content);
    const parsed = parseClassification(parsedJson);
    if (!parsed) {
      console.error("Invalid classification payload:", content.slice(0, 1200));
      return NextResponse.json(
        { error: "Klassifikations-Antwort ungültig." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed satisfies ClassificationResult);
  } catch (error) {
    console.error("Classify route error:", error);
    return NextResponse.json(
      { error: "Klassifikation fehlgeschlagen." },
      { status: 502 }
    );
  }
}
