#!/usr/bin/env node
// A/B-Vergleich zweier LLMs ueber denselben Fallsatz.
//
// Voraussetzung: Dev-Server laeuft und ALLOW_MODEL_OVERRIDE=true steht in .env.local.
//
//   npm run ab
//   npm run ab -- --models openai/gpt-oss-20b,openai/gpt-oss-120b --runs 2
//
// Ergebnis: Kennzahlen auf der Konsole plus Markdown-Report unter docs/eval/.
// Der Report zeigt die Ausgaben beider Modelle anonymisiert als "Variante A/B";
// die Zuordnung steht am Ende der Datei, damit blind bewertet werden kann.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULTS = {
  models: "openai/gpt-oss-20b,openai/gpt-oss-120b",
  cases: "docs/eval/faelle.json",
  base: "http://localhost:3000",
  runs: "1",
  out: "docs/eval",
  limit: "0",
};

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    if (!(key in DEFAULTS)) {
      throw new Error(`Unbekannte Option --${key}. Erlaubt: ${Object.keys(DEFAULTS).join(", ")}`);
    }
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Option --${key} braucht einen Wert.`);
    }
    args[key] = value;
    i += 1;
  }
  return {
    models: args.models.split(",").map((m) => m.trim()).filter(Boolean),
    casesPath: args.cases,
    base: args.base.replace(/\/+$/, ""),
    runs: Math.max(1, Number.parseInt(args.runs, 10) || 1),
    outDir: args.out,
    // 0 = alle Faelle. Kleinere Werte fuer schnelle Kontrolllaeufe.
    limit: Math.max(0, Number.parseInt(args.limit, 10) || 0),
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function postClassify(base, payload, attempt = 1) {
  const response = await fetch(`${base}/api/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.status === 429 && attempt <= 4) {
    const waitMs = 2000 * attempt;
    process.stdout.write(` (Rate Limit, warte ${waitMs / 1000}s)`);
    await sleep(waitMs);
    return postClassify(base, payload, attempt + 1);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error ?? `HTTP ${response.status}`);
  }
  return body;
}

/** Gleiche Heuristik wie im Endpoint: stereotype Satzanfaenge erkennen. */
function hasRepetitiveOpenings(items) {
  if (items.length < 2) return false;
  const soKoennte = items.filter((item) => /^so\s+k[oö]nnte\b/i.test(item.text.trim()));
  if (soKoennte.length >= 2) return true;
  const openings = items.map((item) =>
    item.text.trim().split(/\s+/).slice(0, 2).join(" ").toLowerCase()
  );
  return new Set(openings).size < openings.length;
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

async function runCase(base, model, fall) {
  const started = Date.now();

  const initial = await postClassify(base, {
    phase: "initial",
    ablauf: fall.ablauf,
    ziel: fall.ziel,
    loesung: fall.loesung || undefined,
    modelOverride: model,
  });

  const risiko = fall.risiko || initial.risikoVorschlag?.stufe;
  if (!risiko) throw new Error("Kein Risiko aus Phase 1 erhalten.");

  const beispiele = await postClassify(base, {
    phase: "beispiele",
    ablauf: fall.ablauf,
    ziel: fall.ziel,
    loesung: fall.loesung || undefined,
    archetypId: initial.archetypId,
    risiko,
    answers: fall.answers,
    modelOverride: model,
  });

  const optionen = beispiele.beispielrichtungen ?? [];

  return {
    ok: true,
    caseId: fall.id,
    model,
    reportedModel: beispiele.model ?? initial.model ?? model,
    durationMs: Date.now() - started,
    archetypId: initial.archetypId,
    risikoVorschlag: initial.risikoVorschlag,
    genutztesRisiko: risiko,
    optionen,
    fallstricke: beispiele.fallstricke ?? [],
    empfehlung: beispiele.empfehlung ?? null,
    typenAnzahl: new Set(optionen.map((item) => item.typ)).size,
    repetitiv: hasRepetitiveOpenings(optionen),
  };
}

function aggregate(results, faelleById) {
  const ok = results.filter((r) => r.ok);
  const fehler = results.filter((r) => !r.ok);
  const mitEmpfehlung = ok.filter((r) => r.empfehlung != null);

  const indexVerteilung = {};
  for (const r of mitEmpfehlung) {
    const key = String(r.empfehlung.index);
    indexVerteilung[key] = (indexVerteilung[key] ?? 0) + 1;
  }

  const erwartungsTreffer = ok.filter((r) => {
    const erwartet = faelleById.get(r.caseId)?.erwarteterArchetyp;
    return erwartet ? r.archetypId === erwartet : false;
  }).length;
  const mitErwartung = ok.filter((r) => faelleById.get(r.caseId)?.erwarteterArchetyp).length;

  const share = (count, total) => (total === 0 ? null : count / total);

  return {
    laeufe: results.length,
    erfolgreich: ok.length,
    fehler: fehler.length,
    fehlerDetails: fehler.map((r) => `${r.caseId}: ${r.error}`),
    archetypTrefferQuote: share(erwartungsTreffer, mitErwartung),
    empfehlungQuote: share(mitEmpfehlung.length, ok.length),
    indexNullQuote: share(indexVerteilung["0"] ?? 0, mitEmpfehlung.length),
    indexVerteilung,
    repetitivQuote: share(ok.filter((r) => r.repetitiv).length, ok.length),
    typenDurchschnitt: ok.length
      ? ok.reduce((sum, r) => sum + r.typenAnzahl, 0) / ok.length
      : null,
    optionenDurchschnitt: ok.length
      ? ok.reduce((sum, r) => sum + r.optionen.length, 0) / ok.length
      : null,
    begruendungWorte: mitEmpfehlung.length
      ? mitEmpfehlung.reduce((sum, r) => sum + countWords(r.empfehlung.begruendung), 0) /
        mitEmpfehlung.length
      : null,
    dauerSchnittMs: ok.length
      ? Math.round(ok.reduce((sum, r) => sum + r.durationMs, 0) / ok.length)
      : null,
  };
}

const pct = (value) => (value == null ? "—" : `${Math.round(value * 100)} %`);
const num = (value, digits = 1) => (value == null ? "—" : value.toFixed(digits));

function renderRun(run) {
  if (!run.ok) return `_Fehlgeschlagen: ${run.error}_\n`;

  const optionen = run.optionen
    .map((item, index) => {
      const marker = run.empfehlung?.index === index ? " **← empfohlen**" : "";
      return `${index}. \`${item.typ}\`${marker} — ${item.text}`;
    })
    .join("\n");

  const empfehlung = run.empfehlung
    ? `\n**Begruendung der Empfehlung:** ${run.empfehlung.begruendung}\n`
    : "\n**Empfehlung:** keine verwertbare Empfehlung geliefert.\n";

  const fallstricke = run.fallstricke.map((item) => `- ${item}`).join("\n");

  return [
    `Archetyp (intern): \`${run.archetypId}\` · Risiko-Vorschlag: \`${run.risikoVorschlag?.stufe ?? "—"}\` · Dauer: ${(run.durationMs / 1000).toFixed(1)} s`,
    "",
    optionen || "_keine Optionen_",
    empfehlung,
    "**Fallstricke:**",
    fallstricke || "_keine_",
    "",
  ].join("\n");
}

function renderReport({ models, faelle, byModel, summaries, runs, variantLabels }) {
  const lines = [];
  lines.push("# A/B-Vergleich der Klassifikations-Modelle");
  lines.push("");
  lines.push(`Erstellt: ${new Date().toISOString()}`);
  lines.push(`Faelle: ${faelle.length} · Durchlaeufe pro Fall: ${runs}`);
  lines.push("");
  lines.push("## Kennzahlen");
  lines.push("");
  lines.push("| Kennzahl | " + models.map((m) => variantLabels.get(m)).join(" | ") + " |");
  lines.push("| --- | " + models.map(() => "---").join(" | ") + " |");

  const rows = [
    ["Erfolgreiche Laeufe", (s) => `${s.erfolgreich} / ${s.laeufe}`],
    ["Archetyp wie erwartet", (s) => pct(s.archetypTrefferQuote)],
    ["Empfehlung geliefert", (s) => pct(s.empfehlungQuote)],
    ["davon Index 0 (Positions-Bias)", (s) => pct(s.indexNullQuote)],
    ["Wiederholte Satzanfaenge", (s) => pct(s.repetitivQuote)],
    ["Optionen im Schnitt", (s) => num(s.optionenDurchschnitt)],
    ["Unterschiedliche Typen im Schnitt", (s) => num(s.typenDurchschnitt)],
    ["Worte je Begruendung", (s) => num(s.begruendungWorte, 0)],
    ["Dauer je Fall", (s) => (s.dauerSchnittMs == null ? "—" : `${(s.dauerSchnittMs / 1000).toFixed(1)} s`)],
  ];

  for (const [label, render] of rows) {
    lines.push(`| ${label} | ` + models.map((m) => render(summaries.get(m))).join(" | ") + " |");
  }

  lines.push("");
  lines.push(
    "Lesehilfe: Ein hoher Wert bei „Index 0“ deutet darauf hin, dass das Modell nicht wirklich auswaehlt, sondern die erste Option nimmt. Bei gleichmaessiger Verteilung ueber die Indizes trifft es eine echte Wahl."
  );
  lines.push("");
  lines.push("Index-Verteilung:");
  lines.push("");
  for (const model of models) {
    const verteilung = summaries.get(model).indexVerteilung;
    const text = Object.keys(verteilung).length
      ? Object.entries(verteilung)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([index, count]) => `Index ${index}: ${count}`)
          .join(" · ")
      : "keine Empfehlungen";
    lines.push(`- ${variantLabels.get(model)}: ${text}`);
  }

  const fehler = models.flatMap((m) =>
    summaries.get(m).fehlerDetails.map((d) => `- ${variantLabels.get(m)} — ${d}`)
  );
  if (fehler.length) {
    lines.push("");
    lines.push("## Fehler");
    lines.push("");
    lines.push(...fehler);
  }

  lines.push("");
  lines.push("## Blindvergleich je Fall");
  lines.push("");
  lines.push(
    "Bewerte pro Fall, welche Variante die brauchbareren Optionen und die plausiblere Empfehlung liefert — ohne unten nachzusehen."
  );

  for (const fall of faelle) {
    lines.push("");
    lines.push(`### ${fall.titel}`);
    lines.push("");
    lines.push(`**Ablauf:** ${fall.ablauf}`);
    lines.push("");
    lines.push(`**Ziel:** ${fall.ziel}`);
    if (fall.erwarteterArchetyp) {
      lines.push("");
      lines.push(`_Erwarteter Archetyp: \`${fall.erwarteterArchetyp}\`_`);
    }

    for (const model of models) {
      const runsForCase = byModel.get(model).filter((r) => r.caseId === fall.id);
      lines.push("");
      lines.push(`#### ${variantLabels.get(model)}`);
      runsForCase.forEach((run, index) => {
        if (runsForCase.length > 1) {
          lines.push("");
          lines.push(`_Durchlauf ${index + 1}_`);
        }
        lines.push("");
        lines.push(renderRun(run));
      });
    }
  }

  lines.push("");
  lines.push("## Auflösung");
  lines.push("");
  lines.push("Erst nach der Bewertung lesen:");
  lines.push("");
  for (const model of models) {
    lines.push(`- ${variantLabels.get(model)} = \`${model}\``);
  }
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const { models, casesPath, base, runs, outDir, limit } = parseArgs(process.argv.slice(2));
  if (models.length < 2) {
    throw new Error("Mindestens zwei Modelle angeben, z. B. --models a,b");
  }

  const raw = JSON.parse(await readFile(path.resolve(casesPath), "utf8"));
  const alleFaelle = raw.faelle ?? raw;
  if (!Array.isArray(alleFaelle) || alleFaelle.length === 0) {
    throw new Error(`Keine Faelle in ${casesPath} gefunden.`);
  }
  const faelle = limit > 0 ? alleFaelle.slice(0, limit) : alleFaelle;
  const faelleById = new Map(faelle.map((fall) => [fall.id, fall]));

  console.log(`Basis: ${base}`);
  console.log(`Modelle: ${models.join(", ")}`);
  console.log(`Faelle: ${faelle.length} · Durchlaeufe je Fall: ${runs}`);
  console.log("");

  const byModel = new Map();

  for (const model of models) {
    const results = [];
    console.log(`— ${model}`);
    for (const fall of faelle) {
      for (let run = 1; run <= runs; run += 1) {
        const suffix = runs > 1 ? ` (Lauf ${run})` : "";
        process.stdout.write(`  ${fall.id}${suffix} … `);
        try {
          const result = await runCase(base, model, fall);
          results.push(result);
          const empfehlung = result.empfehlung ? `Index ${result.empfehlung.index}` : "keine Empfehlung";
          console.log(
            `${result.archetypId}, ${result.optionen.length} Optionen, ${empfehlung}${result.repetitiv ? ", repetitiv" : ""}`
          );
        } catch (error) {
          results.push({ ok: false, caseId: fall.id, model, error: error.message });
          console.log(`Fehler: ${error.message}`);
        }
        await sleep(600);
      }
    }
    byModel.set(model, results);
    console.log("");
  }

  const summaries = new Map(
    models.map((model) => [model, aggregate(byModel.get(model), faelleById)])
  );

  // Variantennamen zufaellig zuordnen, damit im Report nicht am Namen erkennbar
  // ist, welches Modell dahintersteht.
  const letters = ["A", "B", "C", "D", "E"];
  const shuffled = [...models].sort(() => Math.random() - 0.5);
  const variantLabels = new Map(
    shuffled.map((model, index) => [model, `Variante ${letters[index] ?? index + 1}`])
  );

  console.log("Zusammenfassung");
  for (const model of models) {
    const s = summaries.get(model);
    console.log(
      `  ${model}: ${s.erfolgreich}/${s.laeufe} ok · Archetyp-Treffer ${pct(s.archetypTrefferQuote)} · Empfehlung ${pct(s.empfehlungQuote)} · Index-0-Anteil ${pct(s.indexNullQuote)} · repetitiv ${pct(s.repetitivQuote)} · Typen ⌀ ${num(s.typenDurchschnitt)} · ${s.dauerSchnittMs == null ? "—" : `${(s.dauerSchnittMs / 1000).toFixed(1)} s/Fall`}`
    );
  }

  const report = renderReport({ models, faelle, byModel, summaries, runs, variantLabels });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const reportPath = path.join(outDir, `ab-report-${stamp}.md`);
  const dataPath = path.join(outDir, `ab-raw-${stamp}.json`);

  await mkdir(path.resolve(outDir), { recursive: true });
  await writeFile(path.resolve(reportPath), report, "utf8");
  await writeFile(
    path.resolve(dataPath),
    JSON.stringify({ models, runs, results: Object.fromEntries(byModel) }, null, 2),
    "utf8"
  );

  console.log("");
  console.log(`Report:   ${reportPath}`);
  console.log(`Rohdaten: ${dataPath}`);
}

main().catch((error) => {
  console.error(`\nAbbruch: ${error.message}`);
  process.exitCode = 1;
});
