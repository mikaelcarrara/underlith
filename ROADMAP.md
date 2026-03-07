# Roadmap

Underlith's strategic milestones for 2026.

## Q1 2026 — Foundations

- [x] Motion tokens: durations, easings, delays, composite tokens, and reduced-motion policy
- [x] CSS consumption examples across plain CSS and CSS-in-JS
- [ ] JSON Schema draft for canonical token structure
- [ ] JSON export: generate `underlith.tokens.json` as the canonical source — enables Figma sync, Style Dictionary, and mobile pipelines
- [x] `underlith init --shadcn` — automated integration script for shadcn/ui projects

## Q2 2026 — Brand Layer

- [x] Separate base tokens from brand tokens at generation time
  - `underlith.base.css` — framework primitives (shadcn, Tailwind)
  - `underlith.brand.css` — product-specific values (colors, fonts, brand decisions)
- [ ] `underlith.brand.css` becomes the publishable artifact for teams to distribute as `@org/tokens`
- [x] Reduces adoption to two steps: integrate → publish brand layer
- [ ] Starter templates for common stacks (vanilla CSS, React, Rails)

## Q3 2026 — Automation

- [ ] Token-aware linter: detect hardcoded values that should be tokens
- [ ] Pre-commit hook support: block commits with hardcoded design values
- [ ] CI templates for breaking-change detection and token audits
- [ ] `underlith audit` — scan a project and report token adoption coverage

## Q4 2026 — Ecosystem

- [ ] Figma bidirectional sync: `tokens.json` ↔ Figma Variables ↔ `@org/tokens` (CSS)
  - Designer changes in Figma → exports JSON → generates CSS → publishes package
  - Dev updates JSON → syncs back to Figma automatically
- [ ] TypeScript types for token names: autocomplete and build-time validation
- [ ] Visual regression harness for reference components
- [ ] `underlith migrate` — AI-assisted migration from legacy values to tokens
