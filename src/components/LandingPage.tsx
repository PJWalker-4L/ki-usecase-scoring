import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  ListOrdered,
  MessageSquareText,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SectionIcon,
  SectionLabel,
  SurfaceCard,
} from "@/components/shared";
import RobotMascot from "@/components/RobotMascot";

const VALUE_PROPS = [
  {
    icon: Clock,
    title: "Aufgaben erkennen",
    description:
      "Aufwändige, wiederkehrende Aufgaben erkennen, bei denen KI wirklich hilft.",
  },
  {
    icon: BarChart3,
    title: "Faktenbasiert einschätzen",
    description: "Wert und Machbarkeit jedes Falls faktenbasiert einschätzen.",
  },
  {
    icon: ListOrdered,
    title: "Klare Reihenfolge",
    description: "Eine klare Reihenfolge bekommen, die das ganze Team mitträgt.",
  },
  {
    icon: CheckCircle2,
    title: "Nachvollziehbar entscheiden",
    description:
      "Nachvollziehbar entscheiden — statt nach Bauchgefühl oder Hierarchie.",
  },
] as const;

const STEPS = [
  {
    icon: MessageSquareText,
    step: "1",
    title: "Fragen beantworten",
    description:
      "Konkrete Angaben zu Häufigkeit, Aufwand, Daten und Ablauf — in Alltagssprache.",
  },
  {
    icon: Sparkles,
    step: "2",
    title: "Scores erhalten",
    description:
      "Nutzen- und Machbarkeits-Score plus eine Einordnung für Ihren Anwendungsfall.",
  },
  {
    icon: Trophy,
    step: "3",
    title: "Vergleichen & entscheiden",
    description: "Fälle speichern und in der Rangliste priorisieren.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <main className="flex-1 bg-background">
        <section className="relative mx-auto w-full max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <SectionLabel>KI-Anwendungsfälle priorisieren</SectionLabel>

          <div className="relative mx-auto mt-4 max-w-2xl sm:mt-6">
            <RobotMascot
              size="inline"
              className="mx-auto mb-2 sm:absolute sm:top-1/2 sm:right-full sm:mb-0 sm:mr-1 sm:-translate-y-1/2 sm:translate-x-1 md:mr-1.5 md:translate-x-1.5 lg:mr-2 lg:translate-x-2"
            />
            <h1 className="flex flex-col items-center gap-3 text-center text-2xl font-semibold sm:text-4xl lg:text-5xl">
              <span className="text-primary">
                Welchen KI-Anwendungsfall zuerst angehen?
              </span>
              <span>
                Finden Sie es in wenigen Minuten heraus — mit einfachen Fragen
                zu Ihrem Arbeitsalltag.
              </span>
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Klarsicht fragt nach Häufigkeit, Aufwand und Datenlage Ihrer Aufgaben
            — und leitet daraus eine vergleichbare, nachvollziehbare Reihenfolge
            Ihrer <span className="whitespace-nowrap">KI-Vorhaben</span> ab.
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/scorer">
                Bewertung starten
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link href="/faelle">Gespeicherte Fälle</Link>
            </Button>
          </div>
        </section>

        <section className="border-t border-border bg-background">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Fakten statt Bauchgefühl
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Klarsicht übersetzt Ihre Antworten in eine belastbare Priorität —
                ohne abstrakte Noten und ohne Moderator.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {VALUE_PROPS.map(({ icon, title, description }) => (
                <SurfaceCard
                  key={title}
                  contentClassName="flex gap-4 p-5 sm:p-6"
                >
                  <SectionIcon icon={icon} />
                  <div className="min-w-0 text-left">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-background">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">
              So funktioniert&apos;s
            </h2>

            <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STEPS.map(({ icon, step, title, description }) => (
                <li key={step}>
                  <SurfaceCard contentClassName="px-6 py-7 text-center">
                    <SectionIcon icon={icon} size="lg" className="mx-auto" />
                    <SectionLabel className="mt-4">Schritt {step}</SectionLabel>
                    <h3 className="mt-2 text-base font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </SurfaceCard>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex justify-center">
              <Button asChild size="lg" className="h-12 w-full px-8 sm:w-auto">
                <Link href="/scorer">
                  Jetzt starten
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-5xl px-5 py-6 text-center sm:px-8">
          <p className="text-xs text-muted-foreground">
            Klarsicht — Priorisierung von KI-Anwendungsfällen mit konkreten
            Fakten.
          </p>
        </div>
      </footer>
    </div>
  );
}
