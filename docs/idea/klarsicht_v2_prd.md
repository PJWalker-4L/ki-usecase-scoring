# Klarsicht v2 — Product Requirements Document

*Vom Priorisierungs-Werkzeug zum Cockpit für das KI-Portfolio.*

**Für Claude Code:** Dieses Dokument beschreibt neun einzeln umsetzbare Inkremente (A–I). Sie sind so geschnitten, dass jedes für sich gebaut, getestet und ausgeliefert werden kann. **Nicht alles auf einmal umsetzen.** Immer nur das aktuell beauftragte Inkrement bauen. Die Reihenfolge in Abschnitt 5 ist verbindlich, weil spätere Inkremente auf früheren aufbauen.

---

## 1. Ausgangslage und Zielbild

**Was v1 ist:** Ein Werkzeug, das KI-Anwendungsfälle über konkrete Alltagsfakten bewertet und in eine belastbare Reihenfolge bringt („Fakten statt Noten").

**Das Problem von v1 als Produkt:** Priorisierung ist ein einmaliges Ereignis. Nach dem Workshop hat der Kunde seine Reihenfolge — und keinen Grund, das Tool je wieder zu öffnen.

**Was v2 daraus macht:** Klarsicht begleitet den Anwendungsfall über seinen gesamten Lebensweg — von der Idee über die Umsetzbarkeitsprüfung bis zum belegten Nutzen im Regelbetrieb.

**Positionierung (Kernsatz):**
> Klarsicht ist der Ort, an dem aus KI-Vorhaben belegter Nutzen wird — weil es die Nutzenprognose von Anfang an kennt und später gegen die Realität hält.

**Der strukturelle Vorteil:** Kein Projektmanagement-System besitzt die ursprüngliche Nutzen- und Kostenprognose. Klarsicht erzeugt sie beim Scoring und kann deshalb als einziges System später beweisen, ob sich ein KI-Vorhaben gelohnt hat. Alle Inkremente dieses PRD dienen letztlich dazu, diesen Kreis zu schließen (Inkrement I).

---

## 2. Leitprinzipien (gelten für alle Inkremente)

1. **Kein Task-Management.** Klarsicht führt keine Aufgaben, keine Zuweisungen auf Aufgabenebene, keine Erledigt-Haken, keine Gantt-Balken für Einzelschritte. Die Ausführung bleibt in den Systemen, die der Kunde bereits hat. Klarsicht arbeitet auf der Ebene **darüber**: Portfolio, Status, Zahlen. Eine Task-Ebene wird nur gebaut, wenn Kunden aktiv danach fragen — bis dahin ist sie ausdrücklich ausgeschlossen.
2. **Klarsicht führt alle Fälle, nicht nur die umsetzbaren.** Ein Fall, der heute an fehlenden Voraussetzungen scheitert, bleibt mit seiner Lückenliste sichtbar im System. „Bereit" ist ein **Zustand**, kein Türsteher. Das Wissen, welcher Fall warum blockiert ist, gehört zu den wertvollsten Ergebnissen — und ein blockierter Fall kann nach Schließen der Lücke ohne Neuerfassung weiterlaufen.
3. **Fakten statt Noten bleibt bindend.** Neue Eingaben werden als konkrete Sachfragen gestellt, nie als abstrakte Selbstbewertung auf einer Skala.
4. **Keine Scheingenauigkeit.** Kostenschätzungen erscheinen als Korridor (von–bis), nie als exakter Betrag. Näherungswerte werden sichtbar als solche gekennzeichnet.
5. **Klarsicht erfasst und vergleicht, es führt nicht aus und misst nicht selbst.** Ist-Werte wie Trefferquote oder tatsächlicher Zeitaufwand werden eingetragen, nicht automatisch aus laufenden Systemen erhoben.
6. **Das bestehende Designsystem gilt unverändert** (Light-first, eine Akzentfarbe Petrol, separate Score-Skala, Tabellenziffern, Space Grotesk / Inter). Neue Ansichten erzeugen keine neuen Farbwelten.

---

## 3. Fachlicher Rahmen: die vier Phasen

v2 orientiert sich an einem vierphasigen Einführungsmodell. Wichtig für die Umsetzung: **Klarsicht bildet nicht die Phasen als Arbeit ab, sondern die Zahlen und Zustände entlang der Phasen.**

| Phase | Inhalt | Was Klarsicht davon abbildet |
|---|---|---|
| **1 Readiness** | Fälle finden, priorisieren, erste Kosten-/Nutzenschätzung | Scoring (v1), Baseline, TCO-Korridor, Voraussetzungsprüfung |
| **2 Foundation** | Architektur-, Datenschutz-, Governance-Entscheidungen | Voraussetzungen als Gate + Lückenliste; **nicht** die Entscheidungen selbst |
| **3 Pilot** | Ein Fall geht live, Messung gegen Baseline | Messrahmen: Ist-Werte, Trefferquote, Adoption; **nicht** die Durchführung |
| **4 Scale & Operations** | Regelbetrieb, Monitoring, TCO-Validierung | Soll-Ist-Vergleich für Nutzen und Kosten; **kein** technisches Modell-Monitoring |

---

## 4. Datenmodell-Überblick (Zielzustand nach allen Inkrementen)

Pro Anwendungsfall kommen zu den v1-Feldern hinzu:

```
status               → Zustand im Lebensweg (siehe Inkrement A)
statusHistorie       → Zeitpunkte der Statuswechsel
verantwortlich       → benannte Person (Freitext, kein Benutzerkonto nötig)
voraussetzungen      → geprüfte Voraussetzungen je Fall + offene Lücken (B)
tcoSchaetzung        → Kostenkorridor mit Bestandteilen (E)
baselineStunden      → gebundene Arbeitszeit aus v1 (siehe Anmerkung unten)
archetypId           → intern, unsichtbar (F)
beispielrichtungen   → generierte Texte (F)
meilensteine         → generierte Stationen mit Zieldaten (G)
istWerte             → nach Pilot erfasste Realwerte (H)
akteurRolle          → Betreiber / Anbieter je Fall (J)
risikoklasse         → aus Risiko-Tag abgeleitete KI-VO-Klasse + Begründung (J)
```

Organisationsweit (einmal je Mandant/Projekt, gilt für alle Fälle):

```
rahmenbedingungen    → Datenverarbeitungsort, Anbieter, AVV, Betriebsrat, Verantwortlichkeiten (B)
```

#### Anmerkung v1 → v2: Baseline gebundene Arbeitszeit

In v1 wird die gebundene Arbeitszeit als **numerischer Rohwert** in `SavedCase.result.hoursPerMonth` persistiert (localStorage, Key `kist-cases-v1`). Sie wird aus den Wizard-Fragen 1–3 über `computeScores()` berechnet und bei jedem Speichern mit dem Fall mitgeschrieben; bei geänderten Antworten wird der Wert neu berechnet und überschrieben. Die UI zeigt gerundete Näherungswerte („ca. X Std./Monat"); der gespeicherte Wert bleibt ungerundet, damit die Score-Berechnung stabil bleibt.

**Bei Inkrement A (Datenmodell) und Inkrement I (Prognose vs. Realität):** Den Wert ins Zielfeld `baselineStunden` überführen (siehe Feldliste oben). Bewusst **keine Umbenennung in v1** — der interne Key `hoursPerMonth` vermeidet Breaking Changes für bestehende localStorage-Daten.

**Migration (Pflicht bei A):** Beim Laden alter v1-Fälle `baselineStunden = result.hoursPerMonth ?? null` setzen. Optional während einer Übergangsphase beide Keys parallel schreiben. Export/API in v2 soll `baselineStunden` als kanonischen Namen verwenden; `hoursPerMonth` nur noch als Legacy-Alias lesen.

**Soll-Ist-Vergleich (I):** `baselineStunden` ist die Prognose-Seite für gebundene Arbeitszeit; die Ist-Seite kommt aus Inkrement H. Formulierung im UI stets als **Ist-Zustand** („bindet aktuell …"), nie als Ersparnis.

---

## 5. Umsetzungsreihenfolge

```
A  Statusverlauf & Datenmodell        ← Fundament, zuerst
B  Voraussetzungs-Gate & Lückenliste
C  Portfolio-Dashboard
D  Management-Sicht
        ↑ nach D ist v2 erstmals eigenständig vorführbar und verkaufbar
E  TCO-Ersteinschätzung
F  Archetyp-Klassifikation & Beispielrichtungen   (eigene Spec vorhanden)
G  Meilenstein-Generierung
H  Ist-Erfassung nach Pilot
I  Prognose vs. Realität              ← schließt den Kreis, das Alleinstellungsmerkmal
J  Compliance-Register (KI-VO-Sicht)  ← eigener Kaufauslöser, vorziehbar direkt nach B
```

**Begründung der Reihenfolge:** A ist Voraussetzung für alles Weitere. B–D erzeugen den ersten eigenständigen Produktnutzen (Überblick statt Einmal-Ranking) und sind ohne LLM baubar. E liefert die Kostenseite der Prognose. F und G sind die LLM-gestützten Differenzierer und setzen A und E voraus. H und I schließen den Kreis und brauchen alle vorherigen Daten.

**Sonderstellung von J:** Das Compliance-Register steht in der Liste am Ende, ist aber **technisch bereits nach B baubar** (es braucht nur Status, Verantwortlichen und den Risiko-Tag, kein LLM). Es ist bewusst als eigenständiger Block geführt, weil es einen **anderen Kaufauslöser** bedient als der gesamte Rest des PRD: nicht „welchen Fall zuerst und was bringt er?", sondern „welche KI setzen wir ein und wie ist sie einzuordnen?". Wenn sich im Vertrieb zeigt, dass die KI-Verordnung der stärkere Türöffner ist (siehe Diskussion Zielgruppe/Compliance), sollte J direkt nach B vorgezogen werden. Bis dahin bleibt es hinten, um den Nutzen-Kreis (A–I) nicht zu verzögern.

---

## 6. Die Inkremente

---

### Inkrement A — Statusverlauf & Datenmodell

**Ziel:** Ein Anwendungsfall bekommt einen Lebensweg. Ohne diesen Zustand ist keine der folgenden Ansichten möglich.

**Umfang:**
- Statusfeld pro Anwendungsfall mit genau diesen Zuständen:
  `Erfasst → Bewertet → Blockiert ⇄ Bereit → In Umsetzung → Pilot → Regelbetrieb → Verworfen`
- Statuswechsel manuell durch den Nutzer, mit Zeitstempel in einer Historie.
- Feld **Verantwortlich** (Freitext, Name/Rolle). Bewusst kein Benutzerkonto, keine Zuweisung, keine Benachrichtigung.
- Statusanzeige in der bestehenden Ranking-/Listenansicht.
- Filter nach Status in der Liste.

**Nicht enthalten:** Aufgaben unterhalb des Status, automatische Statuswechsel, Rollen-/Rechtesystem, Benachrichtigungen.

**Regeln:**
- `Erfasst` und `Bewertet` werden automatisch aus dem bestehenden v1-Flow gesetzt (erfasst = Steckbrief angelegt, bewertet = alle 6 Fragen beantwortet).
- Zwischen `Blockiert` und `Bereit` kann beliebig oft gewechselt werden (Doppelpfeil). Ab Inkrement B wird dieser Wechsel aus der Voraussetzungsprüfung abgeleitet statt manuell gesetzt.
- `Verworfen` löscht den Fall nicht, sondern blendet ihn aus dem aktiven Ranking aus. Ein verworfener Fall bleibt jederzeit wieder aktivierbar.

**Akzeptanzkriterien:**
- [ ] Jeder Anwendungsfall hat genau einen Status.
- [ ] Statuswechsel werden mit Zeitstempel historisiert.
- [ ] Die Liste lässt sich nach Status filtern.
- [ ] Verworfene Fälle erscheinen nicht im Standard-Ranking, sind aber auffindbar.
- [ ] Bestehende v1-Fälle erhalten bei der Migration automatisch einen sinnvollen Status.

---

### Fortsetzen unterbrochener Bewertungen — v2, abhängig von Konten und Serverspeicherung

**Was gebaut wird.** Auf der Startseite (Aufgabenliste) erscheint über der Rangfolge
ein Feld für eine begonnene, aber noch nicht abgeschlossene Bewertung. Es zeigt den
Namen der Aufgabe, den erreichten Stand ("Frage 4 von 6") und einen Fortschrittsbalken.
Ein Tippen führt direkt zur zuletzt offenen Frage, nicht zurück an den Anfang.

**Warum das erst v2 ist.** Die Funktion setzt voraus, dass ein unvollständiger Durchlauf
gespeichert wird. In v1 entsteht eine Aufgabe erst, wenn alle sechs Fragen beantwortet
sind — ein Durchlauf, eine Speicherung. Damit gibt es keinen Zustand "angefangen", den
das Feld anzeigen könnte. Es baut auf Konten und Serverspeicherung auf und kann erst
danach entstehen.

**Was v1 dafür ergänzen musste.** Ohne Zwischenspeicherung vernichtet ein Fehlgriff auf
das Schließen-Symbol den gesamten Durchlauf. Deshalb hat v1 einen Abbruch-Dialog:
"Bewertung abbrechen? Ihre Antworten zu dieser Aufgabe gehen verloren. Klarsicht speichert
erst, wenn alle sechs Fragen beantwortet sind." Sobald das Fortsetzen in v2 existiert,
kann dieser Dialog entfallen oder auf ein reines Fortsetzen-Angebot umgestellt werden.

**Was sich am Datenmodell ändert.** Eine Aufgabe braucht dann einen Status
(angefangen / bewertet) und den Index der zuletzt beantworteten Frage. Die Zählzeile über
der Liste wechselt von "X Aufgaben" zurück auf "X von Y Aufgaben bewertet".

**Abhängigkeiten.** Nutzerkonten; Serverspeicherung; die in Abschnitt 8 offene
Entscheidung zur Rollentrennung. Nicht isoliert vor diesen Punkten bauen.

**Akzeptanzkriterien (für die spätere Umsetzung).**
- [ ] Ein unterbrochener Durchlauf ist nach erneutem Öffnen der Anwendung wiederherstellbar.
- [ ] Das Feld führt zur zuletzt offenen Frage, nicht zu Frage 1.
- [ ] Eine unvollständige Bewertung erzeugt keinen Score und erscheint nicht in der Rangfolge.
- [ ] Die Zählzeile unterscheidet begonnene von bewerteten Aufgaben.

---

### Inkrement B — Voraussetzungs-Gate & Lückenliste

**Ziel:** Sichtbar machen, ob ein Fall überhaupt starten kann — und woran es sonst fehlt.

**Zwei Ebenen, sauber getrennt:**

**B.1 Organisationsweite Rahmenbedingungen** (einmal gesetzt, gelten für alle Fälle):
- Ort der Datenverarbeitung geklärt (ja/nein)
- Anbieter/Modell freigegeben (ja/nein)
- Auftragsverarbeitungsvertrag vorhanden (ja/nein)
- Betriebsrat eingebunden (ja/nein/nicht erforderlich)
- Verantwortlichkeit für KI-Einsatz benannt (ja/nein)

**B.2 Voraussetzungen je Anwendungsfall:**
- Benötigte Daten zugänglich (ja/teilweise/nein)
- Prozess dokumentiert (ja/nein)
- Fachlich verantwortliche Person benannt (ja/nein)
- Risikostufe eingeordnet (aus v1-Risiko-Tag, hier nur gespiegelt)

**Ableitung:** Ein Fall ist **Bereit**, wenn alle organisationsweiten Punkte erfüllt sind und alle fallbezogenen Voraussetzungen auf „ja" stehen. Sonst **Blockiert** — mit einer Liste der konkret offenen Punkte am Fall.

**Nicht enthalten:** Der Vorbereitungsplan selbst. Klarsicht zeigt **was fehlt**, nicht **wer es bis wann schließt**. „Daten müssen bereinigt werden" ist ein Zustand; „Müller bereinigt sie bis 30.9." ist Task-Management und bleibt draußen.

**Darstellung:**
- Am Fall: Lückenliste als klar lesbare Aufzählung offener Punkte.
- In der Liste: blockierte Fälle bleiben sichtbar, sind aber als blockiert erkennbar und im Ranking optisch abgesetzt.
- Blockierte Fälle behalten ihren Score. Der Score sagt, wie wertvoll der Fall wäre — der Status sagt, ob er jetzt geht. Diese beiden Aussagen dürfen nicht vermischt werden.

**Akzeptanzkriterien:**
- [ ] Rahmenbedingungen sind einmal zentral pflegbar.
- [ ] Der Status `Bereit`/`Blockiert` wird automatisch aus den Voraussetzungen abgeleitet, nicht manuell gesetzt.
- [ ] Am blockierten Fall ist ohne Klick erkennbar, wie viele Punkte offen sind; die Details sind einen Klick entfernt.
- [ ] Wird die letzte Lücke geschlossen, wechselt der Fall automatisch auf `Bereit`.
- [ ] Der Score bleibt von der Blockierung unberührt.

---

### Inkrement C — Portfolio-Dashboard

**Ziel:** Überblick über alle Anwendungsfälle auf einen Blick — die Arbeitsansicht für den Berater und den KI-Verantwortlichen.

**Umfang (maximal 6 Kennzahlen oben, dann Details):**
- Anzahl Fälle je Status
- Summe der gebundenen Arbeitszeit über alle bereiten Fälle (das Gesamtpotenzial)
- Anzahl blockierter Fälle + häufigste Blockadeursache
- Anzahl Fälle je Risikostufe, hervorgehoben: hoch/inakzeptabel
- Darunter: die Fallliste mit Status, Score, gebundener Arbeitszeit, Verantwortlichem

**Nicht enthalten:** Zeitverläufe, Diagramme über Wochen, Auslastungsansichten, Ressourcenplanung.

**Gestaltung:** Bestehendes Designsystem. Kennzahlen als große Tabellenziffern. Die Score-Farbskala bleibt den Scores vorbehalten; Statusanzeigen verwenden neutrale Flächen, damit „hoher Score" und „Status" visuell nicht verwechselt werden.

**Akzeptanzkriterien:**
- [ ] Alle Kennzahlen aktualisieren sich ohne Neuladen, wenn ein Fall geändert wird.
- [ ] Höchstens 6 Kennzahlen oberhalb der Fallliste.
- [ ] Auf schmalen Screens einspaltig, Kennzahlen zuerst.

---

### Inkrement D — Management-Sicht

**Ziel:** Eine reduzierte, präsentationsfähige Ansicht für die Geschäftsführung. Das ist das stärkste Verkaufsargument des Produkts.

**Umfang:**
- Eigene, stark reduzierte Ansicht (keine Bearbeitungsfunktionen, nur Lesen).
- Antwort auf genau drei Fragen:
  1. **Was läuft?** — Fälle in Umsetzung, Pilot und Regelbetrieb mit Status und Verantwortlichem.
  2. **Was bringt es?** — Summe der gebundenen Arbeitszeit der laufenden Fälle; ab Inkrement I ergänzt um die tatsächlich erreichten Werte.
  3. **Wo klemmt es?** — blockierte Fälle mit hohem Score und der jeweiligen Blockadeursache.
- Exportfähig als PDF oder druckbare Ansicht für Sitzungsunterlagen.

**Nicht enthalten:** Eigenes Rechtesystem. Die Ansicht ist zunächst schlicht eine andere Ansicht derselben Daten. Zugriffsbeschränkung erst, wenn die noch offene Rollenfrage entschieden ist.

**Akzeptanzkriterien:**
- [ ] Die Ansicht ist ohne Erklärung verständlich für jemanden, der das Tool nie benutzt hat.
- [ ] Keine Bearbeitungsmöglichkeit.
- [ ] Druck-/PDF-Ausgabe ist lesbar und ohne abgeschnittene Inhalte.

---

### Inkrement E — TCO-Ersteinschätzung

**Ziel:** Die Kostenseite der Prognose. Ohne sie ist der spätere Soll-Ist-Vergleich einseitig.

**Prinzip:** Nicht nach Kosten fragen, sondern nach Fakten, aus denen sie folgen. Der Nutzer kennt seine Prozesszahlen, nicht seine API-Kosten.

**Neue Sachfragen (im Anschluss an die 6 Wizard-Fragen, klar als eigener Block):**
1. **Anbindung an bestehende Systeme nötig?** — nein / ein System / mehrere Systeme
2. **Muss jedes Ergebnis geprüft werden?** — jedes / Stichprobe / keine Prüfung nötig
3. **Wie lange dauert eine Prüfung ungefähr?** — nur wenn Frage 2 nicht „keine Prüfung" ist

Volumen und Häufigkeit sind bereits aus den v1-Fragen bekannt und werden nicht erneut abgefragt.

**Ausgabe: ein Kostenkorridor mit drei sichtbaren Bestandteilen:**
- **Einmaliger Aufbau** (getrieben vom Integrationsaufwand)
- **Laufender Betrieb** (getrieben vom Volumen)
- **Laufende Prüfzeit** (Human-in-the-loop, in Stunden pro Monat)

**Der entscheidende Punkt:** Die Prüfzeit ist gleichzeitig Qualitätsmechanismus **und** Kostenblock. Sie wird deshalb von der gebundenen Arbeitszeit abgezogen und als **Netto-Effekt** ausgewiesen:

> bindet aktuell ca. 40 Std./Monat — davon ca. 15 Std./Monat Prüfaufwand → **Netto ca. 25 Std./Monat**

Genau diese Ehrlichkeit unterscheidet Klarsicht von Anbieter-Rechnungen.

**Regeln:**
- Alle Beträge als Korridor (von–bis), nie als exakte Zahl.
- Stundenwerte in Stunden, nicht in Geld. Klarsicht kennt keinen Stundensatz und erfindet keinen.
- Der Netto-Effekt fließt **nicht** in `computeScores()` ein. Er wird zusätzlich angezeigt, verändert das Scoring nicht. (Eine Änderung der Score-Formel wäre ein eigener, separat zu entscheidender Eingriff.)

**Akzeptanzkriterien:**
- [ ] Drei neue Fragen, klar getrennt vom bestehenden 6-Fragen-Block.
- [ ] Frage 3 erscheint nur, wenn relevant.
- [ ] Ausgabe als Korridor, nie als Punktwert.
- [ ] Netto-Effekt ist sichtbar und als Rechnung nachvollziehbar.
- [ ] Der Score ist unverändert gegenüber dem Stand vor diesem Inkrement.

---

### Inkrement F — Archetyp-Klassifikation & Beispielrichtungen

**Ziel:** Nach der Fallbeschreibung konkrete Beispielrichtungen zeigen, wie sich der Prozess typischerweise automatisieren ließe.

**Verweis:** Für dieses Inkrement existiert eine eigene, vollständige Spezifikation (`archetyp_klassifikation_spec.md`). Sie ist maßgeblich und wird hier nicht wiederholt.

**Die wichtigsten Punkte in Kürze:**
- Die Archetyp-Klassifikation läuft **vollständig im Backend**. Der Nutzer sieht nie ein Archetyp-Label und bestätigt es nicht.
- Sichtbar sind nur die generierten Beispielrichtungen und Fallstricke, im Konjunktiv formuliert.
- Aus dem Archetyp wird **ausschließlich die Risikostufe** vorbelegt. Die 6 Wizard-Fragen beantwortet der Nutzer selbst und werden nie vorausgefüllt.
- LLM-Call ausschließlich serverseitig. Fällt er aus, entfallen die Vorschläge; der Nutzer kann normal weiterarbeiten. Kein statischer Ersatztext.

**Abhängigkeit:** Sollte nach A und E gebaut werden, damit der Fall-Datensatz zum Zeitpunkt der Klassifikation vollständig ist.

---

### Inkrement G — Meilenstein-Generierung

**Ziel:** Nach der Bewertung automatisch einen groben Weg zur Umsetzung vorschlagen — damit der Nutzer nicht vor der leeren Seite steht, wenn er vom „Was zuerst?" zum „Wie kommen wir dahin?" wechselt.

**Der zentrale Mechanismus:**
Die Meilensteine werden **nicht frei generiert**. Sie entstehen aus zwei Bausteinen:
- **Das Phasenmodell liefert die Struktur** — jeder Fall durchläuft dieselben Stationen (Voraussetzungen klären → Aufbau → Pilot → Auswertung → Regelbetrieb).
- **Der Archetyp liefert den Inhalt** — ein Extraktions-Fall braucht andere konkrete Schritte als ein RAG-Fall.

Das ist dieselbe Guardrail-Logik wie bei den Beispielrichtungen: kuratiertes Muster statt freier Erfindung. Genau das macht die Vorschläge belastbar.

**Umfang:**
- 4–6 Meilensteine je Fall, mit Bezeichnung, kurzer Erläuterung und vorgeschlagenem Zieldatum.
- Zieldaten als grobe Zeitachse (Wochen/Monate), vom Nutzer frei überschreibbar.
- Meilensteine sind bearbeitbar, ergänzbar und löschbar.
- Darstellung als einfache Zeitachse am Fall.

**Nicht enthalten:** Teilaufgaben unterhalb der Meilensteine, Zuweisungen, Abhängigkeiten zwischen Meilensteinen, Ressourcenplanung, Gantt-Funktionalität. Meilensteine haben genau zwei Zustände: offen / erreicht.

**Framing:** Wie bei den Beispielrichtungen im Konjunktiv und ausdrücklich als Vorschlag gekennzeichnet („Ein typischer Weg für einen Fall wie diesen könnte so aussehen"). Nie als verbindlicher Projektplan.

**Abhängigkeit:** Setzt F voraus (Archetyp) und A (Status).

**Akzeptanzkriterien:**
- [ ] 4–6 Meilensteine werden generiert, nicht mehr.
- [ ] Alle Meilensteine sind vollständig editierbar.
- [ ] Meilensteine haben genau zwei Zustände.
- [ ] Kein Feld für Teilaufgaben existiert im Datenmodell.
- [ ] Der Vorschlagscharakter ist im UI-Text sichtbar.

---

### Inkrement H — Ist-Erfassung nach Pilot

**Ziel:** Den Messrahmen bereitstellen, mit dem der Pilot gegen die Baseline geprüft wird.

**Umfang — erfasst wird manuell, nicht gemessen:**
- **Tatsächlich gebundene Arbeitszeit nach Einführung** (Std./Monat) — Gegenstück zur Baseline
- **Tatsächlicher Prüfaufwand** (Std./Monat) — Gegenstück zur TCO-Schätzung
- **Trefferquote / Qualität** (Prozentwert oder Stufe)
- **Adoption:** wie viele der vorgesehenen Nutzer arbeiten tatsächlich damit (x von y)
- **Tatsächliche Kosten** (Betrag, optional)
- Erfassungsdatum

**Warum Adoption die wichtigste dieser Zahlen ist:** KI-Vorhaben scheitern selten an der Technik. Ein Fall mit 90 % Trefferquote und 20 % Nutzung ist gescheitert. Diese Zahl muss im Dashboard sichtbar sein, nicht in einem Detailfeld vergraben.

**Nicht enthalten:** Automatisches Modell-Monitoring, Drift-Erkennung, Anbindung an laufende Systeme. Das wäre ein eigenes Produkt. Klarsicht erfasst die Werte, es erhebt sie nicht.

**Verfügbarkeit:** Die Ist-Erfassung wird erst angeboten, wenn ein Fall den Status `Pilot` oder `Regelbetrieb` erreicht hat.

**Akzeptanzkriterien:**
- [ ] Ist-Werte sind nur ab Status `Pilot` erfassbar.
- [ ] Mehrfache Erfassung über die Zeit ist möglich (mit Datum), nicht nur ein einmaliger Eintrag.
- [ ] Adoption ist als x-von-y erfassbar und im Portfolio-Dashboard sichtbar.
- [ ] Keine Felder für automatisch erhobene technische Metriken.

---

### Inkrement I — Prognose vs. Realität

**Ziel:** Der Abschluss des Kreises und das Alleinstellungsmerkmal des Produkts.

**Umfang:** Eine Gegenüberstellung pro Fall — vier Zahlen nebeneinander:

| | Prognose | Realität |
|---|---|---|
| **Gebundene Arbeitszeit** | Baseline aus v1 | Ist-Wert aus H |
| **Kosten / Aufwand** | Korridor aus E | Ist-Wert aus H |

Plus die Abweichung in Prozent und eine schlichte, ehrliche Einordnung: übertroffen / im Rahmen / verfehlt.

**Aggregiert in der Management-Sicht:** dieselbe Gegenüberstellung über alle Fälle im Regelbetrieb — die Antwort auf die Frage „was bringt KI bei uns tatsächlich?".

**Gestaltungsregel:** Die Darstellung muss auch unangenehme Ergebnisse klar zeigen. Ein Tool, das nur Erfolge sichtbar macht, verliert genau die Glaubwürdigkeit, die sein Verkaufsargument ist. Verfehlte Prognosen werden nicht kleingeschrieben oder ausgeblendet.

**Nicht enthalten:** Automatische Interpretation oder Handlungsempfehlung („Sie sollten X tun"). Klarsicht stellt die Zahlen gegenüber; die Deutung übernimmt der Mensch.

**Abhängigkeit:** Setzt E (Prognose-Kosten), H (Ist-Werte) und die v1-Baseline voraus.

**Akzeptanzkriterien:**
- [ ] Die Gegenüberstellung erscheint nur bei Fällen mit erfassten Ist-Werten.
- [ ] Fehlende Werte werden als fehlend gekennzeichnet, nicht als Null interpretiert.
- [ ] Negative Abweichungen sind genauso deutlich dargestellt wie positive.
- [ ] Die aggregierte Sicht ist in der Management-Ansicht verfügbar.

---

### Inkrement J — Compliance-Register (KI-VO-Sicht)

**Ziel:** Ein einfaches Register aller eingesetzten und geplanten KI-Anwendungsfälle, das Unternehmen als Ausgangsdokumentation für die EU-KI-Verordnung (EU AI Act) nutzen können. Das bedient einen anderen Kaufauslöser als der Rest des PRD: eine regulatorische Pflicht statt eines Optimierungswunsches.

**Warum Klarsicht dafür fast fertig ist:** Die Verordnung verlangt als ersten Schritt, dass Unternehmen ihre KI-Systeme erfassen, die Risikoklasse bestimmen und ihre Rolle (Anbieter/Betreiber) klären. Die Risikoklasse bemisst sich dabei am **Anwendungsfall**, nicht am Modell — also genau auf der Ebene, auf der Klarsicht ohnehin arbeitet. Fallbeschreibung, Risiko-Tag, Verantwortlicher, Status und Human-in-the-loop sind bereits vorhanden. Dieses Inkrement bündelt sie zu einer Register-Sicht.

**Umfang:**
- **Rollenfeld pro Fall:** Betreiber / Anbieter, mit kurzer Erklärung im UI (viele Unternehmen sind beides — Betreiber, wenn sie fremde KI nutzen; Anbieter, wenn sie eigene entwickeln oder ein System wesentlich verändern).
- **Risikoklasse pro Fall**, aus dem bestehenden v1-Risiko-Tag abgeleitet (vier Stufen, siehe v1-Ergänzung „Risiko-Stufen an KI-VO anlehnen"), plus ein **Pflichtfeld „Begründung der Einstufung"** als Freitext. Die Begründung ist bewusst manuell, weil die Einordnung eine fachliche Entscheidung ist, die Klarsicht nicht automatisch treffen darf.
- **Register-Export:** eine vollständige Liste aller nicht verworfenen Fälle mit Bezeichnung, Rolle, Risikoklasse, Begründung, Verantwortlichem, Human-in-the-loop-Status und Stand-Datum — als PDF und als Tabelle. Das ist das Inventar, das gegenüber einer Aufsichtsbehörde oder der eigenen Geschäftsführung vorgezeigt werden kann.
- **Register-Sicht in der App:** dieselbe Liste gefiltert und sortierbar nach Risikoklasse und Rolle, mit Hervorhebung der Hochrisiko- und inakzeptablen Fälle.

**Verpflichtender Haftungshinweis (nicht optional, Teil der Definition of Done):**
An jeder Stelle, an der diese Funktion sichtbar wird — Register-Sicht, Rollenfeld, Risikoklassen-Feld und **auf jedem Export** —, steht ein klar formulierter, nicht wegklickbarer Hinweis mit sinngemäß diesem Inhalt:

> **Ohne Gewähr — keine Rechtsberatung.** Diese Übersicht unterstützt Sie beim Erfassen und Ordnen Ihrer KI-Anwendungsfälle. Sie ist keine rechtsverbindliche Einstufung nach der EU-KI-Verordnung und ersetzt keine rechtliche Prüfung. Ob und wie die Verordnung auf einen konkreten Anwendungsfall zutrifft, welche Pflichten daraus folgen und welche Fristen gelten, muss im Einzelfall durch eine qualifizierte Rechtsberatung geklärt werden. Für die Richtigkeit und Vollständigkeit der Einordnung übernimmt Klarsicht keine Haftung.

Auf dem PDF-Export erscheint dieser Hinweis sichtbar auf jeder Seite (Kopf- oder Fußzeile), nicht nur einmal am Anfang — damit er auch bei ausgedruckten oder weitergereichten Einzelseiten erhalten bleibt.

**Nicht enthalten:**
- **Keine automatische Risikoklassifizierung.** Klarsicht schlägt aus dem Risiko-Tag eine Stufe vor, die Einordnung verantwortet der Nutzer über die Pflicht-Begründung. Das Tool trifft die rechtliche Entscheidung nicht.
- **Keine Konformitätsbewertung**, keine Prüfung gegen einzelne Artikel der Verordnung, keine Aussage darüber, ob ein Fall „compliant" ist.
- **Kein technisches Logging der KI-Systeme selbst** (das von der Verordnung geforderte automatische Protokollieren der Systemläufe leistet Klarsicht nicht — das passiert in den KI-Systemen des Kunden, nicht hier).
- **Keine Nennung konkreter Fristen oder Stichtage im Nutzertext.** Die Übergangsfristen der Verordnung sind in Bewegung und rechtlich umstritten; ein fest verdrahtetes Datum im Produkt wäre schnell falsch. Fristen gehören in die Rechtsberatung, nicht in die Software.

**Grundsatzfrage vor dem Bau (nicht im Code lösbar):** Sobald Klarsicht als Compliance-Werkzeug positioniert wird, steigt die Haftungserwartung des Kunden. Vor dem Bau von J sollte geklärt sein, wie die Grenze „wir führen das Register, wir erfüllen nicht die Pflicht und haften nicht für die Einordnung" nicht nur im UI-Text, sondern auch vertraglich (AGB, Nutzungsbedingungen) abgesichert wird. Das ist eine unternehmerische und rechtliche Entscheidung, keine Entwicklungsaufgabe — sollte aber getroffen sein, bevor dieses Inkrement ausgeliefert wird.

**Abhängigkeit:** Setzt A (Status, Verantwortlicher) und den v1-Risiko-Tag voraus. Profitiert von B (Rahmenbedingungen), braucht es aber nicht zwingend. **Kein LLM nötig.** Damit direkt nach B baubar und vorziehbar, falls die Verordnung sich als stärkerer Verkaufshebel erweist.

**Akzeptanzkriterien:**
- [ ] Jeder Fall hat ein Rollenfeld (Betreiber/Anbieter) mit Erklärung.
- [ ] Die Risikoklasse wird aus dem Risiko-Tag vorgeschlagen; die Begründung ist ein Pflichtfeld.
- [ ] Der Haftungshinweis erscheint in der Register-Sicht und auf jedem Export, ist nicht wegklickbar und auf dem PDF auf jeder Seite sichtbar.
- [ ] Der Export enthält alle genannten Felder und ist als PDF und Tabelle verfügbar.
- [ ] Nirgends erscheint eine automatische „compliant/nicht compliant"-Aussage.
- [ ] Nirgends ist ein konkretes Fristdatum fest im Nutzertext verdrahtet.

---

## 7. Was v2 ausdrücklich nicht enthält

- Aufgabenverwaltung jeder Art (Tasks, Unteraufgaben, Zuweisungen, Erledigt-Haken)
- Zeiterfassung
- Ressourcen- und Kapazitätsplanung
- Dokumentenverwaltung
- Automatisches technisches Monitoring von KI-Systemen
- Schulungs- und Enablement-Inhalte (das ist Beratungsleistung, keine Software)
- Vorbereitungspläne als planbare Vorhaben (nur die Lücken werden geführt, nicht ihre Abarbeitung)
- Rechtsverbindliche Compliance-Aussagen, Konformitätsbewertungen oder Rechtsberatung (Inkrement J führt ein Register, es erfüllt keine gesetzlichen Pflichten und ersetzt keine juristische Prüfung)

---

## 8. Offene, vor bestimmten Inkrementen zu klärende Punkte

- **Rollen- und Rechtesystem.** Spätestens vor Inkrement D relevant, wenn die Management-Sicht zugriffsbeschränkt werden soll. Bis dahin ist sie nur eine andere Ansicht derselben Daten. Diese Frage ist seit v1 offen und sollte vor D entschieden werden. Voraussetzung auch für das Fortsetzen unterbrochener Bewertungen (Abschnitt 6, nach Inkrement A).
- **Mehrbenutzerbetrieb und Serverspeicherung.** Berührt die schon in v1 zurückgestellte Divergenz-Anzeige. Nicht Teil dieses PRD, aber Voraussetzung, falls mehrere Personen gleichzeitig am selben Portfolio arbeiten sollen — und für die Zwischenspeicherung unvollständiger Bewertungen (Fortsetzen-Funktion, Abschnitt 6, nach Inkrement A).
- **LLM-Anbieter und Hosting-Ort.** Vor Inkrement F zu entscheiden. Falls „Verarbeitung in der EU" zum Verkaufsargument werden soll, ist das ein hartes Auswahlkriterium und sollte vor dem Bau feststehen.
- **Haftungsabsicherung für das Compliance-Register.** Vor Inkrement J zu klären. Der Haftungshinweis im UI ist gebaut, aber die vertragliche Absicherung (AGB/Nutzungsbedingungen) und die grundsätzliche Frage, wie weit Klarsicht als Compliance-nahes Werkzeug auftreten will, ist eine unternehmerische/rechtliche Entscheidung, die vor der Auslieferung von J getroffen sein muss. Idealerweise mit juristischer Beratung, da hier die Positionierung selbst ein Haftungsrisiko berührt.
