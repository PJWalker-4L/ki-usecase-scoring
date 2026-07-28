---
version: alpha
name: KLARSICHT-design-system
description: >
  B2B-SaaS für AI-Use-Case-Scoring im Mittelstand. Struktur inspiriert von
  großzügigen Marketplace-Systemen (Airbnb-Patterns via getdesign.md): weiche
  Radii, klare Kartenhierarchie, ein dominanter Primary. Farben aus dem
  KLARSICHT-Mesh-Gradient (Lavender Primary, Coral Warm-Akzent) — nicht Airbnb
  Rausch. Typo Space Grotesk + Inter. Light/Dark via tokens.css.

colors:
  primary: "#5868F7"
  primary-active: "#4757E6"
  primary-subtle: "#EEF0FF"
  primary-warm: "#FC624B"
  primary-warm-active: "#E8553D"
  primary-warm-subtle: "#FFF0ED"
  brand-pink: "#F76DEE"
  brand-magenta: "#B717AF"
  brand-deep: "#1A1A5E"
  ink: "#14202E"
  body: "#14202E"
  muted: "#5B6B75"
  muted-soft: "#A8A3BC"
  hairline: "#E4E2EE"
  hairline-soft: "#F7F6FB"
  border-strong: "#C1C1C1"
  canvas: "#ffffff"
  surface-soft: "#F7F6FB"
  surface-card: "#ffffff"
  surface-strong: "#EDE9FE"
  on-primary: "#ffffff"
  on-dark: "#ECEAF4"
  score-high: "#2F7D53"
  score-high-bg: "#C9E4D3"
  score-mid: "#5B4BD4"
  score-mid-bg: "#EDE9FE"
  score-low: "#C94530"
  score-low-bg: "#FCE8E4"
  score-accent: "#D94A32"
  score-accent-bg: "#FFF0ED"
  primary-error-text: "#C94530"
  primary-error-text-hover: "#B23B3B"
  scrim: "#0E0C18"

typography:
  display-xl:
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-lg:
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-md:
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-sm:
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.02em
  title-md:
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  title-sm:
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  rating-display:
    fontFamily: "'Space Grotesk', system-ui, sans-serif"
    fontSize: 4rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-md:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0
  caption-sm:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.23
    letterSpacing: 0
  badge:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 0.6875rem
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: 0
  micro-label:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: 0
  uppercase-tag:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.06em
    textTransform: uppercase
  button-md:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0
  button-sm:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.29
    letterSpacing: 0
  link:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  nav-link:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 14px 24px
    height: 48px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-primary-disabled:
    backgroundColor: "{colors.primary-disabled}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: 13px 23px
    height: 48px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
  button-pill-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 10px 20px
  search-orb:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    height: 48px
  icon-button-circle:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 32px
  icon-button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 40px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 80px
  product-tab-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
  product-tab-inactive:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.nav-link}"
  search-bar-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: 14px 24px
    height: 64px
  search-field-segment:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    padding: 8px 24px
  category-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.button-sm}"
  category-tab-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.none}"
  property-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
  property-card-photo:
    rounded: "{rounded.md}"
  experience-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.md}"
  city-link-block:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.title-sm}"
  rating-display-card:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.rating-display}"
  guest-favorite-badge:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  new-tag:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.uppercase-tag}"
    rounded: "{rounded.full}"
    padding: 2px 6px
  amenity-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 12px 0
  reviews-card:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  host-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 24px
  reservation-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 24px
  date-picker-day:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
  date-picker-day-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px 12px
    height: 56px
  footer-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: 48px 80px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  legal-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.caption-sm}"
---

## Overview

> **KLARSICHT-Anpassung:** Diese Datei stammt von [getdesign.md/airbnb](https://getdesign.md/airbnb/design-md) und wurde für KLARSICHT umgeschrieben. **Primary = Lavender `#5868F7`**, nicht Airbnb Rausch. **Coral `#FC624B`** nur als Warm-Akzent (Nebenbei-Einordnung, Mesh-CTA). Implementierung in `tokens.css` + `src/app/globals.css`. Mesh-Gradient nur für Splash/Hero (`mesh-gradient-shader.tsx`).

KLARSICHT nutzt die **Struktur** großzügiger Marketplace-UIs: weiche Radii, klare Karten auf `--color-bg-subtle`, ein dominanter Primary für CTAs, dezente Elevation. Die Basisfläche ist **weiß** (`{colors.canvas}`) mit Tinten-Anthrazit (`{colors.ink}` — #14202E). Der Marken-Primary **Lavender** (`{colors.primary}` — #5868F7) trägt Haupt-CTAs, Fokus-Ringe und Empfehlungs-Boxen. **Coral** (`{colors.primary-warm}` — #FC624B) erscheint sparsam für warme Einordnungen und Morph-Buttons — nicht als Ersatz für Primary.

Typo: **Space Grotesk** (Headlines) + **Inter** (Body/UI), Tabellenziffern für Scores. Dark Mode über `[data-theme="dark"]` mit Deep-Purple-Basis (`#0E0C18`).

**Key Characteristics (KLARSICHT):**
- **Primary Lavender** (`{colors.primary}`) für CTAs, Links, Fokus — ein Voltage, sparsam eingesetzt.
- **Warm Coral** (`{colors.primary-warm}`) für „Nebenbei-Verbesserung“ und Mesh-CTAs — nie für Hauptnavigation.
- **Score-Skala** semantisch: Grün (Quick Win) / Lavender (Strategisch) / Coral-Rot (Zurückstellen) — kein Amber/Gold.
- **Weiche Formen:** `{rounded.lg}` (16px) Karten, `{rounded.xl}` (24px) hervorgehobene Boxen, `{rounded.full}` Pills.
- **Mesh-Gradient** nur dekorativ (Intro, Splash) — Flächen-UI bleibt token-basiert.
- **Rangliste:** Farbige Score-Kante links, Fortschrittsbalken, Karten auf `surface-soft`.

### Referenz (Airbnb-Ursprung, nicht 1:1 übernehmen)

Airbnb ist das Vorbild für **Layout-Dichte und Komponentenlogik** — nicht für Farben. Ursprünglich Rausch (#ff385c), Cereal VF, rein Light-only. KLARSICHT ersetzt diese Werte durch die Mesh-Marke und unterstützt Dark Mode.

**Airbnb Key Characteristics (historisch, zur Einordnung):**
- Single accent color Rausch — bei KLARSICHT → Lavender + Coral secondary
- Custom variable type Cereal — bei KLARSICHT → Space Grotesk + Inter
- Property cards photo-first — bei KLARSICHT → Scoring-Karten mit Score-Kante

## Colors

### Brand & Accent (KLARSICHT — Quelle `tokens.css`)

- **Lavender Primary** (`{colors.primary}` — #5868F7): Haupt-CTAs, Fokus-Ring, Links, Empfehlungs-Boxen (`--color-accent`).
- **Lavender Active** (`{colors.primary-active}` — #4757E6): Hover/Press auf Primary-Buttons.
- **Lavender Subtle** (`{colors.primary-subtle}` — #EEF0FF): Icon-Hintergründe, dezente Highlights.
- **Coral Warm** (`{colors.primary-warm}` — #FC624B): Nebenbei-Einordnung, Morph-CTA, sparsame warme Akzente (`--color-accent-warm`).
- **Pink / Magenta** (`{colors.brand-pink}`, `{colors.brand-magenta}`): Nur Mesh-Gradient, Splash, Hero — nicht für Flächen-UI.
- **Deep Purple** (`{colors.brand-deep}` — #1A1A5E): Dark-Mode-Subtle, Tiefe.

### Score-Semantik (Rangliste, Badges)

- **High** (`{colors.score-high}` / `{colors.score-high-bg}`): Quick Win — Grün #2F7D53.
- **Mid** (`{colors.score-mid}` / `{colors.score-mid-bg}`): Strategischer Fall — Lavender #5B4BD4 (kein Gold/Amber).
- **Low** (`{colors.score-low}` / `{colors.score-low-bg}`): Zurückstellen — Coral-Rot #C94530.
- **Accent** (`{colors.score-accent}` / `{colors.score-accent-bg}`): Nebenbei-Verbesserung — Coral #D94A32.

### Dark Mode

Aktivierung: `<html data-theme="dark">`. Primary aufgehellt (#9490FA), Hintergrund Deep Purple (#0E0C18), Karten #1A1730. Alle Werte in `tokens.css` unter `[data-theme="dark"]`.

### Surface (Light)
- **Canvas** (`{colors.canvas}` — #ffffff): The default page floor for every public page. Airbnb does not have a dark mode on the public web.
- **Surface Soft** (`{colors.surface-soft}` — #f7f7f7): The lightest fill — used on disabled fields, sub-nav hover backgrounds, and the inline search filter band.
- **Surface Strong** (`{colors.surface-strong}` — #f2f2f2): Slightly heavier fill — circular icon-button surface (e.g., the breadcrumb back-arrow and listing toolbar buttons).

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #dddddd): The default 1px border tone — search bar dividers, table separators, footer column splitters, card 1px borders.
- **Hairline Soft** (`{colors.hairline-soft}` — #ebebeb): A lighter divider used on long-scrolling editorial body separators.
- **Border Strong** (`{colors.border-strong}` — #c1c1c1): A heavier stroke used on disabled outline buttons and form input outlines after focus.

### Text
- **Ink** (`{colors.ink}` — #222222): The dominant text color on light surfaces. Display headlines, body paragraphs, primary nav links, and most inline link text. Never pure black.
- **Body** (`{colors.body}` — #3f3f3f): A secondary running-text color used inside long-form review and amenity copy where ink would feel too heavy.
- **Muted** (`{colors.muted}` — #6a6a6a): Sub-titles inside city link blocks ("Cottage rentals", "Villa rentals"), inactive product-tab labels, footer category sub-labels, "View all" links.
- **Muted Soft** (`{colors.muted-soft}` — #929292): Disabled link text. Used very sparingly.
- **Star Rating** (`{colors.star-rating}` — #222222): The same ink token — Airbnb's star icon and "4.81" rating numbers all render in ink rather than a yellow/gold color, which is a deliberate brand choice (yellow stars feel cheap in travel context).
- **On Primary** (`{colors.on-primary}` — #ffffff): White text on Rausch CTAs.

### Semantic
- **Error** (`{colors.primary-error-text}` — #c13515): Inline error text for form validation. Distinct from Rausch — slightly darker, more saturated red.
- **Error Hover** (`{colors.primary-error-text-hover}` — #b32505): Darkens on link hover.
- **Legal Link Blue** (`{colors.legal-link}` — #428bff): Inline links inside legal copy (Privacy, Terms). Only used inside the legal sub-band.

### Scrim
- **Scrim** (`{colors.scrim}` — #000000 at 50% opacity): The global modal backdrop tone — date picker, login dialog, language picker. Stored as the base hex; opacity is applied at render time.

## Typography

### Font Family
The system runs **Airbnb Cereal VF** for everything — display, body, navigation, captions, microcopy. Fallbacks walk `Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif`. **Circular** is the historic in-house typeface still kept as the first non-variable fallback; system stacks back it up.

There is no separate display family. The variable font carries the entire scale.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.rating-display}` | 64px | 700 | 1.1 | -1px | Listing detail rating display ("4.81") |
| `{typography.display-xl}` | 28px | 700 | 1.43 | 0 | Homepage h1 ("Inspiration for future getaways") |
| `{typography.display-lg}` | 22px | 500 | 1.18 | -0.44px | Listing detail h1 ("Close to Fethiye Aliyah Bali Beach…") |
| `{typography.display-md}` | 21px | 700 | 1.43 | 0 | Section heads inside listing detail ("What this place offers") |
| `{typography.display-sm}` | 20px | 600 | 1.20 | -0.18px | Sub-section titles ("Things to know") |
| `{typography.title-md}` | 16px | 600 | 1.25 | 0 | City link block titles ("Wilmington", "Athens") |
| `{typography.title-sm}` | 16px | 500 | 1.25 | 0 | Footer column heads ("Support", "Hosting", "Airbnb") |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default running-text inside listing copy |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Card meta lines, dates, prices, distance text |
| `{typography.caption}` | 14px | 500 | 1.29 | 0 | Search field segment labels ("Where", "When", "Who") |
| `{typography.caption-sm}` | 13px | 400 | 1.23 | 0 | Footer legal line ("© 2026 Airbnb, Inc.") |
| `{typography.badge}` | 11px | 600 | 1.18 | 0 | "Guest favorite" floating badge text |
| `{typography.micro-label}` | 12px | 700 | 1.33 | 0 | Card amenity micro-labels ("Inline 6") |
| `{typography.uppercase-tag}` | 8px | 700 | 1.25 | 0.32px (uppercase) | "NEW" badge on product nav tabs |
| `{typography.button-md}` | 16px | 500 | 1.25 | 0 | Primary CTA button labels |
| `{typography.button-sm}` | 14px | 500 | 1.29 | 0 | Pill button labels (category strip) |
| `{typography.link}` | 14px | 400 | 1.43 | 0 | Inline body links |
| `{typography.nav-link}` | 16px | 600 | 1.25 | 0 | Top product-nav labels (Homes, Experiences, Services) |

### Principles
Display weights stay modest. The homepage h1 at 28px / 700 is deliberately small — it tucks under the search bar so photography and the city-link grid carry visual hierarchy. The listing-detail h1 at 22px / 500 is even quieter; the listing photo banner does the work above it.

The single typographically loud moment in the entire system is the **rating display** (`{typography.rating-display}` — 64px / 700) on listing pages. That is the only place the system trusts type alone to carry hierarchy — rating numbers are a peak trust signal, so they get the loudest treatment.

### Note on Font Substitutes
If Airbnb Cereal VF and Circular are unavailable, **Inter** is the closest open-source substitute. Adjust display headlines down by ~2% in line-height to match Cereal's slightly tighter cap height; otherwise the proportions transfer cleanly.

## Layout

### Spacing System
- **Base unit:** 4px (with 2px micro-step).
- **Tokens:** `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **Section padding (vertical):** `{spacing.section}` (64px) for major page bands; tighter than typical SaaS marketing (80–96px) because marketplace pages need higher card density per scroll.
- **Card internal padding:** `{spacing.lg}` (24px) for `{component.host-card}` and `{component.reservation-card}`; `{spacing.base}` (16px) for property-card meta block; `{spacing.sm}` (8px) for caption / date-row gutters.
- **Gutters:** `{spacing.base}` (16px) between cards in the homepage city grid; `{spacing.lg}` (24px) inside footer column gutters; `{spacing.xs}` (4px) on dense category-strip dividers.

### Grid & Container
- **Max content width:** ~1280px centered on the homepage and editorial pages. Listing detail pages cap closer to 1080px to keep the photo banner and reservation rail readable.
- **City link grid (homepage footer):** 6-column grid at desktop with each cell housing a city name in `{typography.title-md}` and a category sub-label in `{typography.body-sm}` muted.
- **Listing detail:** 2-column with photo / amenity body on the left (~64% width) and a sticky reservation card (`{component.reservation-card}`) on the right (~32%).
- **Footer:** 3-column link list (Support / Hosting / Airbnb) at desktop, collapsing to 1-column on mobile.

### Whitespace Philosophy
The system gives editorial bands 64px of vertical breathing room but compresses card grids — property and city-link cards sit just 16px apart. The contrast is intentional: the page reads as "open hero, dense marketplace below," reinforcing the marketplace nature without overwhelming the visitor at the fold.

## Elevation

The system has essentially **one shadow tier** plus the flat baseline.

- **Flat (no shadow):** Body, hero, footer, all editorial bands — 95% of surfaces.
- **Card hover float:** `box-shadow: rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0` — applied to property cards on pointer hover, the search bar at rest, and the dropdown menus (account menu, language picker, date picker). This is the single shadow definition in the entire system.
- **Modal scrim:** `{colors.scrim}` rendered at 50% opacity — the global modal backdrop. Used on date pickers, login dialogs, language picker.

There are no progressive elevation tiers — the system either has the one shadow or none. Depth comes from photography, the white-on-white surface separation, and rounded-corner clipping rather than from layered shadows.

## Components

### Buttons

**`button-primary`** — Rausch fill, white text, 8px radius, 14×24px padding, 48px height, weight 500. The most common CTA across the system: "Reserve", "Continue", "Search", account-flow primaries.

**`button-primary-active`** — The press state. Background flips to `{colors.primary-active}`. No transform, no shadow change.

**`button-primary-disabled`** — Pale Rausch tint at #ffd1da with white text. Cursor not-allowed.

**`button-secondary`** — White fill with ink text and a 1px ink outline. 8px radius. Used for "Save", "Cancel", and inverse CTAs over Rausch surfaces.

**`button-tertiary-text`** — Plain ink text, no surface, no border. Underlined on hover. Used for "Show more" type links and modal close labels.

**`button-pill-rausch`** — A pill-shaped Rausch CTA used on featured cells (e.g., "Become a host" sub-CTA) — 9999px radius, 10×20px padding, 14px label.

### Search Surface

**`search-bar-pill`** — The signature global search bar. White fill, 9999px radius, 64px height, 1px hairline 1px-shadow border. Internally divided by vertical hairline rules into `{component.search-field-segment}` cells (Where / When / Who). Each segment holds an uppercase caption label above a placeholder line in `{typography.caption}`.

**`search-orb`** — The circular Rausch orb terminating the right edge of the search bar. 48×48px, fully rounded, white magnifying-glass icon centered. The hottest single color moment on the homepage.

### Top Navigation

**`top-nav`** — White surface, 80px height, 1px bottom hairline. The Airbnb wordmark sits flush left, the three product tabs (Homes / Experiences / Services) sit in the dead center, and account utilities (host link, language globe, account menu) sit flush right.

**`product-tab-active`** — Ink label in `{typography.nav-link}`, 32px hand-illustrated icon, 2px ink underline rule beneath the icon-label pair.

**`product-tab-inactive`** — Muted label, illustrated icon, no underline. Becomes active on click.

**`new-tag`** — A tiny rounded-pill badge (`{rounded.full}`) anchored top-right of an icon, carrying the uppercase "NEW" label in `{typography.uppercase-tag}` (8px / 700 with 0.32px tracking, uppercase). Used on Experiences and Services to signal recency.

### Listing Cards

**`property-card`** — A photo-first card. 1:1 aspect-ratio image with `{rounded.md}` corner clipping, image carousel dots overlay, "Guest favorite" floating badge top-left (`{component.guest-favorite-badge}`), and a heart icon top-right (`{component.icon-button-circle}` in default outlined state, Rausch-filled when saved). Beneath the image: 4–5 lines of meta — title (`{typography.title-md}`), distance / dates (`{typography.body-sm}` muted), and price ("$X night") right-aligned.

**`property-card-photo`** — The photo plate itself, separated as a token because some surfaces (wishlist, search results) reuse just the photo without the meta block.

**`experience-card`** — A taller-aspect card (4:5) for experience listings. Same `{rounded.md}` clipping, floating "NEW" badge top-left, heart top-right, and a single-line title beneath.

**`guest-favorite-badge`** — White rounded pill (`{rounded.full}`) at 11px / 600 weight. Sits over the photo with the system's only shadow tier applied for elevation.

### Listing Detail

**`rating-display-card`** — The signature listing-detail moment. A 64px / 700 rating number ("4.81") flanked left and right by tiny laurel-wreath SVG ornaments. Beneath the rating: "Guest favorite" tagline and a row of ink stat columns. The largest typographic weight in the whole system.

**`amenity-row`** — A 1-column list of amenity icons + ink labels in `{typography.body-md}`. 12px row padding, no border between rows; section is closed by a 1px hairline divider above and below.

**`reviews-card`** — A 2-column grid of review excerpts. Each column holds an author row (avatar, name, date) above a 3-line excerpt with "Show more" tertiary link.

**`host-card`** — A white card with `{rounded.md}` rounding and 24px padding holding a host avatar, name, "Superhost" badge, response-rate stat, and a "Contact host" `{component.button-secondary}`.

**`reservation-card`** — The sticky right-rail card on listing detail pages. White surface, `{rounded.md}` rounding, 1px hairline border, 1px shadow tier elevation, 24px padding. Contains: nightly price (`{typography.display-md}` ink), date-range selector, guest-count stepper, "Reserve" primary CTA full-width, and a fee breakdown stack beneath in `{typography.body-sm}`.

### Date Picker

**`date-picker-day`** — A 40×40px circular cell carrying the day number in `{typography.body-sm}`. Default state is transparent fill, ink text.

**`date-picker-day-selected`** — Ink fill, white text, full circle (`{rounded.full}`). Range states between two selected days carry a `{colors.surface-soft}` lozenge background that connects them.

### Forms

**`text-input`** — White surface, 1px hairline outline, `{rounded.sm}` 8px radius, 56px height, 14×12px padding. Stacked label above (in `{typography.caption}` muted), placeholder text in `{typography.body-md}` muted. On focus, the border thickens to 2px ink and the border color flips to `{colors.ink}` — no glow, no ring.

### Footer

**`footer-light`** — White surface (matches the page canvas — Airbnb has no contrast footer), 48×80px padding. Three columns of link blocks (Support / Hosting / Airbnb), separated by generous 24px gutters. Each column heads with a `{typography.title-sm}` ink label and stacks `{component.footer-link}` rows in `{typography.body-sm}` ink.

**`legal-band`** — A bottom strip beneath the footer columns carrying the copyright line, language picker (globe icon + "English (US)" link), currency picker, and social icons (Facebook, X, Instagram). All text in muted `{colors.muted}` at `{typography.caption-sm}`.

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 744px | Top nav collapses to logo + hamburger; product tabs hide behind a sheet; search bar collapses to a single tappable pill; property cards stack 1-up; city grid 1-column; listing detail collapses reservation card to a sticky bottom bar. |
| Tablet | 744–1128px | Top nav keeps product tabs but search bar narrows; property cards 2-up; city grid 2–3 column; reservation card stays sticky right-rail at narrower width. |
| Desktop | 1128–1440px | Full top nav with three product tabs centered; search bar at full pill width with all 3 segments visible; property cards 4-up; city grid 6-column; listing detail 2-column with reservation rail. |
| Wide | > 1440px | Content width caps at 1440px on listing/search pages and ~1280px on editorial; gutters absorb the rest. |

### Touch Targets
- Primary CTAs at minimum 48×48px (above WCAG AAA).
- Search orb is 48×48px circular — the most-tapped element on the page.
- Heart save button is 32×32px circular — borderline for AAA but compensated by a generous 12px padding inside the photo card.
- Date-picker day cells are 40×40px circular.

### Collapsing Strategy
- Top product tabs collapse into a hamburger sheet below 744px.
- Search bar's 3 segments collapse into a single-tap entry that opens a full-screen search overlay on mobile.
- Property and city-link grids drop column counts cleanly at each breakpoint — never reflow rows; always reduce columns.
- Reservation card on listing detail switches from sticky right-rail to a sticky bottom bar on mobile, carrying just the "Reserve" CTA + nightly price summary.

## Known Gaps

- **Hover state colors:** intentionally not documented per the global no-hover policy — Airbnb's actual `:hover` styling for property cards is a subtle elevation lift, but precise extraction is unreliable.
- **Loading states / skeleton screens:** not visible on the extracted surfaces.
- **Map view styling:** the search-results map uses Mapbox-tinted tiles with custom Rausch markers; not captured here.
- **Form input error states:** error text color (`{colors.primary-error-text}`) is documented, but the full input outline + helper-text combination on validation failure was not visible in the captured surfaces.
- **Sub-brand palettes:** Luxe (`{colors.luxe}`) and Plus (`{colors.plus}`) are documented as tokens, but their full sub-system (typography overrides, surface treatment) lives on separate sub-domains and is not captured here.
