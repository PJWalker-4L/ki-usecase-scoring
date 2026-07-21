import type { ArchetypId } from "@/lib/archetypes";
import type { AutomatisierungstypId } from "@/lib/automatisierungstyp";
import type { Answers } from "@/lib/scoring";
import type { RisikoId } from "@/types/brief";

export type RisikoVorschlag = {
  stufe: RisikoId;
  begruendung: string;
};

export type Beispielrichtung = {
  text: string;
  typ: AutomatisierungstypId;
};

export type InitialClassificationResult = {
  archetypId: ArchetypId;
  risikoVorschlag: RisikoVorschlag;
};

export type ClassificationResult = InitialClassificationResult & {
  beispielrichtungen: Beispielrichtung[];
  fallstricke: string[];
};

export type ClassifyInitialRequest = {
  phase: "initial";
  ablauf: string;
  ziel: string;
  loesung?: string;
};

export type ClassifyBeispieleRequest = {
  phase: "beispiele";
  ablauf: string;
  ziel: string;
  loesung?: string;
  archetypId: ArchetypId;
  risiko: RisikoId;
  answers: Answers;
};

export type ClassifyRequest = ClassifyInitialRequest | ClassifyBeispieleRequest;
