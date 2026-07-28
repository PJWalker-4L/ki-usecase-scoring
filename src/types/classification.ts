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

/** Index verweist auf beispielrichtungen[index] (0-basiert). */
export type AutomatisierungsEmpfehlung = {
  index: number;
  begruendung: string;
};

export type InitialClassificationResult = {
  archetypId: ArchetypId;
  risikoVorschlag: RisikoVorschlag;
};

export type ClassificationResult = InitialClassificationResult & {
  beispielrichtungen: Beispielrichtung[];
  fallstricke: string[];
  empfehlung?: AutomatisierungsEmpfehlung;
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
