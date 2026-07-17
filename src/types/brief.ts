export type RisikoId = "gering" | "ueberschaubar" | "hoch" | "inakzeptabel";

export type FallBrief = {
  problem: string;
  loesung: string;
  ziel: string;
  risiko: "" | RisikoId;
};

export const EMPTY_BRIEF: FallBrief = {
  problem: "",
  loesung: "",
  ziel: "",
  risiko: "",
};

export const RISIKO_OPTIONS = [
  {
    id: "gering" as RisikoId,
    label: "Gering",
    activeClass: "border-emerald-700 bg-emerald-700 text-white",
    inactiveClass: "border-emerald-300 text-emerald-700 hover:border-emerald-500 dark:border-emerald-800 dark:text-emerald-400 dark:hover:border-emerald-600",
  },
  {
    id: "ueberschaubar" as RisikoId,
    label: "Überschaubar",
    activeClass: "border-amber-500 bg-amber-500 text-white",
    inactiveClass: "border-amber-300 text-amber-700 hover:border-amber-500 dark:border-amber-800 dark:text-amber-400 dark:hover:border-amber-600",
  },
  {
    id: "hoch" as RisikoId,
    label: "Hoch",
    activeClass: "border-orange-600 bg-orange-600 text-white",
    inactiveClass: "border-orange-300 text-orange-700 hover:border-orange-500 dark:border-orange-800 dark:text-orange-400 dark:hover:border-orange-600",
  },
  {
    id: "inakzeptabel" as RisikoId,
    label: "Inakzeptabel",
    activeClass: "border-red-700 bg-red-700 text-white",
    inactiveClass: "border-red-300 text-red-700 hover:border-red-500 dark:border-red-800 dark:text-red-400 dark:hover:border-red-600",
  },
] as const;

export const RISIKO_BADGE: Record<RisikoId, string> = {
  gering:        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  ueberschaubar: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  hoch:          "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800",
  inakzeptabel:  "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
};
