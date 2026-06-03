---
name: Crimson Essence
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5c3f42'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#916e71'
  outline-variant: '#e6bcbf'
  surface-tint: '#bd0040'
  primary: '#b5003d'
  on-primary: '#ffffff'
  primary-container: '#e3004f'
  on-primary-container: '#fff7f7'
  inverse-primary: '#ffb2b9'
  secondary: '#b12746'
  on-secondary: '#ffffff'
  secondary-container: '#fc607a'
  on-secondary-container: '#63001e'
  tertiary: '#ac185e'
  on-tertiary: '#ffffff'
  tertiary-container: '#cd3677'
  on-tertiary-container: '#fff7f8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadc'
  primary-fixed-dim: '#ffb2b9'
  on-primary-fixed: '#400010'
  on-primary-fixed-variant: '#91002f'
  secondary-fixed: '#ffdadc'
  secondary-fixed-dim: '#ffb2b9'
  on-secondary-fixed: '#400010'
  on-secondary-fixed-variant: '#900530'
  tertiary-fixed: '#ffd9e2'
  tertiary-fixed-dim: '#ffb0c8'
  on-tertiary-fixed: '#3e001d'
  on-tertiary-fixed-variant: '#8e004b'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-hero:
    fontFamily: Anton
    fontSize: 120px
    fontWeight: '400'
    lineHeight: 110%
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 110%
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 110%
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 120%
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 160%
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 160%
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 100%
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
---

## Brand & Style

The design system is a high-octane blend of **Minimalism** and **High-Contrast Boldness**, designed to mirror the vibrant energy of raspberry notes against the purity of premium Swedish vodka. It targets a lifestyle-oriented, discerning audience that values authenticity and artistic expression.

The visual direction centers on "The Splash"—the raw, painterly energy of the bottle's artwork—translated into digital space through expansive white voids, razor-sharp typography, and occasional moments of tactile glassmorphism. The emotional response is one of sophisticated excitement; it feels expensive but approachable, cinematic but grounded.

Key stylistic pillars include:
- **High-Impact Imagery:** Full-bleed photography with rich saturation and deep shadows.
- **Dynamic Asymmetry:** Layouts that mimic the unpredictable nature of a paint splash.
- **Editorial Breathing Room:** Generous use of white and dark space to elevate the product as art.

## Colors

The palette is rooted in the "Raspberry Splash" found on the physical bottle. 

- **Raspberry Primary (#E3004F):** A vibrant, electric pink-red used for calls to action and key brand moments.
- **Deep Currant (#8B002D):** A darker, sophisticated red used for gradients, hover states, and depth.
- **Blush Tertiary (#FF5E9E):** A softer, brighter pink for accents and decorative highlights.
- **Obsidian Neutral (#1A1A1A):** A nearly-black neutral used for grounding the design and for primary typography in light mode.

While the default mode is `light` (emphasizing the "Crisp White" bottle background), the system supports high-end `dark` overrides for cocktail recipes or evening lifestyle content.

## Typography

Typography in the design system is a study in contrast. **Anton** provides a powerful, condensed, and architectural feel for headlines, mirroring the bold verticality of the bottle's logo. It should always be used in uppercase to maintain brand authority.

**Hanken Grotesk** serves as the primary body face, offering a clean, contemporary feel that ensures readability without distracting from the visual impact of the headlines. **Geist** is used for technical labels and "Legal Joy" (fine print), adding a hint of modern, developer-grade precision to the luxury aesthetic.

Maintain tight leading for headlines to create a "blocky" visual effect, but allow generous line height for body text to maintain the premium, airy feel.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop, shifting to a **4-column grid** for mobile. The layout philosophy is "Centric but Boundless."

- **The Canvas:** Content should feel like it is floating on a pristine white or deep black canvas. 
- **The Rhythm:** Use an 8px base unit. Margins are intentionally wide (80px+) on desktop to create a gallery-like feeling.
- **Asymmetric Elements:** Large imagery should often "break" the grid or overlap adjacent columns to simulate the organic nature of the raspberry splash.
- **Section Breaks:** Use massive vertical padding (160px+) between major sections to emphasize exclusivity and focus.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layers** and **Glassmorphism**, rather than traditional heavy shadows.

- **Surface Tiers:** Use subtle off-whites (#F9F9F9) or deep charcoal (#222222) to separate content sections without using borders.
- **Glassmorphism:** For overlays, modals, or navigation bars, use a high-refraction backdrop blur (20px+) with a very low opacity white or raspberry-tinted fill. This evokes the frosted glass of a chilled vodka bottle.
- **Inner Glows:** For primary buttons and interactive cards, use a subtle inner glow (1px, 20% opacity) in a lighter pink to give the appearance of "backlit" liquid.

## Shapes

The design system adopts a **Sharp (0)** roundedness strategy. 

The use of 90-degree angles projects a sense of precision, architecture, and uncompromising quality. This choice contrasts beautifully with the organic, messy "splashes" of the brand's graphic elements. Interactive elements like buttons and input fields should remain strictly rectangular. 

The only exception to this rule is the product itself—imagery should feature the soft, iconic curves of the bottle to stand out against the rigid UI.

## Components

### Buttons
Primary buttons are solid `primary_color_hex` with white uppercase `label-sm` text. They are strictly rectangular. Hover states involve a shift to `secondary_color_hex` or a slight vertical "lift" without a shadow.

### Input Fields
Fields consist of a single bottom border (2px) in `neutral_color_hex`. When focused, the border transitions to `primary_color_hex` with a subtle fade. No background fill is used unless the field is on a dark background.

### Cards
Cards are "borderless" containers defined by their content or a subtle background color shift. Imagery within cards should always be top-aligned and full-bleed to the card's edge.

### Chips & Tags
Used for flavor profiles or product categories. These are outlined boxes (1px) with tight padding and `label-sm` typography.

### Navigation
The navigation bar should be a full-width glassmorphic element that sticks to the top of the viewport. Brand logos should be centered to maintain the symmetrical "premium" feel.