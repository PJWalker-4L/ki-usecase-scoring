# KIST — Konzeptzusammenfassung

*Stand: 17. Juli 2026 — dieses Dokument ist die verbindliche Quelle der Wahrheit für die Weiterentwicklung des KI Use Case Scoring Tools (KIST).*

---

## 1. Das Problem

Mittelstandsteams sollen entscheiden, welche KI-Anwendungsfälle sie zuerst angehen — können aber allein keine vertrauenswürdige, vergleichbare Priorisierung erzeugen. Das Problem zerfällt in zwei Teile, die im aktuellen Prototyp miteinander verschmolzen sind:

**1.1 Fälle finden.** Der nicht-analytische Fachbereichsmitarbeiter steht vor einem leeren Namensfeld und weiß nicht, was überhaupt ein „Use Case" ist oder wie er einen benennt. Das bestehende Bewertungsraster setzt voraus, dass dieser Schritt schon an anderer Stelle passiert ist — er tut es aber nicht.

**1.2 Fälle bewerten.** Das Tool verlangt abstrakte Selbstnoten auf einer Skala (z. B. 1–5) für Kriterien wie „strategische Relevanz". Der Nutzer muss sein stilles Alltagswissen selbst in eine Note übersetzen — das ist die eigentliche Zumutung. Zwei Personen meinen mit „4" oft Verschiedenes; die Werte sind kaum vergleichbar und lassen sich leicht schönrechnen.

**Wurzelursache:** Das Tool lädt die analytische Übersetzungsleistung genau der Person auf, die sie am wenigsten mitbringt, und geht implizit davon aus, dass ein Moderator die Lücke füllt. In einem Werkzeug, das auch ohne Moderator laufen soll, liegt diese Lücke offen zutage.

**Warum bestehende Lösungen zu kurz greifen:**
- **Berater-Excel und generische Scoring-Frameworks** sind von Analytikern für Analytiker gebaut. Sie brauchen eine moderierende Hand, helfen nicht beim *Finden* der Fälle, und ihre Zahlen suggerieren eine Vergleichbarkeit, die real nicht besteht.
- **Papiervorlagen** (z. B. das KI.NRW-Use-Case-Template) bieten gute Leitfragen, sind aber statisch: kein Live-Ranking, kein Selbstbedienungsmodus, ohne Workshop kaum nutzbar.
- **Der bisherige KIST-Prototyp** sieht modern aus, fragt aber abstrakte Selbstnoten ab, hat das Leere-Seite-Problem und vermischt Finden und Bewerten in einem Schritt.
- **Bauchgefühl / informelle Priorisierung** führt zu fehlender Nachvollziehbarkeit und dazu, dass sich Priorität nach Hierarchie statt nach Substanz richtet.

**Warum das Problem zählt:**
- **Für das Unternehmen:** Ohne reibungsarme, glaubwürdige Priorisierung stockt die KI-Initiative (Analyse-Lähmung vor der leeren Seite) oder startet mit dem falschen Fall (lauteste Stimme statt bester Hebel). Beides verbrennt knappe Ressourcen und gefährdet das Momentum, das über die gesamte KI-Einführung entscheidet.
- **Für den Buy-in:** Bewerten die Fachleute nicht selbst und ehrlich, tragen sie die daraus resultierende Roadmap auch nicht mit — der eigentliche Zweck des Workshops verpufft.
- **Für den Berater (Sebastian):** Das Tool ist Kompetenznachweis. Liefert es nicht-vergleichbare, angreifbare Zahlen oder muss bei jeder Eingabe an die Hand genommen werden, scheitert es doppelt — als methodischer Beleg gegenüber Auftraggebern und als übergabefähiges Instrument, das beim Kunden bleiben kann.

---

## 2. Die Zielgruppe

Es gibt eine bewusste Zweiteilung zwischen wer das Tool mitbringt/besitzt und wer die Dateneingabe tatsächlich vornimmt. Diese Trennung ist zentral und darf nicht verwischt werden — der Komfort der einen Seite darf nicht die Verständlichkeit für die andere kosten.

**2.1 Zielkunde / Eigentümer: der KI-Berater im Mittelstand** (Archetyp: Sebastian selbst)
Bringt das Tool in Beratungsprojekte mit. Braucht ein Instrument, das sowohl im moderierten Workshop überzeugt als auch eigenständig beim Kunden funktioniert, wenn kein Moderator im Raum ist. Hat hohes methodisches Verständnis und erkennt sofort den Wert vergleichbarer, faktenbasierter Bewertungen.

**2.2 Kritischer Eingabe-Nutzer: der Fachbereichsleiter/-mitarbeiter im produzierenden Mittelstand** (z. B. Fertigung, Logistik, Auftragsabwicklung)
Kennt seinen Prozess im Detail, ist aber weder analytisch geschult noch KI-affin. Denkt konkret („das Sortieren frisst jeden Dienstag zwei Stunden"), nicht in abstrakten Kategorien wie „strategische Relevanz = 4". Hoher Leidensdruck bei repetitiven Prozessen, aber auf ein Werkzeug angewiesen, das ihn ohne Vorwissen durch die Bewertung führt.

**2.3 Weitere Rolle: die Führungskraft**
Legt den Adoption-Faktor separat im Vier-Augen-Gespräch fest (nicht im Fachbereichs-Workshop, da offene Ablehnung dort selten zugegeben wird). Konsumiert primär die fertige Prioritätenliste, bedient das Tool kaum selbst.

**2.4 Offener Punkt — noch nicht final entschieden:**
Möglicherweise wird es zwei Nutzerrollen in der Anwendung geben: einen Admin-Modus (z. B. für Sebastian) mit Zusatzfunktionen wie Datenexport, und einen eingeschränkteren Modus für reguläre Nutzer ohne diese Funktionen. Diese Rollentrennung ist als Idee festgehalten, aber noch nicht beschlossen und fließt erst bei der Umsetzung ein, wenn sie final entschieden ist.

---

## 3. Die Lösung

**Lösungsstatement:**
Ich baue ein geführtes Priorisierungs-Werkzeug, das KI-Berater und ihre Mittelstandskunden gemeinsam zu einer belastbaren, gemeinsam getragenen Reihenfolge ihrer KI-Anwendungsfälle bringt — indem es nach konkreten Alltagsfakten fragt statt nach abstrakten Noten und so den Moderator dort ersetzt, wo keiner im Raum ist.

**Der Kern des Werts:**
Der eigentliche Gewinn ist nicht die Punktzahl, sondern ein Gespräch mit klarem Ergebnis, das alle mittragen. Das Werkzeug fragt in der Sprache der Nutzer — „Wie oft macht ihr das? Wie lange dauert es? Liegen die Daten sauber vor?" — und leitet die Bewertung selbst daraus ab, statt eine abstrakte Selbstnote zu verlangen. So entsteht eine Reihenfolge, auf die sich das Team einigt, weil sie aus nachvollziehbaren Fakten kommt und nicht aus dem Bauchgefühl der lautesten Abteilung.

Für den Fachbereichsmitarbeiter heißt das: Er kann etwas beitragen, ohne KI zu verstehen oder sich analytisch verbiegen zu müssen. Für den Berater heißt es: ein Ergebnis, das vor erfahrenen Ansprechpartnern standhält und das er beim Kunden lassen kann, ohne dass es ohne ihn zusammenbricht.

**Warum der Ansatz die Mühe wert ist:**
Der entscheidende Unterschied zu bestehenden Lösungen ist eine bewusste Verlagerung: Nicht der Mensch übersetzt sein Wissen in eine Note, sondern das Werkzeug übersetzt seine Antworten in die Bewertung. Das macht Ergebnisse zwischen Personen und Abteilungen erst vergleichbar, senkt die Einstiegshürde für genau die Person, die den Prozess am besten kennt, und löst das Doppel-Modus-Problem an der Wurzel: Ein Werkzeug, das seine eigenen Fragen stellt und einordnet, funktioniert im moderierten Workshop und allein am Schreibtisch — weil die Führung im Werkzeug steckt, nicht im Moderator.

---

## Bereits identifizierte inhaltliche Bausteine (aus KI.NRW-Analyse) — priorisiert für v1 vs. v2

Diese Punkte wurden aus dem Dokument „KI.Schnellstart 2026" (KI.NRW) abgeleitet. Die Einstufung in **wichtig (v1)** und **sekundär (später)** ist verbindlich für die Umsetzungsreihenfolge — v1 soll nur die wichtigen Punkte enthalten.

### Wichtig — Teil von v1

- **Risiko-Tag (minimale Ausprägung).** Ein einzelnes Auswahlfeld „Risikoeinstufung" pro Anwendungsfall mit den Stufen *gering / überschaubar / hoch / inakzeptabel*, angelehnt an den risikobasierten Ansatz des AI Acts. Setzt bei „inakzeptabel" den Score automatisch auf null. **Kein** vollwertiges zusätzliches Scoring-Kriterium mit eigener 1–5-Skala — das wäre für v1 zu viel Zusatzkomplexität. Begründung: Ein hoch bewerteter Fall mit Rechts- oder Fehlerrisiko darf nicht allein wegen guter Machbarkeit oben im Ranking stehen; ohne dieses Feld ist das Tool im Mittelstand angreifbar.
- **Strukturierte Kurzbeschreibung pro Anwendungsfall** (drei Felder: Problem/Herausforderung, Lösungsansatz, Ziel/Ergebnis), angelehnt an das KI.NRW-Use-Case-Template. Begründung: Das ist der Punkt aus der Analyse, der am direktesten am Kernproblem „leere Seite beim nicht-analytischen Nutzer" ansetzt — er gibt Struktur, um den Fall zu beschreiben, bevor überhaupt bewertet wird. Passt exakt zum vereinbarten Lösungsansatz „führen statt abstrahieren lassen" (siehe Abschnitt 3).

### Sekundär — nach v1, nicht Teil des ersten Release

- **Wert-×-Machbarkeit-Matrix** als zweite Ansicht neben dem linearen Ranking (2×2-Quadranten-Darstellung, macht strategische Interpretation sichtbar, z. B. „Quick Win" vs. „komplexer Fall mit Potenzial"). Eigene Visualisierungslogik, löst aber nicht das Kernproblem — daher v1.1.
- **Kundennutzen-Kriterium** als viertes Wert-Kriterium (neben Zeitersparnis, Häufigkeit, strategische Relevanz). Inhaltlich sinnvoll (KI ist „nicht nur Reparaturbetrieb"), aber jedes zusätzliche Kriterium verlängert den neu zu bauenden „Fakten-statt-Noten"-Fragenkatalog. Erst nachlegen, wenn der Kernmechanismus sich bewährt hat.
- **Wiedervorlage statt Löschen** — Status-Feld plus Review-Termin für niedrig bewertete oder aktuell nicht machbare Fälle, statt sie zu entfernen. Reines Komfort-/Vollständigkeitsfeature, leicht nachrüstbar, kein Bezug zum Kernmechanismus.

### Explizit nicht v1 — abhängig von noch offener Grundsatzentscheidung

- **Divergenz-Anzeige im Workshop** (sichtbar machen, wenn z. B. zwei Abteilungen bei „Häufigkeit" auf 2 und 5 kommen). Diese Funktion setzt Mehrbenutzer-Fähigkeit voraus — mehrere Personen scoren live denselben Fall. Das ist an die in Abschnitt 2.4 genannte, noch nicht entschiedene Rollenfrage (Admin/Nutzer, Mehrbenutzer-Betrieb) gekoppelt. **Diese Funktion erst angehen, wenn die Rollenfrage entschieden ist** — nicht vorher isoliert bauen.

## Offene Fragen für die nächsten Schritte

- Konkrete Ausformulierung der „Fakten statt Noten"-Fragen pro Kriterium (Häufigkeit, Zeitersparnis, Datenverfügbarkeit, strategische Relevanz).
- Schärfung der zwei Personas (Berater und Fachbereichsleiter) im Detail.
- Endgültige Entscheidung zur Admin-/Nutzer-Rollentrennung.
