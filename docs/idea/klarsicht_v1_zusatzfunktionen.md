# v1-Ergänzung: Gebundene Arbeitszeit sichtbar machen

*Kleine Erweiterung des bestehenden v1-Umfangs. Keine neue Frage, keine neue Rechenlogik, keine Änderung am Scoring. Reine Sichtbarmachung eines Werts, der bereits berechnet wird.*

**Umsetzungsstand:** Feature live (ADR-009). Automatisierte Tests: `src/lib/scoring.gebunden.test.ts` (`npm test`).

---

## 1. Was gebaut wird

Pro Anwendungsfall wird die **gebundene Arbeitszeit in Stunden pro Monat** als eigene, gut lesbare Zahl angezeigt — zusätzlich zum Score.

Beispiel-Darstellung:

> **ca. 38 Std./Monat** gebundene Arbeitszeit
> *aus: Häufigkeit × Dauer pro Vorgang × beteiligte Personen*

---

## 2. Warum das gebaut wird

**2.1 Die Zahl existiert bereits, sie ist nur unsichtbar.**
Die Wizard-Fragen 1–3 (Häufigkeit, Dauer pro Mal, Anzahl Personen) werden in `computeScores()` bereits zu einer gebundenen Arbeitszeit verrechnet, die dann in den Nutzen-Score einfließt. Aktuell sieht der Nutzer nur das Endergebnis (den Score), nicht die konkrete Zwischengröße. Der Aufwand für diese Ergänzung ist entsprechend gering.

**2.2 Sie ist die verständlichste Zahl im ganzen Tool.**
Ein Score von 74 ist eine Tool-interne Größe. „38 Stunden im Monat" versteht jede Führungskraft ohne Erklärung und kann sie sofort in Geld übersetzen. Für die Zielgruppe (nicht-analytische Fachbereiche, Geschäftsführung) ist das der stärkste Beleg, den das Tool erzeugt.

**2.3 Sie zahlt direkt auf das Kernprinzip „Fakten statt Noten" ein.**
Die Zahl macht sichtbar, dass der Score aus konkreten Alltagsfakten stammt und nicht aus einer Selbsteinschätzung. Das ist genau die Nachvollziehbarkeit, die das Tool gegenüber Berater-Excel auszeichnet.

**2.4 Sie ist die Baseline für spätere Erfolgsmessung.**
In v2 ist geplant, die ursprüngliche Nutzenprognose später gegen die tatsächlich erreichte Einsparung zu halten (Prognose vs. Realität). Diese gebundene Arbeitszeit ist der Ausgangswert dieses Vergleichs. Sie schon in v1 sichtbar und gespeichert zu haben, macht die v2-Funktion später ohne Nacharbeit möglich.

---

## 3. Umsetzung

**3.1 Berechnung**
Die bestehende Berechnung aus `src/lib/scoring.ts` wird verwendet. **Keine zweite Rechenlogik anlegen und keine Werte duplizieren.** Der Wert wird als `hoursPerMonth` aus `computeScores()` herausgereicht — die Berechnungsformel selbst bleibt unverändert.

**3.2 Darstellung**
- Als eigene Kennzahl neben dem Score, nicht als Fußnote.
- Immer mit „ca." bzw. gerundet ausgeben. Die Eingaben sind Auswahl-Stufen, keine gemessenen Werte — eine Zahl wie „37,4 Std." würde eine Genauigkeit vortäuschen, die nicht existiert.
- Rundung: auf ganze Stunden. Bei Werten unter 1 Std./Monat stattdessen „unter 1 Std./Monat" ausgeben.
- Als große Tabellenziffer im bestehenden Typo-System (Inter mit `tnum`), damit die Zahlen in der Liste fluchten.
- Einheit gut lesbar mitschreiben („Std./Monat"), nicht nur als Symbol.

**3.3 Wo die Zahl erscheint**
- **Ergebnis-/Detailansicht eines Anwendungsfalls:** prominent, direkt neben dem Score.
- **Ranking-Liste:** als zusätzliche Zeile pro Eintrag (`hidden sm:block` — auf schmalen Screens nur in der Detailansicht, Progressive Disclosure).

**3.4 Herkunft transparent machen**
Ein kurzer Hinweis unter der Zahl (`GEBUNDENE_ARBEIT_HERKUNFT` in `scoring.ts`), aus welchen Angaben sie stammt. Kein aufklappbares Rechenwerk nötig — ein Satz genügt.

**3.5 Persistenz**
Der Wert wird mit dem Anwendungsfall gespeichert (`SavedCase.result.hoursPerMonth`), nicht nur zur Anzeige berechnet. Bei geänderten Antworten wird er neu berechnet und überschrieben.

---

## 4. Was ausdrücklich NICHT dazugehört

- **Keine Umrechnung in Geld.** Dafür bräuchte es einen Stundensatz, den das Tool nicht kennt. Eine erfundene oder pauschal angenommene Zahl wäre angreifbar und widerspricht dem Prinzip, keine Scheingenauigkeit zu erzeugen.
- **Keine Änderung an `computeScores()` inhaltlich.** Der Score bleibt exakt wie er ist. Diese Ergänzung ist reine Darstellung eines vorhandenen Werts.
- **Keine neue Wizard-Frage.** Die 6 Fragen bleiben unverändert.
- **Keine Aussage über die erreichbare Einsparung.** Die Zahl beschreibt den **Ist-Zustand** (so viel Arbeitszeit bindet die Aufgabe heute), nicht die künftige Ersparnis. Formulierungen wie „spart 38 Std./Monat" sind falsch — korrekt ist „gebundene Arbeitszeit" mit „ca. X Std./Monat".

---

## 5. Akzeptanzkriterien

- [x] Die gebundene Arbeitszeit wird pro Anwendungsfall in der Detailansicht angezeigt.
- [x] Der Wert stammt aus der bestehenden Berechnung in `scoring.ts`, ohne duplizierte Logik.
- [x] Der Score-Wert ist gegenüber dem Stand vor dieser Änderung unverändert (Regressionstest in `scoring.gebunden.test.ts`).
- [x] Die Zahl ist gerundet und als Näherung gekennzeichnet („ca.").
- [x] Werte unter 1 Std./Monat werden als „unter 1 Std./Monat" ausgegeben.
- [x] Ein Herkunftshinweis ist sichtbar.
- [x] Der Wert wird persistiert.
- [x] Nirgends im UI wird der Wert als „Ersparnis" bezeichnet.

---

## 6. Testfälle

Automatisiert in `src/lib/scoring.gebunden.test.ts` (`npm test`). Persistenz beim Speichern manuell bzw. über bestehenden Wizard-Flow prüfbar.

| Fall | Eingaben (Häufigkeit / Dauer / Personen) | Erwartete Ausgabe | Status |
|---|---|---|---|
| Standardfall | mehrmals pro Woche / 30 Min. / 2–3 Personen | `ca. 15 Std./Monat` | ✅ automatisiert |
| Kleinstfall | seltener / 5 Min. / 1 Person | `unter 1 Std./Monat` | ✅ automatisiert |
| Großfall | mehrmals täglich / halber Tag / mehr als 10 | hoher Wert, gerundet | ✅ automatisiert |
| Änderungsfall | Häufigkeit nachträglich ändern | `hoursPerMonth` neu berechnet | ✅ automatisiert |
| Regression | Referenz-Antwortsatz vollständig | `gesamtScore === 63` | ✅ automatisiert |

---

## 7. Anbindung an Systeme — für v2 geplant (nicht v1)

In v1 wurde diskutiert, ob ein Steckbrief-Feld **„Anbindung an bestehende Systeme nötig?"** (nein / ein System / mehrere Systeme) als Tag am Ergebnis sichtbar werden soll. **Nicht umgesetzt in v1** — bewusst zurückgestellt.

**v2-Heimat:** **Inkrement E — TCO-Ersteinschätzung** in `klarsicht_v2_prd.md` (erste Sachfrage im TCO-Block nach den 6 Wizard-Fragen). Dort fließt die Antwort in den Kostenkorridor (Einmaliger Aufbau) ein, nicht in den Nutzen-Score.

---

## 8. ~~Risiko-Stufen / KI-VO-Benennung~~ — ersetzt durch ADR-017

*Dieser Abschnitt ist **historisch** und **nicht mehr maßgeblich**.*

Ursprünglich war vorgesehen, die Risiko-Stufen in v1 mit KI-VO-nahen Klammerzusätzen zu versehen (minimales Risiko, Hochrisiko, verboten …). **Entscheidung ADR-017 (2026-08-04):** v1 nutzt **betriebliche Labels** — Gering / Überschaubar / Hoch / **Nicht automatisieren** — ohne KI-VO-Klammern, plus kurzer Compliance-Disclaimer am Risiko-Schritt (keine Rechtsberatung, keine Einstufung).

Intern bleiben die IDs (`gering` … `inakzeptabel`) für v2-Anbindung erhalten. Ob sichtbare KI-VO-Klammerzusätze **später** ergänzt werden, ist **v2-Option, noch nicht entschieden** — siehe `klarsicht_v2_prd.md`, Abschnitt 8.
