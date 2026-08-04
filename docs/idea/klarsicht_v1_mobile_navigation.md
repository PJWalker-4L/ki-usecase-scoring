# v1 — Mobile Benutzerführung (Aufgaben, Wizard, Detail)

*Spezifikation für die mobile Shell: Tab-Leiste, Bewertungs-Wizard als Schicht, Fall-Detail. Gilt ergänzend zu `concept.md`, `archetyp_klassifikation_spec.md` und ADR-003/011/016/017.*

**Stand:** 2026-08-05

---

## 1. Ausgangslage

In v1 gibt es **kein Zwischenspeichern** unvollständiger Bewertungen. Eine Aufgabe wird erst persistiert, wenn der Nutzer am **Ergebnis-Schritt** speichert — vorher existiert nur flüchtiger Zustand im Wizard.

**Konsequenz:** Jeder sichtbare Navigationsausgang während eines laufenden Durchlaufs ist ein potenzieller Datenvernichter. Die mobile Führung muss das verhindern, ohne den Nutzer in einer Sackgasse zu lassen.

**Verweis v2:** Sobald unterbrochene Bewertungen gespeichert werden (Fortsetzen, `klarsicht_v2_prd.md`, Abschnitt 6), können Teile dieser Regeln gelockert werden — siehe dort.

---

## 2. Leitregel

> **Ein Tab-Wechsel darf nie Daten kosten.**

Daraus folgt alles Übrige in diesem Dokument.

---

## 3. Der Weg (Happy Path)

1. **Aufgaben-Tab** — Liste bewerteter Aufgaben (Rangfolge nach Nutzen/Machbarkeit).
2. **„+ Aufgabe bewerten"** (FAB) — startet eine neue Bewertung.
3. **Wizard-Schicht** — schiebt sich als **Vollbild-Overlay von unten** herein (Slide-up). Metapher: kein neuer Ort in der App, sondern etwas **Angefangenes** über der Liste.
4. **Ablauf im Wizard:** Steckbrief + sechs Bewertungsfragen (**Frage 1–7 von 7**) → Risiko beim KI-Einsatz → (Beispielrichtungen, falls LLM verfügbar) → Ergebnis.
5. **Ergebnis** — Speichern; **PDF** und **Teilen** als Kopfsymbole **nur hier** (sie beziehen sich auf diesen abgeschlossenen Fall).
6. **„Fertig"** — Schicht schließt, zurück im **Aufgaben-Tab**; die neu gespeicherte Aufgabe wird **kurz hervorgehoben** (Scroll in Sicht + visueller Akzent, danach wieder normal). Tab-Leiste ist wieder sichtbar.

**Antippen einer Karte** in der Liste öffnet die **Detail-Ansicht** nach demselben Muster: Vollbild-Schicht, **X** zum Schließen, **keine Tab-Leiste** darunter.

---

## 4. Drei Regeln (verbindlich)

### 4.1 Keine Tab-Leiste im Wizard und in der Detail-Schicht

Während Wizard oder Detail-Overlay aktiv sind, ist die **untere Tab-Leiste ausgeblendet**. Ebenso darf **keine andere Hauptnavigation** (z. B. Desktop-Header mit Start/Bewertung/Rangliste) erreichbar sein — sonst entsteht ein unbewachter Ausgang.

Ein Tab, den man nicht antippen darf, ist **kein Tab** (weder ausgegraut noch „disabled" in der Leiste während der Schicht).

**Einziger beabsichtigter Abbruch-Ausgang:** **X** oben rechts — mit Bestätigungsdialog, sobald Inhalt eingegeben wurde (siehe Abschnitt 6).

### 4.2 Hardware-Geste = X

**Android-Zurück** und die **iOS-Wischgeste** (Edge-Swipe zurück) müssen im Wizard und in der Detail-Schicht **denselben Abbruchdialog** auslösen wie das X — nicht still schließen, nicht eine Browser-History-Stufe zurück.

**Ausnahme — Wizard-Schritt „Zurück":** Der Footer-Button **„Zurück"** (vorherige Frage / vorheriger Schritt) ist **kein Abbruch**. Er löst **keinen** Dialog aus. Nur das **Verlassen der gesamten Schicht** ist geschützt.

**Akzeptanz:** Dialog-Verhalten auf echten Geräten testen (Android Chrome, iOS Safari); erfahrungsgemäß fällt diese Regel sonst bei der Umsetzung hinten runter.

### 4.3 Gesperrter Tab bleibt sichtbar und antippbar (v1-Shell, v2-Inhalt)

Der Tab **„Auswertung"** ist in v1 **noch nicht befüllt** (Portfolio-Dashboard = Inkrement C in v2). Er bleibt in der Tab-Leiste **sichtbar und antippbar** — mit Schloss-Symbol als Hinweis.

Beim Antippen erscheint eine **Erklärung**, warum die Auswertung noch gesperrt ist und welchen Nutzen sie später bringt. Das ist die **einzige freiwillige Stelle**, an der ein Nutzer etwas über den Portfolio-Mehrwert liest. Details und Copy: `klarsicht_v2_prd.md`, Abschnitt „Auswertung-Tab (v1-Versprechen)".

---

## 5. Wizard-Schicht — Gestaltung und Technik

| Aspekt | v1-Vorgabe |
|---|---|
| Container | Vollbild-Overlay über dem Aufgaben-Tab, Slide-up-Transition |
| Tab-Leiste | Ausgeblendet |
| Fortschritt | Segment-Leiste oben (bestehendes `SegmentProgress` / `FlowShell`) |
| Schließen | X oben rechts |
| Kein vierter Tab | Kein zusätzlicher Navigations-Tab innerhalb der Schicht |

**Hinweis zur Umsetzung:** Es muss nicht zwingend ein Radix-Bottom-Sheet sein — ein Vollbild-Panel mit Slide-up-Animation reicht, solange klar ist: **kein Routenwechsel**, Schicht liegt **über** der Aufgabenliste. Zurück/X schließen die Schicht; kein „Seite nach links" in der History.

**Ist-Zustand Code (Abweichung):** `ConditionalNavBar` blendet die Kopf-Navigation nur auf `/` aus; auf `/scorer` bleibt die Desktop-Nav erreichbar — widerspricht dieser Spec und ist bei Mobile-Umsetzung zu bereinigen.

---

## 6. Abbruch-Dialog

**Wann:** Sobald der Nutzer **irgendeinen Inhalt** eingegeben hat (Steckbrief-Text und/oder mindestens eine Antwort). Leerer Einstieg → X schließt **ohne** Dialog.

**Copy (Du-Anrede, sinngemäß):**

> **Bewertung abbrechen?**  
> Deine Antworten zu dieser Aufgabe gehen verloren. Klarsicht speichert erst, wenn die Bewertung abgeschlossen ist.

**Buttons:** „Weiter bewerten" (primär, Dialog schließen) / „Abbrechen" (sekundär, Schicht verwerfen und zur Aufgabenliste).

**Gleiche Logik** für Detail-Schicht beim **Bearbeiten** eines Falls, falls ungespeicherte Änderungen existieren (nur wenn Edit-Pfad in v1 vorgesehen).

---

## 7. Ergebnis-Schritt — PDF und Teilen

- **PDF-Export** und **Teilen** erscheinen als **Symbole in der Kopfzeile des Ergebnis-Schritts** — nicht in der globalen Tab-Leiste und nicht auf leeren Zwischenschritten.
- Begründung: Sie beziehen sich auf **diesen** abgeschlossenen Fall; in der Shell würden sie meist ins Leere zeigen.

*(PDF/Teilen können in v1 noch fehlen — dann Platzhalter weglassen, nicht global platzieren.)*

---

## 8. Detail-Ansicht (Karte antippen)

- Gleiches Overlay-Muster wie der Wizard: Vollbild, X, keine Tab-Leiste.
- Inhalt: Score, gebundene Arbeitszeit, Risiko, Steckbrief, ggf. Beispielrichtungen — **Lesen** (und optional Bearbeiten gespeicherter Fälle).
- Kein separater „vierter Tab" in der Shell.
- Schließen ohne ungespeicherte Änderungen → ohne Dialog; mit Änderungen → gleicher Bestätigungsdialog wie beim Wizard-Abbruch.

---

## 9. Mobile Tab-Leiste (Shell, wenn keine Schicht offen)

| Tab | v1 |
|---|---|
| **Aufgaben** | Liste + FAB „+ Aufgabe bewerten" |
| **Auswertung** | Gesperrt, antippbar → Erklärung (v2-Versprechen) |
| **Einstellungen** | Theme, ggf. Hinweise — kein Portfolio-Inhalt |

Desktop kann parallel die bestehende Kopf-Navigation nutzen; **dieselben Regeln** gelten für Wizard/Detail (keine Nav während Schicht).

---

## 10. Akzeptanzkriterien (v1 Mobile Navigation)

- [ ] Wizard und Detail öffnen als Vollbild-Schicht von unten; Tab-Leiste ist unsichtbar.
- [ ] Während Wizard/Detail ist keine andere App-Navigation erreichbar (inkl. Desktop-Header auf schmalen Viewports).
- [ ] X, Android-Zurück und iOS-Edge-Swipe lösen **denselben** Abbruchdialog aus (bei vorhandenem Inhalt).
- [ ] Footer „Zurück" im Wizard wechselt nur den Schritt — **ohne** Abbruchdialog.
- [ ] Leerer Wizard-Start: X ohne Dialog.
- [ ] Nach „Fertig" / Speichern: Rückkehr zur Aufgabenliste, neue Aufgabe kurz hervorgehoben.
- [ ] Tab „Auswertung" ist sichtbar, antippbar, zeigt Erklärung — kein toter/disabled Tab.
- [ ] PDF/Teilen nur am Ergebnis-Schritt (wenn implementiert), nicht global.

---

## 11. Was bewusst nicht in v1 ist

Siehe `klarsicht_v2_prd.md`:

- Zwischenspeicherung / Fortsetzen unterbrochener Bewertungen
- Befüllter Auswertung-Tab (Portfolio-Dashboard, Inkrement C)
- Tab-Wechsel während laufender Bewertung ohne Datenverlust
- Anpassung des Abbruch-Dialogs zu „Fortsetzen später?"
