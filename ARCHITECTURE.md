# Underlith Architecture

Underlith is not your source of truth — it's the infrastructure to build one.

This document describes the conceptual model and file structure of the system.

---

## 1. Conceptual Model

Underlith organizes design decisions into three token layers and a publishing pipeline that produces a standalone, versioned brand package consumed by any project in your org.

```
┌─────────────────────────────────────────────────────┐
│                   Base tokens                        │
│   Raw scales: space, type, radius, motion, opacity  │
│   Lives in: @mikaelcarrara/underlith                │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│                  Brand tokens                        │
│   Your org's color palette, identity values          │
│   Extracted by: underlith brand init                │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│               Semantic aliases                       │
│   Intent over value: --ul-color-text, --ul-color-bg  │
│   Travel with the brand layer                        │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│              @your-org/tokens                        │
│   Published npm package. Brand + semantic layer.     │
│   Consumed by every product in your org.             │
└────────────────────────┬────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Plain CSS      Tailwind v4      Sass / Less
```

### The pipeline

**New project — 2 commands:**
```bash
underlith brand init --org acme
cd @acme/tokens && npm publish --access public
```

**Existing project — 3 commands:**
```bash
underlith init --shadcn --globals ./styles/globals.css
underlith brand init --org acme
cd @acme/tokens && npm publish --access public
```

Once `@acme/tokens` is published, any product installs it and inherits all brand decisions. Change once, update everywhere via `npm update`.

---

## 2. Token Layers

### Layer 1 — Base tokens (`src/tokens/*.css`)

Framework primitives. Raw scales with no brand opinion.

| File | Responsibility |
|------|---------------|
| `spacing.css` | Space scale — `--ul-space-1` through `--ul-space-5` |
| `typography.css` | Font sizes, weights, line heights |
| `colors.css` | Raw color palette — `--ul-color-brand-*`, `--ul-color-neutral-*` |
| `radius-and-borders.css` | Shape tokens — `--ul-radius-md`, `--ul-border-width-hairline` |
| `elevation.css` | Depth tokens — `--ul-elevation-1` through `--ul-elevation-3` |
| `opacity.css` | Named transparency levels |
| `breakpoints.css` | Responsive thresholds |
| `motion.css` | Durations, easings, delays, composite motion tokens |

Motion automatically respects `prefers-reduced-motion: reduce`.

### Layer 2 — Brand tokens

Your org's identity values. Colors, palette, brand decisions. These are the tokens `underlith brand init` extracts from `underlith.tokens.css` based on org name and `brand` keyword heuristics.

Output: `@your-org/tokens/your-org.brand.css`

### Layer 3 — Semantic aliases (`src/tokens/semantic-aliases.css`)

Maps raw tokens to intent. What something *means*, not what it looks like.

```css
--ul-color-text: var(--ul-color-neutral-900);
--ul-color-bg-surface: var(--ul-color-neutral-0);
--ul-color-brand-primary: var(--ul-color-brand-500);
```

Semantic aliases travel with the brand package. Components consume aliases — never raw values. When the brand evolves, aliases update. Components never change.

---

## 3. File Structure

```
underlith/
├── src/
│   ├── underlith.css              ← main entry point (imports all)
│   ├── underlith.tokens.css       ← tokens-only entry point
│   ├── base.css                   ← minimal resets
│   ├── tokens/
│   │   ├── spacing.css
│   │   ├── typography.css
│   │   ├── colors.css
│   │   ├── radius-and-borders.css
│   │   ├── elevation.css
│   │   ├── opacity.css
│   │   ├── breakpoints.css
│   │   ├── motion.css
│   │   └── semantic-aliases.css
│   └── components/
│       └── components.css         ← optional reference implementation
│
├── scripts/
│   ├── brand-init.js              ← underlith brand init
│   └── underlith-init-shadcn.js   ← underlith init --shadcn
│
├── bin/
│   └── underlith.js               ← CLI entry point
│
└── docs/                          ← documentation site
    ├── index.html
    ├── getting-started.html
    ├── tokens.html
    ├── components.html
    ├── consumption.html
    └── css/
        └── documentation.css
```

---

## 4. Consumption

### Plain CSS
```css
@import "@mikaelcarrara/underlith/src/underlith.tokens.css";

color: var(--ul-color-text);
gap: var(--ul-space-4);
border-radius: var(--ul-radius-md);
```

### Tailwind v4
```css
@import "@mikaelcarrara/underlith/src/underlith.tokens.css";

@theme {
  --color-brand: var(--ul-color-brand-primary);
  --radius-md: var(--ul-radius-md);
}
```

### Sass / Less
```scss
@import "underlith/src/underlith.tokens.css";

$color-text: var(--ul-color-text);

@mixin button-primary {
  background: var(--ul-color-brand-primary);
  border-radius: var(--ul-radius-md);
}
```

### With brand package
```css
@import "@acme/tokens/acme.brand.css";

/* All --ul-* tokens now carry acme brand values */
color: var(--ul-color-text);
background: var(--ul-color-brand-primary);
```

---

## 5. Design Principles

**Underlith is not your source of truth — it's the infrastructure to build one.**

- Tokens are contracts, not values. Components consume intent, not numbers.
- Brand is separated from framework primitives at generation time.
- The published package is the single source of truth for your org. Underlith is the tool that creates and maintains it.
- Framework agnostic by design. No runtime dependency. No coupling.
- Change once, update everywhere — via `npm update @your-org/tokens`.
