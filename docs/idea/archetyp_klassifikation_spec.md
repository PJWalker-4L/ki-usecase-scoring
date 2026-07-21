# Prozess-Archetypen — Backend-Klassifikation für Klarsicht v2

*Ersetzt/aktualisiert `ki_archetypen.md`. Zentrale Korrektur gegenüber der Vorversion: Die Archetyp-Klassifikation ist ein **reiner Backend-Mechanismus**, kein User-facing Feature. Der Nutzer sieht niemals ein Archetyp-Label und bestätigt es auch nicht.*

---

## 1. Zweck der Funktion (was der Nutzer eigentlich will)

Der Nutzer beschreibt einen Arbeitsprozess (Problem / Lösungsansatz / Ziel — die v1-Kurzbeschreibung). Die Funktion soll ihm daraufhin **konkrete, plausible Beispielrichtungen zeigen, wie sich dieser Prozess typischerweise automatisieren lässt** — inklusive der typischen Fallstricke und, wo relevant, eines Risikohinweises.

Das ist der Zweck. Alles andere in diesem Dokument ist Mittel zu diesem Zweck.

---

## 2. Warum nicht einfach frei generieren lassen

Ein LLM, das ohne Leitplanken gefragt wird „wie automatisiere ich das?", neigt zu genau den Fehlern, die in einem Beratungstool nicht passieren dürfen: erfundene Lösungswege, unterschlagene Voraussetzungen, überzogene Versprechen, unpassende Risikoeinschätzung.

**Die Lösung:** Der beschriebene Prozess wird zuerst einem von 7 bekannten, wiederkehrenden Automatisierungs-Mustern (Archetypen) zugeordnet. Zu jedem Archetyp existiert vorab kuratiertes, geprüftes Wissen (typische Prozesse, Voraussetzungen, Nutzen, Fallstricke, Risikoprofil). Die Ausgabe an den Nutzer wird aus diesem kuratierten Material erzeugt statt komplett frei generiert.

Klassifikation in ein bekanntes Muster ist für ein LLM eine verlässliche, fehlerarme Aufgabe — freie Lösungsgenerierung ist es nicht. Die Archetypen sind der Guardrail, der die Vorschläge erdet.

---

## 3. Zentrale Korrektur gegenüber der Vorversion dieses Dokuments

**Frühere Annahme (verworfen):** Der Nutzer sieht nach der Kurzbeschreibung ein Panel mit dem zugeordneten Archetyp-Label, das er bestätigen oder korrigieren muss, bevor es weitergeht.

**Warum das falsch war:**

- **Widerspricht dem Kernprinzip des Tools.** Klarsicht fragt bewusst nach konkreten Alltagsfakten statt nach abstrakten Kategorien, um dem nicht-analytischen Nutzer die analytische Übersetzungsleistung abzunehmen (siehe `usecasescoring_concept.md`, Abschnitt 3). Ein Archetyp-Label wie „Extraktion" oder „Abgleich/Matching" ist exakt so eine abstrakte Kategorie. Sie dem Nutzer zur Bestätigung vorzulegen, führt die Abstraktion durch die Hintertür wieder ein, die das Tool eigentlich vermeiden soll.
- **Der Nutzer kann das Label gar nicht sinnvoll korrigieren.** Er kennt die Taxonomie nicht und hat kein Bezugssystem, um „Klassifikation" von „Transformation" zu unterscheiden. Ein Urteil, das der Nutzer nicht fällen kann, sollte ihm auch nicht abverlangt werden.
- **Korrektur funktioniert über den Output, nicht über das Label.** Wenn die Klassifikation danebenliegt, merkt der Nutzer das daran, dass die angezeigten Beispielrichtungen nicht zu seinem Prozess passen — das ist ein konkretes, für ihn fällbares Urteil. Ein Feedback-Mechanismus auf Ebene der Vorschläge („trifft das zu?") ersetzt die Label-Bestätigung vollständig und ist zugleich fakten- statt kategorienbasiert.
- **Das Scoring-Seeding rechtfertigt kein Sichtbarmachen.** Der Archetyp kann weiterhin Scoring-Werte und Risikostufe vorbelegen (siehe Abschnitt 6) — das passiert aber vollständig im Backend. Der Nutzer bestätigt am Ende ohnehin die konkreten Scoring-Fakten (Häufigkeit, Zeitersparnis, Datenlage) und die Risikostufe, nicht das abstrakte Zwischenergebnis.

---

## 4. Wo die Funktion im Produkt-Flow sitzt

```
Fall beschreiben (Problem / Lösungsansatz / Ziel)
        │
        ▼
[BACKEND, unsichtbar] Archetyp-Klassifikation
        │  → liefert: dominanten Archetyp (+ ggf. Nebenarchetypen),
        │     vorbelegte Scoring-Hinweise, vorbelegte Risikostufe
        ▼
Beispielrichtungen + Fallstricke anzeigen
   (aus dem kuratierten Archetyp-Material generiert,
    im Konjunktiv, siehe Framing-Regel Abschnitt 7)
        │
        ▼
Scoring („Fakten statt Noten") — Werte sind vorbelegt,
   Nutzer beantwortet die konkreten Fragen selbst
        │
        ▼
Risiko-Tag — Vorschlag aus Archetyp, Nutzer bestätigt/ändert
   die Risikostufe selbst (nicht den Archetyp)
        │
        ▼
Ranking
```

**Wichtig:** Der einzige Bestätigungsschritt im gesamten Flow betrifft die *konkreten Scoring- und Risikofakten* — nicht den Archetyp. Der Archetyp taucht in der UI an keiner Stelle als benanntes Label auf.

---

## 5. Die 7 Archetypen (Referenzdaten fürs Backend)

Diese Beschreibungen sind das kuratierte Material, aus dem die Beispielrichtungen und Fallstricke generiert werden. Sie sind Prompt-/Datengrundlage, kein UI-Text.

### 5.1 Klassifikation / Triage
**Was:** Eingehende Objekte einsortieren, priorisieren, weiterleiten.
**Typische Prozesse:** E-Mail-Routing, Ticket-Kategorisierung, Beschwerde-Weiterleitung, Bewerbungs-Vorsortierung, Eingangspost-Verteilung.
**Voraussetzungen:** Klar definierte Kategorien; genug Beispiele; ein Anschluss-System.
**Nutzen:** Hoch bei großen Mengen gleichartiger Eingänge. Einer der zuverlässigsten Archetypen.
**Fallstricke:** Grenzfälle/neue Kategorien werden falsch einsortiert; braucht Eskalationspfad.
**Scoring-Hinweise:** Meist hohe Machbarkeit und Datenverfügbarkeit; Risiko moderat.

### 5.2 Extraktion
**Was:** Strukturierte Daten aus unstrukturierten Dokumenten herausziehen.
**Typische Prozesse:** Rechnungsdaten, Vertragsklauseln, Formulare, Stammdaten aus E-Mails, Lieferscheine.
**Voraussetzungen:** Definierte Zielfelder; lesbare Quelldokumente (ggf. OCR); Zielsystem.
**Nutzen:** Sehr hoch bei repetitiver, fehleranfälliger Datenerfassung — klassischer Quick Win.
**Fallstricke:** Uneinheitliche Formate senken Trefferquote; kritische Felder brauchen Prüfschritt.
**Scoring-Hinweise:** Hohe Häufigkeit typisch; Machbarkeit hängt an Dokumentqualität; Risiko steigt mit Kritikalität der Felder.

### 5.3 Zusammenfassung
**Was:** Lange Inhalte auf das Wesentliche verdichten.
**Typische Prozesse:** Meeting-Protokolle, E-Mail-Verläufe, Berichte/Studien, Gesprächsnotizen.
**Voraussetzungen:** Zugang zum Ausgangsmaterial; Klarheit über das Ziel der Zusammenfassung.
**Nutzen:** Solide Zeitersparnis, niedrige Einstiegshürde, geringes Risiko — guter erster sichtbarer Erfolg.
**Fallstricke:** Weglassen relevanter Nuancen; Vertraulichkeit bei sensiblen Inhalten.
**Scoring-Hinweise:** Meist hohe Machbarkeit, niedriges Risiko, oft nur mittlerer strategischer Hebel.

### 5.4 Entwurf / Generierung
**Was:** Erste Textentwürfe, die ein Mensch prüft und finalisiert.
**Typische Prozesse:** Antwortentwürfe Kundenservice, Angebots-/Anschreiben-Vorlagen, Produktbeschreibungen, Stellenanzeigen, Social-Media-Texte.
**Voraussetzungen:** Kontext/Vorgaben (Tonalität, Fakten); fester Freigabeschritt durch Menschen.
**Nutzen:** Beschleunigt den Start; wirksam bei vielen ähnlichen Texten.
**Fallstricke:** Höchstes Halluzinationsrisiko des Sets; ohne Freigabe nicht einsetzbar, wenn Text nach außen geht.
**Scoring-Hinweise:** Machbarkeit hoch, Risiko systematisch erhöht (externe Wirkung) — Risiko-Tag hier besonders relevant.

### 5.5 Wissensabruf / RAG
**Was:** Fragen auf Basis eines definierten Dokumentenbestands beantworten, mit Beleg.
**Typische Prozesse:** Interner Wissensassistent, Onboarding-Fragen, technischer Support aus Doku, Nachschlagen in Verträgen/Normen.
**Voraussetzungen:** Gepflegter, zugänglicher, aktueller Dokumentenbestand — die wichtigste, oft unterschätzte Bedingung.
**Nutzen:** Hoch, wenn Wissen verstreut/schwer auffindbar ist.
**Fallstricke:** Höherer Bauaufwand (Aufbereitung, Indexierung, Pflege); veraltete Quellen → falsche Antworten.
**Scoring-Hinweise:** Oft hoher strategischer Wert, aber niedrigere technische Einfachheit — typischer „komplexer Fall mit Potenzial".

### 5.6 Transformation
**Was:** Inhalte von einem Format/Stil in ein anderes überführen — Bedeutung bleibt, Form ändert sich.
**Typische Prozesse:** Übersetzung, Umschreiben in einfache Sprache, Fachtext → Kundentext, Vorlagenformat, Tonalitätsanpassung.
**Voraussetzungen:** Klare Regeln für Ziel-Format/-Stil; verarbeitbares Ausgangsmaterial.
**Nutzen:** Zuverlässig, risikoarm, gut skalierbar bei wiederkehrenden Formatwechseln.
**Fallstricke:** Bei Fachsprache (Recht, Medizin, Technik) für Laien unsichtbare Bedeutungsfehler möglich.
**Scoring-Hinweise:** Meist hohe Machbarkeit, geringes bis mittleres Risiko, abhängig von Fachlichkeit.

### 5.7 Abgleich / Empfehlung (Matching)
**Was:** Objekte einander zuordnen oder die passendste Option vorschlagen.
**Typische Prozesse:** Bewerber-Matching, Produktempfehlungen, Ansprechpartner-/Experten-Suche, ähnliche Fälle/Dokumente, Lieferanten-Vorauswahl.
**Voraussetzungen:** Zwei klar beschriebene Seiten; definierte Passungs-Kriterien; ausreichende Datenbasis beidseitig.
**Nutzen:** Hoch, wenn manuelles Zuordnen aufwändig ist und Kriterien beschreibbar sind.
**Fallstricke:** Bias-Risiko, besonders bei Personenbezug (AI-Act-relevant); Erklärbarkeit oft schwierig. Ergebnis als Vorschlag, nicht Entscheidung behandeln.
**Scoring-Hinweise:** Machbarkeit mittel; Risiko potenziell hoch bei Personenbezug — Risiko-Tag kann hier bis „inakzeptabel" reichen (Hochrisiko-Bereiche wie Personalauswahl).

---

## 6. Backend-Verarbeitung — was die Funktion konkret tun soll

1. **Input:** die drei Kurzbeschreibungsfelder (Problem/Herausforderung, Lösungsansatz, Ziel/Ergebnis).
2. **Klassifikation:** LLM-Call ordnet den Prozess einem dominanten Archetyp zu (Mehrfachzuordnung zulassen — viele reale Prozesse kombinieren Muster, z. B. Extraktion → Klassifikation → Entwurf; einen dominanten benennen, Nebenarchetypen optional mitführen).
3. **Vorschlagsgenerierung:** Auf Basis des zugeordneten Archetyps generiert das LLM 2–4 konkrete Beispielrichtungen für den beschriebenen Prozess, gestützt auf die kuratierten „Typische Prozesse"/„Nutzen"-Angaben des Archetyps — nicht frei erfunden.
4. **Fallstricke-Ausgabe:** Die kuratierten Fallstricke des Archetyps werden auf den konkreten Fall zugeschnitten ausgegeben.
5. **Scoring-Vorbelegung:** Die „Scoring-Hinweise" des Archetyps liefern Startwerte für die nachfolgenden Fakten-Fragen (z. B. „Machbarkeit meist hoch" → Vorauswahl, die der Nutzer über seine konkreten Antworten ohnehin überschreibt).
6. **Risiko-Vorschlag:** Das Risikoprofil des Archetyps liefert einen Vorschlag für die Risikostufe (gering/überschaubar/hoch/inakzeptabel), den der Nutzer im Risiko-Tag-Feld bestätigt oder ändert.
7. **Kein Punkt in diesem Ablauf zeigt dem Nutzer den Archetyp-Namen als Label.**

---

## 7. Framing-Regel für die sichtbaren Ausgaben (verbindlich)

Was der Nutzer sieht — Beispielrichtungen und Fallstricke — wird nie als Autoritätsaussage formuliert, sondern im Konjunktiv/Beispielmodus:

> „So könnte KI einen Prozess wie diesen typischerweise unterstützen: …"

Nie: „So automatisierst du diesen Prozess." Das Tool ordnet ein und zeigt Beispielrichtungen — es erfindet keine „fertige Ein-Klick-Lösung".

**Human-in-the-loop als Standardhinweis:** Bei Archetypen mit Außenwirkung (Entwurf, Matching) gehört der Hinweis auf einen menschlichen Freigabeschritt in jede Beispielrichtung — zugleich ein zentrales DSGVO-/AI-Act-Argument für den Mittelstand.

---

## 8. Optionaler UI-Rest (nice-to-have, kein Pflichtbestandteil)

Zwei mögliche, rein optionale Ausbaustufen — keine davon ist Voraussetzung für v2, beide können auch ganz entfallen:

- **Transparenz-Detail:** ein freiwillig aufklappbares „Warum dieser Vorschlag?" für Nutzer, die es genauer wissen wollen. Zeigt ggf. den Archetyp-Namen als Erklärung, nicht als Abfrage.
- **Berater-/Admin-Sicht:** Für den Berater (Sebastian) als methodisches Signal sichtbar machen, dass das Tool in etablierten Automatisierungsmustern denkt — als Detail-Layer, nicht im Kern-Loop des Fachbereichsnutzers.

---

## 9. Roadmap-Einordnung

Nicht Teil von v1. Der Kern (Fälle finden, „Fakten statt Noten", Scoring, Ranking) muss zuerst stehen und sich bewähren. Diese Funktion ist ein Differenzierer für **v2**, ausschließlich in der hier beschriebenen Backend-Form.

**Vor dem Bau offen (per Test zu klären):** Ob die generierten Beispielrichtungen bei echten Nutzern als hilfreiche Anregung ankommen oder zu generisch/unpassend wirken — das ist jetzt der eigentliche Risikopunkt, nicht mehr die Frage nach Bevormundung durch ein Label (die durch den Verzicht auf das Label entfällt).
