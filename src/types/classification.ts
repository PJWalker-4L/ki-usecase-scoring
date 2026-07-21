import type { ArchetypId } from "@/lib/archetypes";
import type { RisikoId } from "@/types/brief";

export type RisikoVorschlag = {
  stufe: RisikoId;
  begruendung: string;
};

export type ClassificationResult = {
  archetypId: ArchetypId;
  beispielrichtungen: string[];
  fallstricke: string[];
  risikoVorschlag: RisikoVorschlag;
};

export type ClassifyRequest = {
  ablauf: string;
  ziel: string;
  loesung?: string;
};
