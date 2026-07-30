# v1-Ergänzung: Gebundene Arbeitszeit sichtbar machen

*Kleine Erweiterung des bestehenden v1-Umfangs. Keine neue Frage, keine neue Rechenlogik, keine Änderung am Scoring. Reine Sichtbarmachung eines Werts, der bereits berechnet wird.*

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
Die bestehende Berechnung aus `src/lib/scoring.ts` wird verwendet. **Keine zweite Rechenlogik anlegen und keine Werte duplizieren.** Falls die gebundene Arbeitszeit dort aktuell nur als Zwischenwert innerhalb der Score-Berechnung existiert, wird sie als eigener, benannter Rückgabewert aus der bestehenden Funktion herausgereicht (z. B. `gebundeneStundenProMonat`) — die Berechnungsformel selbst bleibt unverändert.

**3.2 Darstellung**
- Als eigene Kennzahl neben dem Score, nicht als Fußnote.
- Immer mit „ca." bzw. gerundet ausgeben. Die Eingaben sind Auswahl-Stufen, keine gemessenen Werte — eine Zahl wie „37,4 Std." würde eine Genauigkeit vortäuschen, die nicht existiert.
- Rundung: auf ganze Stunden. Bei Werten unter 1 Std./Monat stattdessen „unter 1 Std./Monat" ausgeben.
- Als große Tabellenziffer im bestehenden Typo-System (Inter mit `tnum`), damit die Zahlen in der Liste fluchten.
- Einheit gut lesbar mitschreiben („Std./Monat"), nicht nur als Symbol.

**3.3 Wo die Zahl erscheint**
- **Ergebnis-/Detailansicht eines Anwendungsfalls:** prominent, direkt neben dem Score.
- **Ranking-Liste:** als zusätzliche Spalte bzw. Zeile pro Eintrag. Auf schmalen Screens darf sie hier entfallen und nur in der Detailansicht erscheinen (Progressive Disclosure).

**3.4 Herkunft transparent machen**
Ein kurzer Hinweis unter der Zahl, aus welchen Angaben sie stammt (siehe Beispiel oben). Das verhindert die Rückfrage „wo kommt das her?" und stützt die Glaubwürdigkeit. Kein aufklappbares Rechenwerk nötig — ein Satz genügt.

**3.5 Persistenz**
Der Wert wird mit dem Anwendungsfall gespeichert, nicht nur zur Anzeige berechnet. Grund: Er ist der Baseline-Wert für den späteren Soll-Ist-Vergleich in v2. Ändert der Nutzer seine Antworten, wird er neu berechnet und überschrieben.

---

## 4. Was ausdrücklich NICHT dazugehört

- **Keine Umrechnung in Geld.** Dafür bräuchte es einen Stundensatz, den das Tool nicht kennt. Eine erfundene oder pauschal angenommene Zahl wäre angreifbar und widerspricht dem Prinzip, keine Scheingenauigkeit zu erzeugen.
- **Keine Änderung an `computeScores()` inhaltlich.** Der Score bleibt exakt wie er ist. Diese Ergänzung ist reine Darstellung eines vorhandenen Werts.
- **Keine neue Wizard-Frage.** Die 6 Fragen bleiben unverändert.
- **Keine Aussage über die erreichbare Einsparung.** Die Zahl beschreibt den **Ist-Zustand** (so viel Arbeitszeit bindet die Aufgabe heute), nicht die künftige Ersparnis. Automatisierung ersetzt nie 100 %. Formulierungen wie „spart 38 Std./Monat" sind falsch und dürfen nicht verwendet werden — korrekt ist „bindet aktuell ca. 38 Std./Monat".

---

## 5. Akzeptanzkriterien

- [ ] Die gebundene Arbeitszeit wird pro Anwendungsfall in der Detailansicht angezeigt.
- [ ] Der Wert stammt aus der bestehenden Berechnung in `scoring.ts`, ohne duplizierte Logik.
- [ ] Der Score-Wert ist gegenüber dem Stand vor dieser Änderung unverändert (Regressionstest).
- [ ] Die Zahl ist gerundet und als Näherung gekennzeichnet („ca.").
- [ ] Werte unter 1 Std./Monat werden als „unter 1 Std./Monat" ausgegeben.
- [ ] Ein Herkunftshinweis ist sichtbar.
- [ ] Der Wert wird persistiert.
- [ ] Nirgends im UI wird der Wert als „Ersparnis" bezeichnet.

---

## 6. Testfälle

| Fall | Eingaben (Häufigkeit / Dauer / Personen) | Erwartete Ausgabe |
|---|---|---|
| Standardfall | mittlere Werte | plausible gerundete Std./Monat mit „ca." |
| Kleinstfall | seltenste Häufigkeit, kürzeste Dauer, 1 Person | „unter 1 Std./Monat" |
| Großfall | häufigste Stufe, längste Dauer, viele Personen | hoher Wert, gerundet, keine Nachkommastellen |
| Änderungsfall | Antwort auf Frage 1 nachträglich ändern | Wert wird neu berechnet und persistiert |
| Regression | beliebiger Fall vor/nach der Änderung | identischer Score |

---

## 7. Offener, separat zu entscheidender Punkt (nicht Teil dieser Ergänzung)

Ergänzend wurde ein weiteres v1-Feld diskutiert: ein Steckbrief-Feld **„Anbindung an bestehende Systeme nötig?"** (nein / ein System / mehrere Systeme) als Tag am Ergebnis, um den größten nicht erfassten Kostentreiber sichtbar zu machen. Dieses Feld ist **noch nicht entschieden** und **nicht Teil dieser Spezifikation**. Es sollte erst gebaut werden, wenn es ausdrücklich beauftragt wird.

---

## 8. Zusatz-Ergänzung für v1: Risiko-Stufen sprachlich an die KI-Verordnung anlehnen

*Reine Benennungsanpassung am bestehenden Risiko-Tag. Keine neue Funktion, keine neue Frage, keine neue Logik. Aufwand nahe null. Ziel ist nur, dass das Feld später in v2 ohne Bruch an die EU-KI-Verordnung andockt.*

**Hintergrund:** Die EU-KI-Verordnung (EU AI Act) arbeitet mit einer vierstufigen Risikoeinteilung. Der bestehende Risiko-Tag in Klarsicht hat bereits vier Stufen (gering / überschaubar / hoch / inakzeptabel) und bildet diese Logik faktisch schon ab. In v2 ist eine eigene Compliance-Sicht geplant, die genau auf dieser Einordnung aufsetzt. Damit dieser spätere Anschluss ohne Datenmigration und ohne Umgewöhnung der Nutzer funktioniert, sollten die vier Stufen schon jetzt so benannt sein, dass sie zur Verordnungslogik passen.

**Was konkret zu tun ist:**

- Die **vier bestehenden Stufen bleiben inhaltlich unverändert.** Es werden keine Stufen hinzugefügt oder entfernt.
- Die Stufenbezeichnungen werden so gewählt oder ergänzt, dass die Nähe zur Verordnung erkennbar ist. Empfohlene Zuordnung:
  - **gering** → entspricht „minimales Risiko"
  - **überschaubar** → entspricht „begrenztes Risiko / Transparenzpflicht"
  - **hoch** → entspricht „Hochrisiko"
  - **inakzeptabel** → entspricht „inakzeptabel / verboten"
- Diese Entsprechung kann als dezenter Zusatz im Auswahlfeld sichtbar gemacht werden (z. B. als kurzer Klammerzusatz oder Tooltip), muss es aber nicht. Für v1 reicht es, die interne Benennung und Reihenfolge an dieser Logik auszurichten. Die sichtbare Ausgestaltung ist optional.

**Was ausdrücklich NICHT dazugehört (v1):**

- **Keine Nennung von Gesetzesartikeln, keine Rechtsbegriffe im Detail, kein Compliance-Anspruch.** In v1 ist das eine reine Benennungsfrage. Alles Weitere (Rollen, Register, Begründungspflicht, rechtlicher Hinweis) gehört in das dedizierte v2-Compliance-Inkrement und wird hier nicht vorweggenommen.
- **Kein Verweis auf die Verordnung im Nutzertext**, der so klingen könnte, als erfülle Klarsicht damit eine gesetzliche Pflicht. Diese Abgrenzung ist wichtig und wird in v2 mit einem ausdrücklichen Haftungshinweis versehen — in v1 wird das Thema schlicht nicht aufgemacht.

**Akzeptanzkriterium:**
- [ ] Die vier Risiko-Stufen sind intern in einer Reihenfolge und Benennung angelegt, die der vierstufigen Verordnungslogik entspricht, ohne dass sich die Anzahl oder die inhaltliche Bedeutung der Stufen ändert.
- [ ] v1 macht keinerlei Compliance-Zusage und nennt keine Gesetzesgrundlage im Nutzertext.
