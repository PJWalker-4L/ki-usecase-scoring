import { NextResponse } from "next/server";
import {
  ARCHETYP_IDS,
  buildArchetypPromptBlock,
  isArchetypId,
} from "@/lib/archetypes";
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

  return `Du klassifizierst Arbeitsprozesse für ein Beratungstool (Klarsicht).

Ordne den beschriebenen Prozess genau EINEM dominanten Archetyp zu und generiere passende Ausgaben.

## Archetypen (IDs exakt verwenden)
${buildArchetypPromptBlock()}

## Beschriebener Prozess
Aktueller Ablauf: ${body.ablauf.trim()}
Ziel: ${body.ziel.trim()}${loesungBlock}

## Regeln
- beispielrichtungen: 2–4 konkrete Sätze im Konjunktiv ("So könnte KI …"), auf diesen Fall bezogen, aus dem Archetyp-Material abgeleitet — nicht frei erfunden.
- fallstricke: 2–4 Sätze, typische Fallstricke des Archetyps auf diesen Fall zugeschnitten.
- risikoVorschlag.begruendung: Alltagssprache, ohne Archetyp-Namen oder Fachjargon.
- risikoVorschlag.stufe: einer von gering, ueberschaubar, hoch, inakzeptabel.
- Bei Entwurf/Matching: Hinweis auf menschliche Freigabe in mindestens einer Beispielrichtung.
- Antworte ausschließlich als JSON-Objekt.`;
}

function parseClassification(raw: unknown): ClassificationResult | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  if (typeof data.archetypId !== "string" || !isArchetypId(data.archetypId)) {
    return null;
  }

  const beispielrichtungen = data.beispielrichtungen;
  const fallstricke = data.fallstricke;
  const risiko = data.risikoVorschlag;

  if (
    !Array.isArray(beispielrichtungen) ||
    beispielrichtungen.length < 2 ||
    !beispielrichtungen.every((s) => typeof s === "string" && s.trim())
  ) {
    return null;
  }

  if (
    !Array.isArray(fallstricke) ||
    fallstricke.length < 2 ||
    !fallstricke.every((s) => typeof s === "string" && s.trim())
  ) {
    return null;
  }

  if (!risiko || typeof risiko !== "object") return null;
  const rv = risiko as Record<string, unknown>;
  if (
    typeof rv.stufe !== "string" ||
    !isRisikoId(rv.stufe) ||
    typeof rv.begruendung !== "string" ||
    !rv.begruendung.trim()
  ) {
    return null;
  }

  return {
    archetypId: data.archetypId,
    beispielrichtungen: beispielrichtungen.map((s) => String(s).trim()),
    fallstricke: fallstricke.map((s) => String(s).trim()),
    risikoVorschlag: {
      stufe: rv.stufe,
      begruendung: rv.begruendung.trim(),
    },
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Klassifikation nicht konfiguriert (OPENAI_API_KEY fehlt)." },
      { status: 503 }
    );
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

  const schema = {
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

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "Du bist ein präziser Assistent für KI-Prozessberatung im Mittelstand. Antworte nur mit gültigem JSON.",
          },
          { role: "user", content: buildPrompt(body) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "prozess_klassifikation",
            strict: true,
            schema,
          },
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI classify failed:", response.status, detail);
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

    const parsed = parseClassification(JSON.parse(content));
    if (!parsed) {
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
