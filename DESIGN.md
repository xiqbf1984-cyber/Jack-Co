# Design System: Claude (Anthropic) — Adapted for NeoHuman

## 1. Visual Theme & Atmosphere

Claude's interface is a literary salon reimagined as a product page — warm, unhurried, and quietly intellectual. The entire experience is built on a parchment-toned canvas (`#f5f4ed`) that deliberately evokes the feeling of high-quality paper rather than a digital surface. Where most AI product pages lean into cold, futuristic aesthetics, Claude's design radiates human warmth, as if the AI itself has good taste in interior design.

The signature move is the custom Anthropic Serif typeface — a medium-weight serif with generous proportions that gives every headline the gravitas of a book title. Combined with organic, hand-drawn-feeling illustrations in terracotta (`#c96442`), black, and muted green, the visual language says "thoughtful companion" rather than "powerful tool." The serif headlines breathe at tight-but-comfortable line-heights (1.10–1.30), creating a cadence that feels more like reading an essay than scanning a product page.

What makes Claude's design truly distinctive is its warm neutral palette. Every gray has a yellow-brown undertone (`#5e5d59`, `#87867f`, `#4d4c48`) — there are no cool blue-grays anywhere. Borders are cream-tinted (`#f0eee6`, `#e8e6dc`), shadows use warm transparent blacks, and even the darkest surfaces (`#141413`, `#30302e`) carry a barely perceptible olive warmth. This chromatic consistency creates a space that feels lived-in and trustworthy.

> **NeoHuman Adaptation**: We use **Libre Baskerville** (Google Fonts) as our serif typeface in place of Anthropic Serif/Sans. All other design tokens follow the Claude system faithfully.

**Key Characteristics:**
- Warm parchment canvas (`#f5f4ed`) evoking premium paper, not screens
- Libre Baskerville for headlines and body text (weight 400/700)
- DM Mono for code and monospace elements
- Terracotta brand accent (`#c96442`) — warm, earthy, deliberately un-tech
- Exclusively warm-toned neutrals — every gray has a yellow-brown undertone
- Organic, editorial illustrations replacing typical tech iconography
- Ring-based shadow system (`0px 0px 0px 1px`) creating border-like depth without visible borders
- Magazine-like pacing with generous section spacing and serif-driven hierarchy

## 2. Color Palette & Roles

### Primary
- **Anthropic Near Black** (`#141413`): Primary text color and dark-theme surface
- **Terracotta Brand** (`#c96442`): Core brand color for primary CTAs and brand moments
- **Coral Accent** (`#d97757`): Lighter variant for text accents and links on dark surfaces

### Secondary & Accent
- **Error Crimson** (`#b53333`): Deep, warm red for error states
- **Focus Blue** (`#3898ec`): Standard blue for input focus rings (only cool color)

### Surface & Background
- **Parchment** (`#f5f4ed`): Primary page background
- **Ivory** (`#faf9f5`): Cards and elevated containers
- **Pure White** (`#ffffff`): Specific button surfaces and maximum-contrast elements
- **Warm Sand** (`#e8e6dc`): Button backgrounds and interactive surfaces
- **Dark Surface** (`#30302e`): Dark-theme containers
- **Deep Dark** (`#141413`): Dark-theme page background

### Neutrals & Text
- **Charcoal Warm** (`#4d4c48`): Button text on light surfaces
- **Olive Gray** (`#5e5d59`): Secondary body text
- **Stone Gray** (`#87867f`): Tertiary text, footnotes
- **Dark Warm** (`#3d3d3a`): Dark text links
- **Warm Silver** (`#b0aea5`): Text on dark surfaces

### Semantic & Accent
- **Border Cream** (`#f0eee6`): Standard light-theme border
- **Border Warm** (`#e8e6dc`): Prominent borders, section dividers
- **Border Dark** (`#30302e`): Standard border on dark surfaces
- **Ring Warm** (`#d1cfc5`): Shadow ring color for hover/focus
- **Ring Deep** (`#c2c0b6`): Deeper ring for active/pressed states

### Functional (Retained)
- **Accent Green** (`#27825b`): Success states
- **Gold** (`#8b6914`): Accent, highlights
- **Orange** (`#d4880f`): Warning states
- **Blue** (`#0077B5`): Info states

## 3. Typography Rules

### Font Family
- **Headline / Body**: `Libre Baskerville`, with fallback: `Georgia, serif`
- **Code**: `DM Mono`, with fallback: `monospace`

### Hierarchy

| Role | Size | Weight | Line Height | Notes |
|------|------|--------|-------------|-------|
| Display / Hero | clamp(28px, 4vw, 40px) | 700 | 1.15 | Maximum impact |
| Page Title | 22px | 700 | 1.20 | Page-level headings |
| Section Heading | 15px | 700 | 1.30 | Feature section anchors |
| Dialog Title | 18px | 700 | 1.25 | Modal/dialog headings |
| Body Large | 14px | 400 | 1.60 | Intro paragraphs, descriptions |
| Body Standard | 13px | 400 | 1.60 | Standard body text |
| Body Small | 12px | 400 | 1.55 | Compact body text |
| Body XS | 11px | 400 | 1.45 | Smallest body text |
| Label | 12px | 500 | 1.25 | Metadata, labels |
| Mono Display | 18px (DM Mono) | 500 | 1.20 | Data highlights |
| Mono Data | 13px (DM Mono) | 500 | 1.40 | Tabular data |
| Mono Label | 12px (DM Mono) | 400 | 1.40 | Code labels |
| Mono Tag | 11px (DM Mono) | 400 | 1.30 | Tags, badges |

### Principles
- Relaxed body line-height (1.60) for a literary reading experience
- Tight-but-not-compressed headings (1.15–1.30) — serif letterforms need breathing room
- Weight 700 for headings, 400 for body — clean two-weight system
- DM Mono used exclusively for data/code — never for body content

## 4. Component Stylings

### Buttons

**Terracotta Primary (CTA)**
- Background: Terracotta Brand (`#c96442`)
- Text: Ivory (`#faf9f5`)
- Padding: 9px 18px
- Radius: 10px
- Shadow: ring-based (`0px 0px 0px 1px #c96442`)
- Hover: lighter terracotta, ring glow

**Warm Sand (Secondary)**
- Background: Warm Sand (`#e8e6dc`)
- Text: Charcoal Warm (`#4d4c48`)
- Padding: 8px 16px
- Radius: 8px
- Shadow: ring-based (`0px 0px 0px 1px #d1cfc5`)

**White Surface**
- Background: Pure White (`#ffffff`)
- Text: Anthropic Near Black (`#141413`)
- Padding: 8px 16px
- Radius: 10px
- Border: 1px solid Border Cream (`#f0eee6`)

**Icon Button**
- Background: Ivory (`#faf9f5`)
- Border: 1px solid Border Cream (`#f0eee6`)
- Radius: 8px
- Hover: border shifts to Border Warm

### Cards & Containers
- Background: Ivory (`#faf9f5`) on light surfaces
- Border: 1px solid Border Cream (`#f0eee6`)
- Radius: 12px for standard, 16px for featured
- Shadow: whisper-soft (`rgba(0,0,0,0.04) 0px 2px 12px`)

### Inputs & Forms
- Background: Pure White (`#ffffff`)
- Border: 1px solid Border Cream (`#f0eee6`)
- Focus: ring with Focus Blue (`#3898ec`)
- Radius: 10px
- Padding: 8px 12px

## 5. Layout Principles

### Spacing System
- Page padding: 40px horizontal, 32px vertical
- Max content width: 1400px
- Section gap: 32px
- Card gap: 16px
- Card padding: 24px

### Border Radius Scale
- XS: 6px (minimal elements)
- SM: 8px (standard buttons, small cards)
- MD: 10px (primary buttons, inputs)
- LG: 12px (standard cards)
- XL: 14px (featured elements)
- 2XL: 16px (featured containers)
- 3XL: 18px (large containers)
- Pill: 18px (tag-like elements)
- Full: 9999px (circles)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Page background, inline text |
| Contained | `1px solid #f0eee6` | Standard cards, sections |
| Ring | `0px 0px 0px 1px` warm ring | Interactive cards, buttons |
| Whisper | `rgba(0,0,0,0.04) 0px 2px 12px` | Elevated cards |
| Elevated | `rgba(0,0,0,0.06) 0px 4px 20px` | Hover states, dropdowns |
| Modal | `rgba(0,0,0,0.15) 0px 16px 48px` | Modals, overlays |

## 7. Do's and Don'ts

### Do
- Use Parchment (`#f5f4ed`) as primary background
- Use Terracotta (`#c96442`) only for primary CTAs
- Keep all neutrals warm-toned
- Use ring shadows for interactive states
- Use generous body line-height (1.60)
- Apply generous border-radius (8–16px)

### Don't
- Don't use cool blue-grays anywhere
- Don't introduce saturated colors beyond Terracotta
- Don't use sharp corners (< 6px radius)
- Don't apply heavy drop shadows
- Don't use pure white as page background
- Don't reduce body line-height below 1.40
