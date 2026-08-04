import { describe, expect, it } from "vitest";
import { computeScores, formatGebundeneArbeitszeit } from "@/lib/scoring";

/** Vollständiger Antwortsatz für Regression (Spec §6). */
const STANDARD_ANSWERS = {
  haeufigkeit: "mehrmals-woche",
  zeitaufwand: "30",
  personen: "2-3",
  auswirkung: "kunden-lieferanten",
  daten: "digital-strukturiert",
  standard: "meist-gleich",
} as const;

describe("formatGebundeneArbeitszeit", () => {
  it("formatiert Standardfall mit ca. und ganzen Stunden", () => {
    expect(formatGebundeneArbeitszeit(37.4)).toBe("ca. 37 Std./Monat");
  });

  it("gibt unter 1 Std./Monat für Kleinstwerte aus", () => {
    expect(formatGebundeneArbeitszeit(0.025)).toBe("unter 1 Std./Monat");
    expect(formatGebundeneArbeitszeit(0.99)).toBe("unter 1 Std./Monat");
  });

  it("rundet Großfall ohne Nachkommastellen", () => {
    expect(formatGebundeneArbeitszeit(2399.6)).toBe("ca. 2400 Std./Monat");
  });
});

describe("computeScores — hoursPerMonth", () => {
  it("berechnet Kleinstfall unter 1 Std./Monat", () => {
    const { hoursPerMonth } = computeScores({
      haeufigkeit: "seltener",
      zeitaufwand: "5",
      personen: "1",
    });
    expect(hoursPerMonth).not.toBeNull();
    expect(hoursPerMonth!).toBeLessThan(1);
    expect(formatGebundeneArbeitszeit(hoursPerMonth!)).toBe(
      "unter 1 Std./Monat"
    );
  });

  it("berechnet Standardfall mit plausibler Std./Monat", () => {
    const { hoursPerMonth } = computeScores({
      haeufigkeit: "mehrmals-woche",
      zeitaufwand: "30",
      personen: "2-3",
    });
    expect(hoursPerMonth).toBe(15);
    expect(formatGebundeneArbeitszeit(hoursPerMonth!)).toBe(
      "ca. 15 Std./Monat"
    );
  });

  it("berechnet Großfall hoch und gerundet", () => {
    const { hoursPerMonth } = computeScores({
      haeufigkeit: "mehrmals-taeglich",
      zeitaufwand: "240",
      personen: "10+",
    });
    expect(hoursPerMonth).toBe(2400);
    expect(formatGebundeneArbeitszeit(hoursPerMonth!)).toMatch(/^ca\. \d+ Std\./);
  });

  it("aktualisiert hoursPerMonth bei geänderter Häufigkeit", () => {
    const before = computeScores(STANDARD_ANSWERS);
    const after = computeScores({
      ...STANDARD_ANSWERS,
      haeufigkeit: "taeglich",
    });
    expect(before.hoursPerMonth).toBe(15);
    expect(after.hoursPerMonth).toBe(25);
  });

  it("hält gesamtScore für Referenz-Antworten stabil (Regression)", () => {
    const { gesamtScore } = computeScores(STANDARD_ANSWERS);
    expect(gesamtScore).toBe(63);
  });
});
