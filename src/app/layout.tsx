import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Space_Grotesk } from "next/font/google";
import ConditionalNavBar from "@/components/ConditionalNavBar";
import ThemeScript from "@/components/ThemeScript";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Klarsicht — KI-Anwendungsfälle priorisieren",
  description:
    "Welchen KI-Anwendungsfall zuerst angehen? Klarsicht fragt nach konkreten Fakten statt abstrakter Selbstnoten — und leitet eine nachvollziehbare Reihenfolge ab.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${spaceGrotesk.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeScript />
        <ConditionalNavBar />
        {children}
      </body>
    </html>
  );
}
