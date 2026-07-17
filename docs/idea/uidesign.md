# Designrichtung für "Klarsicht" — Von den Vorbildern zur eigenen Handschrift

## TL;DR
- **Empfehlung:** Eine helle, ruhige Grundfläche (Light-first) mit einer markanten Display-Schrift und einer klaren, tabellenfähigen UI-Schrift, EINER kräftigen Signal-Akzentfarbe plus einer diskreten, semantischen Score-Skala (Rot→Amber→Grün) — abgeleitet aus den Prinzipien von Stripe (redaktionelle Klarheit), Linear (Disziplin/EIN Akzent), Attio (datendichte Frische) und Things (Handwerk/Freude). Das ist markanter als Notion, aber nie verspielt.
- **Warum das passt:** Der Mittelstand ist KI-offen, aber vertrauensgetrieben und nicht technik-affin — laut IONOS/YouGov-Studie (Jan.–März 2026, ~4.000 KMU-Entscheider) sind "für 55 % … verlässliche Resultate das wichtigste Kriterium beim Kauf von KI-Lösungen". Klarheit, Lesbarkeit und ein seriöser, "gut gemachter" Eindruck schlagen Effekthascherei; ein starkes, eigenes Farb- und Typo-Signal schafft Wiedererkennung.
- **Kein Klon:** "Klarsicht" übernimmt Prinzipien (nicht Oberflächen): die Score-Visualisierung als Herzstück (Balken + Matrix), großzügige Typo-Hierarchie, EINE Akzentfarbe mit Disziplin, gleichwertiges Desktop-/Mobile-Erlebnis — verdichtet zu einer eigenen Handschrift rund um "Klarheit / Durchblick".

## Key Findings

1. **Die besten B2B-Tools wirken markant durch Disziplin, nicht durch Dekoration.** Linear nutzt eine EINZIGE Akzentfarbe (Lavendel-Blau #5e6ad2) sparsam für Marke, Fokus-Ring und einen primären CTA — sonst nichts. Vercel verzichtet sogar ganz auf eine Akzentfarbe und trägt die gesamte Hierarchie über Typografie, Weißraum und 1px-Rahmen. Die Lehre für Klarsicht: eine kräftige Farbe, konsequent reserviert, wirkt stärker als eine bunte Palette.

2. **Typografie ist 2025/26 der eigentliche Differenzierer.** Inter ist so verbreitet, dass es unsichtbar wird; die Vorreiter gehen zu eigenständigeren Headline-Schriften über (Vercel → Geist, Stripe → Söhne, Figma → eigene). Das Muster: markante Display-Schrift für Persönlichkeit + neutrale, extrem lesbare UI-Schrift mit Tabellenziffern für die Daten.

3. **Scoring/Priorisierung braucht zwei komplementäre Darstellungen.** Die Fachliteratur (Nielsen Norman Group) beschreibt die Impact-/Effort-Matrix (Wert vs. Machbarkeit, 2×2) als kollaboratives Standardwerkzeug — ideal für den Workshop — ergänzt durch ein sortiertes Balken-Ranking für den Einzelplatz. Beides zusammen bedient beide Nutzungsmodi.

4. **Farbcodierung von Scores muss zugänglich sein.** Farbe darf nie alleiniger Bedeutungsträger sein (WCAG 2.2, Success Criterion 1.4.1 "Use of Color"); Zahl/Label/Form muss die Farbe begleiten. Sequenzielle bzw. divergierende Skalen (z. B. Rot–Amber–Grün, colorblind-sicher geprüft) transportieren Rangordnung; Kontrast ≥ 4,5:1 für normalen Text (WCAG 1.4.3).

5. **Vertrauen bei nicht-technik-affinen Nutzern entsteht durch navigierbare Klarheit, nicht durch "schöne Komplexität".** Die Enterprise-UX-Analyse von Futuroot bringt es auf den Punkt: "Making complexity beautiful is not the same as making complexity navigable. The first is a design achievement. The second is a business one." Progressive Offenlegung, vertraute Muster (Jakobs Gesetz), reduzierte kognitive Last (Hicks/Millers Gesetz) und Impact-Vorschauen schaffen Handlungssicherheit.

6. **Gleichwertigkeit auf Desktop und Mobile ist Pflicht, kein Bonus.** Touch-Ziele mind. 44×44 px (Apple) bzw. 48×48 px (Google), Fließtext ≥ 16 px (verhindert iOS-Auto-Zoom), Ein-Spalten-Layout und Progressive Disclosure auf kleinen Screens. Stripe bewies mit dem Dashboard-Redesign, dass selbst dichte Tabellen und Matrizen mobil funktionieren.

## Details

### A) Analyse der App-Vorbilder — welches Prinzip Klarsicht übernehmen sollte

**1. Stripe — redaktionelle Klarheit + vertrauensbildende Zahlen-Disziplin (wichtigstes Vorbild).**
Stripe setzt eine helle Grundfläche (#ffffff) ein, Fließtext in tiefem Marineblau (#0d253d / #061b31) statt reinem Schwarz, EINE Signalfarbe (Indigo #533afd) sparsam als einziger gefüllter Button pro Sektion, und — entscheidend — Tabellenziffern (tabular figures) für alle Zahlen als "leises Finanzdaten-Signal". Der Marketing-Auftritt nutzt einen wiedererkennbaren Farbverlauf-Mesh nur im oberen Drittel, während die Produktflächen ruhig bleiben.
*Übernehmen für Klarsicht:* Die Grundhaltung "redaktionelle Ruhe + eine disziplinierte Signalfarbe + tabellarische Zahlen". Für ein Scoring-Tool, dessen Kern Zahlen sind, sind fluchtende Tabellenziffern kein Detail, sondern Vertrauens-Signal. Ein dezenter Farbverlauf (als Anklang an "klare Sicht"/Horizont) kann als Marken-Signatur auf Login/Landing dienen, ohne die Arbeitsflächen zu stören.

**2. Linear — Disziplin und EIN Akzent.**
Linear trägt Tiefe über eine "Surface-Ladder" (gestufte Flächen) und Haarlinien-Rahmen statt Schlagschatten; die Lavendel-Farbe erscheint nur auf Markenzeichen, Fokus-Ring und einem CTA. Typografie: Inter Variable mit enger negativer Laufweite bei großen Größen, Gewichte im niedrigen Band (400–510) statt fett.
*Übernehmen für Klarsicht:* Radikale Zurückhaltung bei Farbe und Schatten. Die Score-Farben (Rot/Amber/Grün) sind dann die einzigen bunten Elemente im Interface und "leuchten" dadurch — die Priorisierung wird visuell zum Helden.

**3. Attio — datendichte Frische für "lebendige" Business-Software.**
Attio balanciert technische Präzision (saubere Grids, hochkontrastige Labels, Grid-/Kanban-/Listen-"Views") mit einer frischen Teal-/Grün-Palette (#3abdaf), um moderner und "lebendiger" zu wirken als klassische Enterprise-Software — bei "quiet sophistication" statt lauter Markenelemente.
*Übernehmen für Klarsicht:* Das View-Konzept (dieselben Use Cases als Liste, als Ranking-Balken, als Matrix umschaltbar) und die Idee, mit einer frischen, untypischen Farbe (nicht Standard-Blau) aus der grauen Business-Software-Masse herauszustechen, ohne unseriös zu werden.

**4. Things (Cultured Code) — Handwerk, Freude und Zugänglichkeit.**
Mehrfacher Apple-Design-Award-Gewinner (u. a. 2009 und 2017); gelobt für "delightful", zweckgebundene Animationen und eine minimalistische Oberfläche, die "designed with the understanding that real people are going to be using it" ist — zugleich für Power-User mächtig und "simple enough for the rest of us". Made in Stuttgart.
*Übernehmen für Klarsicht:* Zweckgebundene Mikro-Interaktionen (das Neu-Sortieren des Rankings darf sich befriedigend anfühlen) und die Doppel-Zugänglichkeit — für den KI-Berater tief, für den Fachbereichsmitarbeiter sofort verständlich. Das ist exakt die Doppel-Zielgruppe von Klarsicht.

**5. Notion Calendar / Cron — Hierarchie allein durch Typo & Weißraum.**
Extremer Größenkontrast (z. B. 64px-Headline neben 12px-Label) erzeugt Hierarchie ohne Dekoration; Label-Header (12px, Medium, positive Laufweite, Großbuchstaben) strukturieren Information.
*Übernehmen für Klarsicht:* Hierarchie über Typo-Skala statt über Linien/Boxen — hält datendichte Screens ruhig und lesbar.

*Bewusst nur als Kontrast herangezogen:* Raycast und Vercel sind exzellent, aber ihre "dunkle Präzisionsinstrument"-Ästhetik (near-black Canvas, Entwickler-Anmutung) ist für nicht-technik-affine Mittelstands-Fachbereiche zu kühl/technisch als Grundmodus. Ihre Lehre (Disziplin, Haarlinien statt Schatten, Tastatur-Effizienz) übernehmen wir — ihre Dunkelheit nur als optionalen Dark Mode, nicht als Default.

### B) Die abgeleitete, eigene Designrichtung für "Klarsicht"

**Leitidee: "Klarsicht" = Klarheit + Durchblick.** Das Design übersetzt den Namen wörtlich: maximale Lesbarkeit, ruhige Flächen, ein "Durchsehen" auf das Wesentliche (die Priorität). Die Metapher "klare Sicht/Horizont" liefert das einzige erlaubte dekorative Motiv: ein feiner, heller Verlauf (Dunst→Klarheit) als Marken-Signatur.

**1. Typografie-Richtung (mit konkreten, deutsch-tauglichen Schriften).**
- *Empfehlung mit Budget:* **Söhne** (Klim Type Foundry) für Headlines + **Inter** für Body/UI. Söhne ist eine hochwertige Neo-Grotesk mit exzellenten Diakritika und sogar deutschen Gewichtsnamen (Buch, Kräftig, Halbfett) — sie signalisiert Premium und Vertrauen und hat einen echten Deutschland-Bezug. Söhne ist als Variable Font verfügbar; die Lizenz ist laut Klim FAQ "a one-off cost … There are no recurring fees".
- *Empfehlung ohne Budget (rein Open Source):* **Geist** (Vercel, SIL Open Font License 1.1) für Headlines + **Inter** (SIL OFL 1.1) für Body/UI. Beide sind Variable Fonts; für deutsche Umlaute (ä ö ü ß) die vollständigen OTF-/Variable-Dateien verwenden, nicht die abgespeckte CDN-Variante (die den vollen Glyphensatz nicht enthält).
- *Alternative mit mehr Persönlichkeit:* **Space Grotesk** (Florian Karsten, OFL) für Headlines — charaktervoll-"techno" durch die Monospace-Herkunft, mit eigenen Tabellenziffern und belegter Deutsch-Unterstützung (offizieller Pangram-Test: "Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich.") — kombiniert mit Inter oder IBM Plex Sans als Body.
- *Kritisch für ein Scoring-Tool:* Der Body-Font MUSS Tabellenziffern (tnum) haben. **Inter** liefert diese standardmäßig ("Inter defaults to tabular figures, where all numerals share the same width"); Zahlen fluchten dann in Ranking-Spalten. General Sans / Clash Display sind reizvoll, aber nur als sparsame Display-Akzente einsetzen — für datendichte Score-Tabellen wegen geschlossener Aperturen bei kleinen Größen ungeeignet. Hinweis: die ITF/Fontshare-Schriften (General Sans, Clash, Satoshi) sind kostenlos, aber closed-source (ITF Free Font License, nicht OFL).
- *Prinzip:* Persönlichkeit in die große Headline (große Display-Größen, enge negative Laufweite), Neutralität + Tabellenziffern in den Body. Große Headlines mit klarer Hierarchie sind der aktuelle SaaS-Trend und passen zur Namens-Idee "Klarheit".

**2. Farbstrategie / Palette-Ansatz.**
- *Grundmodus hell (Light-first),* weil er für nicht-technik-affine Mittelstands-Nutzer im Berufsalltag (oft helle Büroumgebung, Beamer im Workshop) zugänglicher und weniger "Nerd-Tool" wirkt. Dark Mode als vollwertige Option (nicht als bloße Invertierung — gedämpfte Textfarbe ~#e6e6e6 statt reinweiß).
- *60-30-10-Disziplin:* neutrale Grundfläche (Weiß / sehr helles Kühlgrau) 60 %, tiefes, warmes Tinten-Blau/Anthrazit (nicht reines Schwarz) für Text/Struktur 30 %, EINE markante Akzentfarbe 10 %.
- *Akzentfarbe:* bewusst NICHT Standard-Blau (zu generisch — "inherited furniture"). Empfohlen wird ein distinktives, frisches Teal/Petrol oder ein sattes Indigo als Marken-Signatur, das "Klarsicht/Durchblick" (klares Wasser, Weite) transportiert und Vertrauen mit Modernität verbindet. Diese Farbe ist reserviert für primären CTA, aktiven Zustand, Fokus-Ring — sonst nichts.
- *Signalfarben für Scoring getrennt halten:* Die Score-Skala (Rot→Gelb/Amber→Grün) ist eine EIGENE, semantische Palette, klar getrennt von der Markenfarbe, damit "hohe Priorität" nie mit "Button" verwechselt wird. Colorblind-sicher prüfen (ColorBrewer/Viz Palette) und immer mit Zahl + Label doppeln.

**3. Layout-Prinzipien.**
- Feste Seitenleiste (Navigation, ~240–280px) + karten-/grid-basierter Inhalt (CSS Grid) — das skalierbare Standardmuster (Linear, Stripe, Attio, Vercel).
- 4–6 Kern-Kennzahlen "above the fold" (NN/G: 5–7 max.), Detail per Progressive Disclosure darunter.
- Tiefe über Flächen-Abstufung + Haarlinien-Rahmen statt schwerer Schatten (Linear/Vercel-Prinzip) — hält datendichte Priorisierungs-Screens ruhig.
- Konsistentes 4px-Spacing-Raster, moderate Eckradien (z. B. 6–12px) — "precision-machined", nicht verspielt.

**4. Umgang mit Scoring-Visualisierung (das Herzstück).**
- *Zwei umschaltbare Views (Attio-Prinzip):* (a) **sortiertes Balken-Ranking** — horizontale Balken, von hoch nach niedrig, Achse bei 0 beginnend (ehrliche Länge); ideal für den selbstständigen Schreibtisch-Modus. (b) **Wert-/Machbarkeits-Matrix** (2×2, NN/G-Impact-Effort). Die von NN/G benannten vier Quadranten heißen exakt: **"Quick wins"** (geringer Aufwand, hoher Nutzen), **"Big bets"** (hoher Aufwand, hoher Nutzen), **"Fill-ins"** (geringer Aufwand, geringer Nutzen) und **"Money pit"** (hoher Aufwand, geringer Nutzen) — diese etablierte Terminologie sollte übernommen (ggf. auf Deutsch klar übersetzt: "Schnelle Erfolge / Große Wetten / Nebenbei / Zeitfresser") werden. Diese Matrix ist ideal für den moderierten Workshop, weil sie ein geteiltes mentales Modell erzeugt.
- *Live-Ranking mit zweckgebundener Motion:* Wenn Bewertungen eingehen, sortieren sich die Balken/Punkte sichtbar neu (sanfte Übergänge ~200ms) — das macht die Priorisierung greifbar und im Workshop dramaturgisch wirksam ("Things"-Freude, ohne Spielerei).
- *Farbe + Zahl + Position gemeinsam:* Score als große Tabellenziffer, farbcodierter Balken, Rang-Position — dreifach redundant, damit auch nicht-analytische Nutzer und farbfehlsichtige Menschen sofort verstehen (WCAG 1.4.1).
- *Behutsame Gamification-Elemente:* Fortschrittsanzeige ("12 von 20 Use Cases bewertet"), klare Zwischenstände — Motivation für Fachbereichsmitarbeiter, ohne den seriösen B2B-Rahmen zu verlassen (keine Badges/Konfetti-Overkill).

**5. Motion & Interaktion.**
- Schnelle, ruhige Übergänge (~100–200ms), zweckgebunden: Neu-Sortierung des Rankings, Öffnen von Detail-Panels, Hover-Feedback. Skeleton-Screens statt Spinner beim Laden (Stripe/Linear-Muster).
- Tastatur-Effizienz für den Berater-Power-User (Command-Palette, Schnell-Navigation) als optionale Schicht — die Oberfläche bleibt aber ohne Tastatur voll bedienbar (Maus/Touch als gleichwertiger Weg), anders als bei reinen Power-Tools.
- "Optimistic UI": Bewertung wird sofort im Ranking sichtbar, Sync im Hintergrund.

**6. Wie sich der Name "Klarsicht" im Design spiegelt.**
- *Klarheit:* großzügiger Weißraum, hohe Kontraste, eine Farbe, tabellarische Zahlen, keine dekorativen Schatten — jedes Element "verdient seinen Platz".
- *Durchblick:* das Interface "sieht durch" auf die Priorität — die Score-Farben sind die einzigen bunten Signale; der Blick landet zwangsläufig auf dem Wichtigen.
- *Marken-Signatur:* ein feiner Hell-Verlauf (Dunst→Klar) und optional ein Sicht-/Linsen-/Horizont-Motiv als Logo-Idee; sparsam, nur auf Marken-Flächen (Login, Landing, leere Zustände).

### C) Warum die Empfehlung zur Zielgruppe und zum Anwendungsfall passt

- **Mittelstand ist KI-offen, aber vertrauensgetrieben.** Laut IONOS/YouGov-Studie (Jan.–März 2026, ~4.000 KMU bis 250 Mitarbeitende) gilt: "Insgesamt 65 %** der befragten Firmen stehen KI positiv gegenüber. 42 % bezeichnen die Dynamik in ihrem Unternehmen als optimistisch, 23 % als neugierig. Nur 8 % fühlen sich von der Entwicklung überfordert." Zugleich sind Verlässlichkeit der Ergebnisse (55 %) das wichtigste Kaufkriterium und Datenschutz/Nachvollziehbarkeit zentral. Ein ruhiges, klares, "seriös gut gemachtes" Design zahlt direkt auf dieses Vertrauensbedürfnis ein; Effekthascherei würde das Gegenteil bewirken.
- **Nicht-technik-affine Fachbereiche brauchen Navigierbarkeit, nicht Imponier-Komplexität.** Die Doppel-View (einfaches Ranking + Workshop-Matrix), Progressive Disclosure und dreifach redundante Score-Darstellung senken die kognitive Last und die "Angst, etwas falsch zu machen" — genau der Moment, in dem Enterprise-Tools sonst scheitern ("Making complexity beautiful is not the same as making complexity navigable").
- **Berufsalltag + Doppel-Zielgruppe:** Light-first + hohe Lesbarkeit passt zu Büro/Workshop; die optionale Tastatur-/Power-Schicht bedient den Berater, ohne den Fachbereichsnutzer zu überfordern (Things-Prinzip "mächtig UND einfach").
- **Markanter als Notion, aber nicht überzogen:** Notion wird als zu neutral/langweilig empfunden; die eigene Display-Schrift, die distinktive (Nicht-Blau-)Akzentfarbe und die große Typo-Hierarchie geben Wiedererkennung — die Disziplin (eine Farbe, viel Ruhe) verhindert, dass es "zu viel" für den konservativen Mittelstand wird.
- **Scoring/Priorisierung als Kern:** Die Kombination sortiertes Balken-Ranking + Wert-/Machbarkeits-Matrix ist exakt das etablierte Fachwerkzeug für Priorisierung (NN/G) — Klarsicht macht es nur schöner, live und zugänglicher.

## Recommendations

**Phase 1 — Fundament festlegen (jetzt):**
1. Typo-System festzurren: Body/UI = **Inter** (mit aktivierten Tabellenziffern), Headline = **Söhne** (mit Budget) bzw. **Geist** (Open Source). Große Headline-Skala + Label-Header-Muster definieren.
2. Farbtoken anlegen: neutrale Basis + tiefes Tinten-Blau für Text + EINE distinktive Akzentfarbe (Teal/Petrol oder Indigo, nicht Standard-Blau). Separate, colorblind-geprüfte Score-Skala (Rot–Amber–Grün).
3. Light-first bauen, Dark Mode als Token-Variante von Anfang an mitdenken.

**Phase 2 — Scoring-Kern bauen:**
4. Zwei umschaltbare Views implementieren: sortiertes Balken-Ranking (Schreibtisch) + 2×2-Wert/Machbarkeits-Matrix (Workshop) mit den etablierten Quadranten (Quick wins / Big bets / Fill-ins / Money pit, deutsch verständlich benannt).
5. Score dreifach redundant zeigen (Zahl + Farbbalken + Rang). Live-Neusortierung mit ~200ms-Übergängen.
6. Fortschrittsanzeige für den Bewertungsprozess.

**Phase 3 — Politur & Zugänglichkeit:**
7. Alle Touch-Ziele ≥ 44–48px, Fließtext ≥ 16px, Kontrast ≥ 4,5:1 (WCAG 1.4.3); auf echten Mittelklasse-Geräten testen.
8. Skeleton-Loading, zweckgebundene Mikro-Interaktionen, optionale Command-Palette.
9. Marken-Signatur (Verlauf/Logo-Motiv) nur auf Marken-Flächen.

**Benchmarks, die die Empfehlung ändern würden:**
- Wenn Nutzertests zeigen, dass die 2×2-Matrix Fachbereichsnutzer überfordert → Matrix nur im moderierten Modus, Schreibtisch-Modus rein Balken-Ranking.
- Wenn die Zielgruppe primär mobil arbeitet (Logistik/Fertigung am Shopfloor) → Mobile-first statt Light-first-Desktop priorisieren; Matrix mobil durch geführte Karten-Abfolge ersetzen.
- Wenn Budget fehlt → Geist statt Söhne (kein Qualitätsverlust bei der UI, nur weniger "Premium-Signatur").
- Wenn Datenschutz-Positionierung ("Made/Hosted in EU") zum Kern-Verkaufsargument wird → Marken-Signatur und Copy stärker darauf ausrichten (der Mittelstand misstraut außereuropäischen Anbietern besonders stark).

## Caveats
- Viele Design-"Systemanalysen" (DESIGN.md-Sammlungen, Extraktoren) sind Drittanbieter-Rekonstruktionen, keine offiziellen Markenrichtlinien; Hex-Werte und Token können leicht abweichen. Die abgeleiteten Prinzipien (eine Akzentfarbe, Haarlinien statt Schatten, Tabellenziffern) sind aber über mehrere Quellen konsistent.
- Konkrete Farb-Hex-Werte für Klarsicht sind hier bewusst als Strategie (nicht als finale Palette) formuliert — die finale Akzentfarbe sollte gegen Wettbewerber im deutschen KI-Beratungs-/Mittelstandsumfeld auf Distinktheit geprüft und auf WCAG-Kontrast getestet werden.
- Studienzahlen zum Mittelstand stammen aus Anbieter-/Verbands-Umfragen (IONOS/YouGov, Sage, Bitkom, KPMG) mit unterschiedlichen Stichproben; sie zeigen konsistent "offen aber vertrauensgetrieben", die exakten Prozentwerte variieren je nach Stichprobe. Die zitierten 65 %/55 % stammen aus der IONOS/YouGov-Erhebung (Jan.–März 2026); das Symbol "**" markiert dort einen aus zwei benachbarten Skalenpunkten aggregierten Wert.
- Schrift-Lizenzen vor Produktivnutzung prüfen: Söhne ist kostenpflichtig (Einmalgebühr); die ITF/Fontshare-Schriften (General Sans, Clash, Satoshi) sind kostenlos, aber closed-source (ITF Free Font License, nicht OFL); Inter, Geist, Space Grotesk und IBM Plex Sans stehen unter der SIL Open Font License. Bei IBM Plex Sans die Variable-Font-Verfügbarkeit im offiziellen GitHub-Release verifizieren.