# DECISIONS.md — Architekturentscheidungen

## ACTIVE DECISIONS

---

### [ADR-019] Nutzenprognose je Lösung — Ersparnis und Restzeit erlaubt

**Datum:** 2026-08-05

**Entscheidung:**

#### Positionierung

- Klarsicht zeigt eine **verständliche Nutzenprognose** (Restzeit nach Automatisierung + mögliche Ersparnis), ohne zur Anbieter-Rechnung zu werden.
- Glaubwürdigkeit: Baseline getrennt halten; Prognose an **konkrete Beispielrichtungen** binden; Konjunktiv + „ca."; später Realität dagegenhalten (PRD Inkrement I). Keine automatische Messung aus laufenden Systemen.

#### Was sich ändert gegenüber der früheren Anti-Ersparnis-Regel

- **Baseline** (`hoursPerMonth` / `baselineStunden`, Label „aktuell gebundene Arbeitszeit"): weiterhin **nur Ist-Zustand**, nie als Ersparnis formuliert (ADR-009 / v1-Spec bleiben für diese Zahl gültig).
- **Neu (v2 / Inkrement F):** Pro `beispielrichtung` schätzt das LLM:
  - `stundenNachher` (Y) — „könnte nach Automatisierung noch ca. Y Std./Monat dauern"
  - `ersparnisStunden` (X) — „könnte ca. X Std./Monat sparen"
- Anzeige **inline an jeder Option** im Ergebnis (und Beispiellösungen-Sheet). Optional später ein Detail-Screen mit mehr Auswertung — Ausbau, kein Ersatz.

#### Abgrenzung zu Inkrement E

- E-Netto = Baseline − **Prüfaufwand** (Kostenblock Human-in-the-loop).
- F-Y = geschätzte **Rest-Prozesszeit** einer Lösung.
- Getrennt beschriften; nicht dieselbe Zahl.

#### Scope

- Fließt **nicht** in `computeScores()`.
- Spec: `klarsicht_v2_prd.md` (Positionierung, §4, E/F/I), `archetyp_klassifikation_spec.md` Phase 2.
- Implementierung der LLM-Felder und UI ist **v2-Arbeit** — dieses ADR legt die Produktentscheidung fest.

**Konsequenz:** Hebt das pauschale UI-Verbot „nirgends Ersparnis" für die **Nutzenprognose** auf; behält es für die **Baseline-Zahl**.

---

### [ADR-018] Beispiele inline im Ergebnis — kein eigener Wizard-Schritt

**Datum:** 2026-08-05

**Entscheidung:**

#### Flow

- Nach dem Risiko-Schritt: Phase-2-LLM (Ladescreen `classifying-beispiele`) → direkt **Ergebnis**.
- Der eigene Wizard-Schritt „Beispiele für Automatisierungsoptionen" mit CTA „Ergebnis anzeigen" entfällt.
- Beispielrichtungen, Fallstricke und passendste Option erscheinen **unter dem Score** im Ergebnis-Screen (`BeispielrichtungenStep` in `FaktenScorer`).
- Zurück-Navigation: Ergebnis → Risiko (nicht mehr über einen Beispiele-Zwischenschritt).

#### Copy

- Markierung der passendsten Option: **„Am nächsten an deinem Fall"** (`EMPFEHLUNG_LABEL` in `lib/copy/aufgabenbeschreibung.ts`) — statt „Empfohlen" / „Empfohlene Option". Keine direkte Handlungsempfehlung.
- Orientierungs-Disclaimer („Kein Anspruch auf Vollständigkeit. Dient zur Orientierung.") bleibt bei den Beispieloptionen, jetzt im Ergebnis-Kontext (ohne „vor dem Ergebnis").
- Redundante Kurz-Zusammenfassung der Empfehlung im Ergebnis-Steckbrief entfällt — die volle Liste steht darunter.

**Konsequenz:** Erweitert ADR-005 (Zwei-Phasen-Flow) und ADR-007 (Anzeige der Empfehlung). Schrittzählung: `TOTAL_STEPS = QUESTIONS.length + 3`. Spec in `archetyp_klassifikation_spec.md` §4 aktualisiert.

---

### [ADR-017] Risiko-Schritt — Compliance-Hinweis, Vorbelegung, Prompt-Regel

**Datum:** 2026-08-04

**Entscheidung:**

#### Compliance-Hinweis schon in v1 am Risiko-Schritt

- Unter den Stufen steht ein **kurzer, nicht wegklickbarer** Hinweis (`RISIKO_COMPLIANCE_HINWEIS` in `types/brief.ts`): keine Rechtsberatung, keine rechtsverbindliche Einstufung nach der EU-KI-Verordnung.
- Ergänzt den längeren Haftungstext aus Inkrement J (PRD) — hier bewusst kürzer, weil der Wizard-Schritt noch kein Compliance-Register ist.

#### Warum-fragt-Aufklärung

- Aufklappbarer Text (`RISIKO_WARUM_HINWEIS`): Stufe steuert Kontrollbedarf, nicht die Nutzen-Reihenfolge; Schlussformel **„Im Zweifel die vorsichtigere Stufe."** (vereinheitlicht mit der vorsichtigen Datenlage-Regel).

#### Vorbelegung bleibt

- Wenn Phase 1 einen `risikoVorschlag` liefert: Stufe vorbelegen + Begründung zeigen (Zustimmungsreflex in v1 akzeptiert).
- Wenn Phase 1 ausfällt: **kein** Ersatztext, **keine** Vorbelegung, Weiter gesperrt bis manuelle Wahl — bereits so in ADR-016 / Spec.

#### Begründung ohne Archetyp-Label

- Phase-1-Prompt verbietet Archetyp-Namen/-IDs in `risikoVorschlag.begruendung`; Begründung über die konkrete Aufgabe.

#### Stufenbenennung — betrieblich, nicht KI-VO

- UI-Labels: **Gering / Überschaubar / Hoch / Nicht automatisieren** — ohne KI-VO-Klammerzusätze.
- Vierte Stufe: **„Nicht automatisieren"** statt „Inakzeptabel (verboten)".
- Intern bleibt `inakzeptabel`; KI-VO-Mapping nur für späteres Compliance-Register (Inkrement J).

**Begründung:** Mittelständler sollen den Wizard nicht als KI-VO-Einstufung lesen; der kurze Disclaimer gehört an die Stelle, an der vier Risikostufen stehen.

**Konsequenz:** `RisikoStep` zeigt Warum-fragt + Compliance. `RISIKO_OPTIONS.label` ist die nutzersichtige Bezeichnung (Wizard, Badges, Rangliste, Filter). IDs unverändert.

---

### [ADR-016] Phase-1-Klassifikation im Hintergrund + Brief-Key-Invalidierung

**Datum:** 2026-08-04

**Entscheidung:**

#### Hintergrund statt Zwischen-Screen

- Nach dem Steckbrief (`goNextFromBrief`) wechselt der Wizard **sofort** zu Frage 1; `startInitialClassification(brief)` läuft parallel im Hintergrund.
- Der frühere Lade-Screen „Risiko wird eingeschätzt …" entfällt. **Phase 2** („Beispiele werden erstellt …") bleibt — dort hängt das Ergebnis direkt am Weiter-Klick aus dem Risiko-Schritt.
- Risiko-Vorschlag wird vorgelegt, sobald Phase 1 fertig ist und `brief.risiko` noch leer ist. Fehlerhinweis erscheint am Risiko-Schritt, nicht mitten in den Bewertungsfragen.

#### Brief-Fingerprint und Cache-Sicherheit

- **`briefClassifyKey(brief)`** = `problem|ziel|loesung` (getrimmt) — Dedup für laufende Requests, Zuordnung von Ergebnis zu Brief.
- **`initialClassificationKey`** wird zusammen mit `initialClassification` gesetzt; `resolveInitialClassification()` liefert den Cache nur, wenn Key und aktueller Brief übereinstimmen.
- **`currentInitialClassification`** filtert Anzeige (Risiko-Vorschlag, Fehlerbanner) — kein veralteter Vorschlag bei geändertem Brief.
- Bei Brief-Änderung: `useEffect` leert **State-Cache und Pending-Ref** (`initialClassifyRef`), sobald der Ref-Key nicht mehr zum Brief passt — auch wenn die API noch läuft und `initialClassificationKey` noch `null` ist.
- **`briefKeyRef`** (pro Render synchron) + **`stillCurrent`** im Promise-Handler: veraltete Antworten werden verworfen, auch wenn sie vor dem `useEffect` eintreffen.

**Begründung:** Nutzer sollen nicht auf Phase 1 warten, bevor sie Fakten beantworten. Ohne Key-Invalidierung konnte eine Klassifikation für Brief A auf Brief B angewendet werden (falscher `archetypId` in Phase 2).

**Konsequenz:** Ergänzt ADR-005. Keine API-Änderung. Bearbeiten des Steckbriefs nach „Weiter" invalidiert laufende und gecachte Phase-1-Ergebnisse zuverlässig.

---

### [ADR-015] Anrede — durchgängig Du in der Nutzeroberfläche

**Datum:** 2026-08-04

**Entscheidung:**

- Sämtliche **nutzersichtbare** Texte verwenden die **Du-Anrede** (Imperativ, Possessiv, Hinweise) — kein „Sie/Ihre/Ihren" mehr in der App-UI.
- Betroffen u. a.: `LandingPage`, `RisikoStep`, `Rangliste`, Wizard-/Steckbrief-Copy in `src/lib/copy/aufgabenbeschreibung.ts`, Fragen-Subtitles in `scoring.ts`.
- **Ausnahme:** LLM-System-Prompts in `api/classify/route.ts` — dort meint „Du" das Modell, nicht den Endnutzer; unverändert.
- Beispiel-Hero: „Finde es in wenigen Minuten heraus …" statt „Finden Sie …".

**Begründung:** Kürzer, direkter Ton; passt zu Wizard-Flow und Zielgruppe (Fachbereiche, nicht Formular-Amtsdeutsch).

**Konsequenz:** Neue UI-Copy konsequent in Du formulieren. ADR-014 (Steckbrief) und ADR-011 (Risiko-Hinweise) sind im Code angeglichen; Specs unter `docs/` können noch Sie-Formulierungen enthalten — maßgeblich ist der Code + diese ADRs.

---

### [ADR-014] Steckbrief — Satzschablone, Copy-Zentralisierung, reduzierte Überschriften

**Datum:** 2026-08-04  
**Letzte Anpassung:** 2026-08-04 (Callout-UI, Du-Anrede, Titel — siehe ADR-015/016)

**Entscheidung:**

Reine Copy- und UI-Hilfe — **keine** neue Frage, Route oder Screen; **keine** Änderung an `computeScores()`, `FallBrief`-Typ oder Persistenz. Nutzer-Copy liegt zentral in **`src/lib/copy/aufgabenbeschreibung.ts`**.

#### Zwei Felder bleiben (ergänzt ADR-012)

- Weiterhin nur **Aktueller Ablauf** (`problem`) und **Ziel** (`ziel`) als Pflichtfelder. **`loesung` wird nicht wieder in der UI abgefragt** — bleibt optional im Typ für Legacy und Klassifikations-API.
- Labels: „Wie sieht der Prozess heute aus?" / „Was soll nach der Automatisierung vorliegen?"; kurzLabels für Zusammenfassung und Beispiele (`Aktueller Ablauf`, `Ziel`).
- Ziel-Hint verankert die Urteilsgrenze (was KI übernimmt vs. was in deiner Verantwortung bleibt); Platzhalter in Ich-Form.

#### Wizard-Titel und Überschriften

- FlowShell-Titel: **„Arbeitsprozess beschreiben"** (statt „Fall beschreiben").
- Innere Überschrift **„Fall-Steckbrief" entfällt** — Icon (`SectionIcon`) + Intro-Text reichen; vermeidet Doppelung und Bürokratie-Sprache.

#### Satzschablone und Beispiele

- **`ABLAUF_SCHABLONE_TEILE`:** strukturierte Segmente („Ich nehme …", „mache …", „damit …") für UI und Ableitung von `ABLAUF_SCHABLONE`.
- **Sichtbarkeit:** Accent-**Callout** (`surface-highlight`, linker Brand-Border, `TextQuote`-Icon) mit **Chip-Pills** pro Segment — nicht mehr flacher `surface-inset`-Absatz.
- Erstes Textfeld: `aria-describedby` verweist auf den Callout (Barrierefreiheit).
- Textareas: **`resize-y`** (manuelle Vergrößerung).
- Aufklappbar (`<details>`): zwei ausgefüllte Beispiele (**Eingangsrechnungen**, **Lieferavis-Abgleich**); barrierefrei (`aria-expanded`, `aria-controls`, Fokus-Ring).
- Anrede in Steckbrief-Copy: **Du** (ADR-015).

#### Begründung

- Adressiert „leere Seite" / „Fälle finden" (concept.md): Gliederung allein reicht nicht — die Schablone gibt den ersten Satz vor und ist visuell als Schreib-Muster erkennbar.
- Verbessert Eingangsqualität für Archetyp-Klassifikation (ADR-005) ohne v2-Aufwand.

**Konsequenz:** Feature-Komponenten importieren Copy-Konstanten aus `lib/copy/aufgabenbeschreibung.ts`. Kein drittes Pflichtfeld. Ergänzt ADR-012, ersetzt es nicht. Phase-1-Timing: ADR-016.

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
- Stufenbezeichnungen in der Chip-Auswahl: betriebliche Labels ohne KI-VO-Klammern (ursprünglich KI-VO-nahe Klammerzusätze — **ersetzt durch ADR-017**).

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

**Konsequenz:** Weniger Einstiegshürde; LLM-Prompts nutzen weiterhin `problem`/`ziel` (ggf. mit vorhandenem `loesung` aus alten Fällen). Eingabehilfe durch Satzschablone: ADR-014. Ergänzt ADR-005.

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
- Wert wird mit dem Fall persistiert (`SavedCase.result.hoursPerMonth`); bei geänderten Antworten neu berechnet. **Keine** Geldumrechnung. **Keine** Ersparnis-Formulierung **für die Baseline-Zahl** (v1). Nutzenprognose je Lösung (Y/X) ist v2 — ADR-019.
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
**Letzte Anpassung:** 2026-08-04 (Phase-1 im Hintergrund, Brief-Key — siehe ADR-016)

**Entscheidung:**
- Nach dem Steckbrief folgt ein **LLM-Klassifikations-Call** (`POST /api/classify`): liefert intern `archetypId` und **Risiko-Vorschlag**. `archetypId` wird persistiert, **nie** als Label in der UI gezeigt.
- **Wizard-Reihenfolge:** Steckbrief → **sofort** 6 Bewertungsfragen (Phase 1 parallel im Hintergrund, ADR-016) → Risiko beim KI-Einsatz → (Beispiel-Klassifikation mit Lade-Screen) → Beispielrichtungen → Ergebnis. Anzeige „Frage 1–7 von 7" nur auf Steckbrief + Bewertungsfragen (ADR-011).
- **Zwei LLM-Phasen:** Phase 1 nach Steckbrief (Archetyp + Risiko-Vorschlag); Phase 2 nach Risiko (Beispiele + Fallstricke + optional Empfehlung, mit Fakten aus den 6 Fragen). Jede Beispielrichtung hat einen **Automatisierungstyp** (agent, workflow, assistenz, sonstiges).
- **Keine Scoring-Vorbelegung:** Die 6 Bewertungsfragen starten ohne Vorauswahl; nur Risiko wird vorgeschlagen.
- **LLM-Fehler:** Beispiel-Schritt entfällt, Hinweis, Nutzer kann weiter — kein statischer Fallback.
- Risiko-Feld **aus dem Steckbrief entfernt**, eigener Wizard-Schritt mit Pflichtauswahl (ADR-003/011).
- Steckbrief nur noch Ablauf + Ziel (ADR-012); Copy und Satzschablone-UI (ADR-014).

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
