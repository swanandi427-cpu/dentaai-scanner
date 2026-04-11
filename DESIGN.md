# Design Brief

## Direction

DantaNova Premium — AI-powered dental scanning with Tony Stark-level premium aesthetics, full gold/amber/yellow palette, Iron Man HUD neural network visualization, glassmorphism depth, and 11-principle engineering ethos.

## Tone

Futuristic luxury meets medical trust: maximalist premium with precision detail, animated scan-line overlays, glowing reticle rings, and live telemetry — bold, sophisticated, unforgettable.

## Differentiation

Animated Iron Man HUD scan-line with corner bracket markers, rotating reticle rings, live telemetry counter, and an "Engineering Principles" section showcasing 11 core design + leadership principles in a gold-gradient card grid.

## Color Palette

| Token           | OKLCH             | Role                           |
| --------------- | ----------------- | ------------------------------ |
| background      | 0.08 0.005 60     | Deep black base                |
| foreground      | 0.96 0.01 80      | Bright white text              |
| card            | 0.12 0.008 60     | Glassmorphic surface           |
| primary         | 0.78 0.16 80      | Gold accent, buttons, glows    |
| secondary       | 0.18 0.015 60     | Dark card backgrounds          |
| accent          | 0.72 0.18 75      | Bright golden accent           |
| muted           | 0.16 0.01 60      | Subtle text, borders           |
| gold-shiny      | 0.88 0.18 85      | Scan-line, reticle glow        |
| gold-deep       | 0.75 0.19 75      | Reticle rings, secondary glow  |
| destructive     | 0.62 0.22 25      | Error states                   |

## Typography

- Display: Bricolage Grotesque — hero headings, section titles, principle cards, extreme weight range (200–800)
- Body: Satoshi — body copy, descriptions, labels, medium (300–700)
- Scale: hero 3xl–4xl, h2 2xl, label sm, body base

## Elevation & Depth

Glassmorphism stack with inset highlights, outset shadows, and layered glow: card base (backdrop blur 20px) with 1px light inset + outset glow (gold at 0.6 opacity max, 0.2 opacity min). Canvas ring glow adds depth to 3D visualizations.

## Structural Zones

| Zone          | Background                    | Border                          | Notes                                      |
| ------------- | ----------------------------- | ------------------------------- | ------------------------------------------ |
| Header        | glass-card, no bottom border  | —                               | Sticky, rgba-faded on scroll               |
| Hero          | hero-grid-mesh + orb drifts   | card-glow-border                | Animated scan-line (iron-scan keyframe)    |
| Content       | background, alternating muted | —                               | Sections reveal on scroll (section-reveal) |
| Principles    | card-background, gold-border  | card-glow-border gold           | 11-card grid with hover lift               |
| 3D Arch       | glass-card                    | canvas-glow-ring                | Premium depth: enamel lighting + fog       |
| Footer        | glass-card, no top border     | border-t gold                   | Developer credit, legal, social links      |

## Spacing & Rhythm

Section gaps 4rem–6rem (md:8rem), card grouping 2rem, micro-spacing 0.5rem–1rem. Rhythm created via alternating background colors (section-alternate: background vs muted/30) and staggered reveal animations (section-reveal 0.7s staggered).

## Component Patterns

- Buttons: gold primary (0.78 0.16 80), rounded-full, shimmer-sweep on hover, glow-pulse shadow
- Cards: rounded-3xl, glass-card base, card-glow-border, inset highlight
- Badges: pill-shaped, gold-border, gold-text gradient
- Principles: 11-card grid (sm:1 md:2 lg:3 xl:4), gold-gradient-border on hover, scale-up lift, rotate-slight

## Motion

- Entrance: section-reveal (0.7s ease-out, staggered by 0.15s per element), fade-in-up on load
- Hover: shimmer-sweep on buttons (2.2s infinite), card scale-up + rotate-slight (0.3s), glow-pulse shadow (2s)
- Decorative: scan-line (2.5s linear infinite), particle-rise (3s ease-out), orb-drift (8s infinite), node-pulse neural net (2s)

## Constraints

- No neon blue — all neon colors are gold/amber/yellow (hue ~80)
- No purple accent — secondary glow is deep gold (0.75 0.19 75)
- Chroma range: 0.005–0.22 (avoid super-saturated colors, maintain luxury feel)
- Animations: all tied to reduced-motion media query for accessibility

## Signature Detail

Animated Iron Man HUD scan-line with corner brackets, rotating reticle rings, and live telemetry (FRAME counter, SIGNAL, STATUS) bathed in shiny gold glow — the hero interaction that makes the interface unmistakable and premium.
