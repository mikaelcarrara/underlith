# Roadmap

Underlith strategic milestones.

The roadmap focuses on turning design tokens into **governable infrastructure**:
versioned, enforceable, and consumable across stacks.

---

# 2026

## Q1 — Foundations

Establish the **canonical token format** and core architecture.

- [x] Motion tokens
  - durations
  - easings
  - delays
  - composite motion tokens
  - reduced-motion policy

- [x] CSS consumption examples
  - plain CSS
  - Sass
  - CSS-in-JS
  - Tailwind integration

- [x] `underlith init --shadcn`
  - automated integration for shadcn/ui projects
  - maps existing CSS variables into token primitives

- [ ] JSON Schema for canonical token structure
  - defines token contracts
  - enables validation and tooling

- [ ] JSON export
  - generate `underlith.tokens.json` as canonical source
  - enables downstream integrations:
    - Figma variables
    - Style Dictionary pipelines
    - mobile platforms

---

## Q2 — Brand Layer

Separate **framework primitives** from **organizational design decisions**.

- [x] Token generation with two layers

  - `underlith.base.css`
    - framework primitives
    - spacing, radius, motion, typography scales

  - `underlith.brand.css`
    - brand values
    - color palettes
    - typography choices
    - identity decisions

- [x] `underlith brand init`

  Scaffolds a publishable **`@org/tokens` package**.

  Enables organizations to publish their token layer as a dependency.

- [x] Two-step adoption flow

```
integrate infrastructure
publish brand layer
```

- [ ] Starter templates for common stacks

- vanilla CSS
- React / Next
- Rails
- design-system packages

---

## Q3 — Automation

Introduce governance and enforcement mechanisms.

- [ ] Token-aware linter

Detect hardcoded values that should reference tokens.

Examples:

```
#fff
8px
border-radius: 6px
```

- [ ] Pre-commit hooks

Block commits introducing hardcoded design values.

- [ ] CI templates

Automation for:

- token breaking-change detection
- dependency updates
- design-system audits

- [ ] `underlith audit`

Scans a project and reports:

- token adoption coverage
- unused tokens
- hardcoded values

Output example:

```
token coverage: 83%
hardcoded colors: 12
unused tokens: 4
```

---

## Q4 — Ecosystem

Expand integrations and developer tooling.

### Core

- [ ] TypeScript token types

Generate types for token names.

Benefits:

- autocomplete
- build-time validation
- safer design-system consumption

- [ ] Visual regression harness

Reference components powered by tokens.

Detect visual regressions when tokens change.

- [ ] `underlith migrate`

AI-assisted migration from legacy values to tokens.

Example transformation:

```
background: #0ea5e9
```
→  

```
background: var(--ul-color-brand-primary)
```

---

### Integrations

Integrations connect Underlith with external platforms.

The core remains **framework-agnostic and independent**.

---

#### Figma

Bidirectional sync:

```
tokens.json
↕
Figma Variables
↕
@org/tokens (CSS)
```

Workflow:

1. Designer updates tokens in Figma
2. Export to `tokens.json`
3. Generate CSS tokens
4. Publish `@org/tokens`

Reverse sync is also supported:

```
JSON → Figma variables
```

Dependency:

Requires `underlith.tokens.json` from Q1.

---

#### MCP (Model Context Protocol)

Expose tokens to AI coding assistants.

`underlith brand init` generates an MCP server bundled with `@org/tokens`.

Supported environments:

- Cursor
- Windsurf
- Claude
- any MCP-enabled editor

Instead of writing:

```
#c8f542
```

AI writes:

```
var(--ul-color-brand-primary)
```

Dependency:

```
Requires `underlith.tokens.json` from Q1.
```
