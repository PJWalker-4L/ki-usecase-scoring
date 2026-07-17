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
import { Card, CardContent } from "@/components/ui/card";

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
    description: "Nachvollziehbar entscheiden — statt nach Bauchgefühl oder Hierarchie.",
  },
] as const;

const STEPS = [
  {
    icon: MessageSquareText,
    step: "1",
    title: "Fragen beantworten",
    description: "Konkrete Angaben zu Häufigkeit, Aufwand, Daten und Ablauf — in Alltagssprache.",
  },
  {
    icon: Sparkles,
    step: "2",
    title: "Scores erhalten",
    description: "Nutzen- und Machbarkeits-Score plus eine Einordnung für Ihren Anwendungsfall.",
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
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Klarsicht
          </Link>
          <Link
            href="/faelle"
            className="text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Gespeicherte Fälle
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            KI-Anwendungsfälle priorisieren
          </p>
          <h1 className="mt-4 flex flex-col gap-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
            <span>Welchen KI-Anwendungsfall zuerst angehen?</span>
            <span>
              Finden Sie es in wenigen Minuten heraus — mit einfachen Fragen zu Ihrem
              Arbeitsalltag.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-400">
            Statt abstrakter Selbstnoten fragt Klarsicht nach konkreten Fakten — und
            leitet daraus eine vergleichbare, nachvollziehbare Reihenfolge Ihrer
            KI-Vorhaben ab.
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild size="lg" className="h-11 rounded-xl px-6 text-base">
              <Link href="/scorer">
                Bewertung starten
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 rounded-xl px-6 text-base"
            >
              <Link href="/faelle">Gespeicherte Fälle</Link>
            </Button>
          </div>
        </section>

        {/* Value props */}
        <section className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                Fakten statt Bauchgefühl
              </h2>
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Klarsicht übersetzt Ihre Antworten in eine belastbare Priorität — ohne
                abstrakte Noten und ohne Moderator.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
                <Card
                  key={title}
                  className="rounded-2xl border-zinc-200 bg-zinc-50 py-0 shadow-none dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              So funktioniert&apos;s
            </h2>

            <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STEPS.map(({ icon: Icon, step, title, description }) => (
                <li key={step} className="text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Schritt {step}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {description}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex justify-center">
              <Button asChild size="lg" className="h-11 w-full rounded-xl px-6 text-base sm:w-auto">
                <Link href="/scorer">
                  Jetzt starten
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-5xl px-5 py-6 text-center sm:px-8">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Klarsicht — Priorisierung von KI-Anwendungsfällen mit konkreten Fakten.
          </p>
        </div>
      </footer>
    </div>
  );
}
