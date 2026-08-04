# Klarsicht — Änderungen an der Score-Berechnung seit `concept.md`

*Stand: 31. Juli 2026. Bezugspunkt ist `concept.md` (Ursprungsstand 17. Juli 2026). Dieses Dokument fasst nur zusammen, was sich seitdem an der Bewertungslogik selbst geändert hat oder unmittelbar ändern muss — nicht die begleitende Oberflächengestaltung (Landingpage, Warmstart, Kaltstart), die separat dokumentiert ist.*

---

## 1. Einordnung: Was sich NICHT geändert hat

Zur Abgrenzung, damit bei der Umsetzung nichts doppelt geprüft wird:

- Die sechs inhaltlichen Bewertungskriterien sind unverändert: **Häufigkeit, Dauer pro Vorgang, Anzahl beteiligter Personen, Auswirkung (vormals „strategische Relevanz"), Datenverfügbarkeit, Wiederholbarkeit.**
- Die Formel für die gebundene Arbeitszeit (Häufigkeit × Dauer × Personenzahl) ist unverändert.
- Der Grundsatz „keine Umrechnung in Geld" gilt weiterhin uneingeschränkt.
- `computeScores()` bleibt die einzige Berechnungsstelle; es gibt keine zweite, konkurrierende Logik.

Geändert haben sich: die Zählung der Fragen im Ablauf, die Antwortskala von zwei der sechs Kriterien, die Fragestellung des Risiko-Tags, und das Verhältnis zwischen Risiko-Tag und dem Kriterium „Auswirkung". Details unten.

---

## 2. Zählung der Fragen im Ablauf — jetzt 7 statt 6

**Vorher:** Der Ablauf war Steckbrief → Beispielrichtungen → 6 Fragen → Ergebnis, mit dem Steckbrief als eigenem, ungezähltem Schritt.

**Jetzt:** Der Steckbrief zählt als **Frage 1 von 7**. Die sechs Bewertungsfragen sind entsprechend Frage 2 bis Frage 7. Beispielrichtungen und Ergebnis tragen weiterhin keine Nummer.

**Wirkung auf die Berechnung: keine.** Der Steckbrief fließt nach wie vor nicht in `computeScores()` ein — das ist an mehreren Stellen in der Oberfläche explizit ausgewiesen („Ihre Beschreibung fließt nicht in den Punktwert ein"). Es handelt sich um eine reine Zähl- und Anzeigefrage, keine Änderung an der Bewertungslogik.

**Zu prüfen:** Jede Stelle im Code oder in Texten, die noch „6 Fragen" oder „Frage X von 6" ausgibt, muss auf „7" korrigiert werden (Fortschrittsanzeige, Abbruch-Dialog, Landingpage-Mikrotexte).

---

## 3. Häufigkeit — konkrete Monatswerte je Stufe ergänzt

**Vorher:** Sechs Auswahlstufen ohne hinterlegten Zahlenwert in der Oberfläche.

**Jetzt:** Jede Stufe zeigt einen Monatswert an; intern rechnet `computeScores()` mit festem `perMonth` pro Stufe. Die Anzeige wird daraus abgeleitet (`formatFrequencyPerMonth`) — **eine Quelle**, keine Korridore.

| Stufe | `perMonth` (Rechenwert) | Anzeige |
|---|---:|---|
| Mehrmals täglich | 40 | ca. 40×/Monat |
| Täglich | 20 | ca. 20×/Monat |
| Mehrmals pro Woche | 12 | ca. 12×/Monat |
| Wöchentlich | 4 | ca. 4×/Monat |
| Monatlich | 1 | ca. 1×/Monat |
| Seltener als monatlich | 0,3 | unter 1×/Monat |

**Wirkung auf die Berechnung:** Die Faktoren sind in `scoring.ts` hinterlegt; UI und Rechenlogik sind abgeglichen (Stand nach Option A: Ableitung aus `perMonth`, nicht hardcodierte Korridore).

**Status:** ✅ Abgeglichen — siehe auch `concept.md`, Abschnitt „Häufigkeit".

---

## 4. Auswirkung (vormals „strategische Relevanz") — von drei auf vier Stufen, komplett neu gefasst

**Vorher (Entwurfsstand, nicht final):** Abstrakte Selbsteinschätzung in drei Stufen — „große Auswirkungen" / „geringe Auswirkungen" / „indirekte Auswirkungen" — mit Erläuterungstexten, die sich inhaltlich überschnitten und keine echte Rangordnung ergaben.

**Jetzt:** Eine beobachtbare Frage statt einer Einschätzung — **„Wer merkt es, wenn diese Aufgabe liegen bleibt?"** — mit vier nach Reichweite geordneten Stufen:

1. Eine Frist oder Prüfung hängt daran (Behörde, Wirtschaftsprüfung, Zertifizierung, vertraglicher Termin)
2. Kunden oder Lieferanten
3. Andere Abteilungen
4. Nur unser eigenes Team

**Wirkung auf die Berechnung: erheblich.**
- Die Anzahl der Antwortstufen hat sich geändert (3 → 4). Jede Zuordnung von Stufe zu Punktwert in `computeScores()` muss neu erstellt werden, nicht nur umbenannt.
- Die neue Stufe 1 („Frist/Prüfung") ist inhaltlich neu und war im ursprünglichen Konzept nicht vorgesehen.
- Diese Stufe darf **ausschließlich in den Nutzen-Score einfließen**, nicht in den Risiko-Tag — siehe Abschnitt 5 zur Abgrenzung.

---

## 5. Risiko-Tag — Fragestellung geschärft, Abgrenzung zu „Auswirkung" neu festgelegt

**Vorher:** Der Risiko-Tag war als reines Auswahlfeld beschrieben („Risikoeinstufung": gering / überschaubar / hoch / inakzeptabel), ohne festgelegten Fragetext. Die Umbenennung an den AI Act (v1-Ergänzung, Abschnitt 8 der Zusatzfunktionen) betraf nur die Stufenbezeichnung, nicht die Frage selbst.

**Jetzt:** Die Frage muss lauten **„Was passiert, wenn die Automatisierung einen Fehler macht?"** — nicht „Wie riskant ist diese Aufgabe?". Grund: Seit es die neue Stufe „Frist/Prüfung" bei „Auswirkung" gibt, würden beide Fragen sonst denselben Sachverhalt zweimal abfragen.

**Die Abgrenzung im Einzelnen:**

| | Auswirkung | Risiko-Tag |
|---|---|---|
| Fragt nach | Folgen, wenn die Aufgabe **liegen bleibt** | Folgen, wenn die **KI einen Fehler macht** |
| Gilt auch ohne KI-Einsatz | ja | nein |
| Wirkt im Score auf | Nutzen (hebt) | Machbarkeit / Rangfolge (bremst, bei „inakzeptabel" auf null) |

**Wirkung auf die Berechnung: mittel, aber wichtig für die Modellierung.**
- `computeScores()` muss beide Werte getrennt führen. Eine Aufgabe mit hoher „Auswirkung" (Frist/Prüfung) und gleichzeitig hohem Risiko ist ein gültiger, sogar erwarteter Fall — keine Dateninkonsistenz, die abgefangen werden müsste.
- In der Oberfläche ist an der Risiko-Frage ein Hinweistext vorgesehen für den Fall, dass zuvor die Frist-Stufe gewählt wurde: *„Sie haben angegeben, dass eine Frist daran hängt. Das sagt noch nichts darüber, wie riskant eine Automatisierung wäre — bitte hier getrennt einschätzen."* Rein sprachlich, keine Logik, aber als Kontext für die Fragetexte im Code relevant.

---

## 6. Gebundene Arbeitszeit — Bestätigung ohne Formeländerung

Die in `klarsicht_v1_zusatzfunktionen.md` beschriebene Ergänzung (Abschnitt 1–7) gilt unverändert fort: Die Formel selbst ändert sich nicht, der Wert wird lediglich als eigener, benannter Rückgabewert (`gebundeneStundenProMonat`) aus `computeScores()` herausgereicht statt nur als interner Zwischenwert zu existieren. In den seither entstandenen Bildschirmen ist diese Zahl durchgängig als Beispielwert „ca. 38 Std./Monat" mit Herkunftshinweis dargestellt — konsistent mit der ursprünglichen Spezifikation.

---

## 7. Unverändert gebliebene Kriterien (Stand Juli 2026)

Zur Vollständigkeit: **Dauer pro Vorgang** und **Wiederholbarkeit** haben in dieser Phase nur Oberflächen-Feinschliff erhalten (z. B. Entfernen der Radio-Kreise bei Wiederholbarkeit), keine inhaltliche oder skalenbezogene Änderung. Für Wiederholbarkeit gilt weiterhin die Dreiteilung „Immer gleich / Meist gleich / Stark unterschiedlich".

**Anzahl beteiligter Personen** und **Datenverfügbarkeit** haben seit August 2026 zusätzliche UI-Copy und Entscheidungsregeln erhalten (Abschnitt 9) — die **Rechenlogik** (`points`, Option-IDs) bleibt unverändert.

---

## 8. Zusammenfassung der offenen Punkte für `computeScores()`

- [x] Monatswerte der Häufigkeits-Stufen (Abschnitt 3) mit den tatsächlichen Berechnungsfaktoren abgeglichen — Anzeige aus `perMonth` abgeleitet.
- [x] Zuordnung „Auswirkung"-Stufe → Punktwert neu erstellt (vier Stufen, neue Stufe „Frist/Prüfung"; Legacy-IDs `ja`/`nein`/`indirekt` werden gemappt).
- [x] „Frist/Prüfung"-Stufe fließt nur in den Nutzen-Score ein; Risiko-Hinweis bei Frist-Wahl getrennt.
- [x] Fragetext des Risiko-Tags: „Was passiert, wenn die Automatisierung einen Fehler macht?"
- [x] Fragenzählung „Frage X von 7" für Steckbrief und sechs Bewertungsfragen (Fortschrittsbalken 7 Segmente).

---

## 9. Datenverfügbarkeit & Personen — Copy und Entscheidungsregeln (August 2026)

**Wirkung auf `computeScores()`: keine.** Es ändern sich nur Fragestellung, Hinweise und dokumentierte Antwortregeln — nicht die Punktwerte oder Option-IDs.

### Datenverfügbarkeit — vier Stufen, eine Antwort

**Mehrere Quellen / Zweifel zwischen Stufen:** Wenn für eine Aufgabe mehrere Datenquellen zusammenkommen (z. B. strukturierte Aufträge im ERP, Zusatzinfos per E-Mail, Lieferschein auf Papier) oder zwischen zwei Stufen gezögert wird, gilt: **die Option wählen, die in der Liste weiter unten steht** — sichtbare Reihenfolge, keine versteckte Punktwert-Rangfolge. Diese Regel steht im Wizard-Untertitel und im Aufklapp-Hinweis (`DATEN_STUFENHINWEIS` in `scoring.ts`).

**Unterste Stufe bewusst zusammengefasst (v1):** Die vierte Stufe (`papier-koepfe`) bündelt **Papierbelege** und **Wissen nur in Köpfen** unter „Kein digitaler Zugriff". Für den v1-Score sind beide „schlecht" und landen am unteren Ende der Skala. Für spätere Machbarkeits- und Umsetzungsaussagen ist der Unterschied relevant (Papier lässt sich digitalisieren, implizites Wissen nicht ohne Explizitierung) — **Aufteilen ist v2-Scope**, siehe `klarsicht_v2_prd.md`, Abschnitt 8.

| Option-ID | Label (UI) | Punkte |
|---|---|---:|
| `digital-strukturiert` | Digital und strukturiert | 100 |
| `digital-verstreut` | Digital, aber verstreut | 65 |
| `teils-papier` | Teilweise auf Papier | 35 |
| `papier-koepfe` | Kein digitaler Zugriff | 10 |

### Personen — Bereichs-Stufen

Bei den Stufen **4–10** und **mehr als 10** rechnet die gebundene Arbeitszeit mit typischen Mittelwerten (ca. 6 bzw. ca. 15 Personen). Das ist im Herkunftshinweis zur gebundenen Arbeitszeit und in den Option-Hints ausgewiesen. Keine fünfte Stufe in v1.
