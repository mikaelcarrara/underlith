# Underlith Vision

This document explains the thinking behind each phase of Underlith's roadmap.
Not what we're building — but why, and what changes when it exists.

For the technical milestones, see [ROADMAP.md](./ROADMAP.md).

---

## Where we are today

Underlith started as a simple token file. It became something more specific when a real project — a shadcn/ui design system — revealed the gap the product actually fills.

**What's in production today:**

### Token system
A framework-agnostic set of CSS Custom Properties covering space, typography, color, radius, elevation, opacity, breakpoints, and motion. Every token uses the `--ul-*` prefix — a stable, namespaced contract that won't collide with your existing variables.

Motion tokens deserve a special mention: durations, easings, delays, and composite tokens like `--ul-motion-skeleton` and `--ul-motion-fade-up`. They respect `prefers-reduced-motion` automatically. You don't think about accessibility — it's built into the token.

### Brand layer
The most important feature. `underlith brand init` reads your token file, separates brand decisions from framework primitives, and scaffolds a publishable `@your-org/tokens` package. Two commands for new projects. Three for existing ones.

This is the shift from "a token file in your project" to "a versioned, publishable contract your entire org shares." Every product installs the package. Brand decisions change once. Everything updates on `npm update`.

### shadcn/ui integration
`underlith init --shadcn` maps existing shadcn CSS variables to Underlith semantic tokens without touching a single component. The first real test was a production shadcn/ui design system — and it revealed exactly what the product needed to solve in practice.

### Documentation
Getting Started, Tokens, Components, Consumption, W3C Alignment, Governance — all updated to reflect the brand layer model. The site uses Underlith's own tokens to render itself.

---

## Q1 2026 — Foundations: giving tokens a language

The token files exist. But tokens without a canonical format are still just CSS. To become truly interoperable — with Figma, with Style Dictionary, with AI tools — they need a machine-readable representation.

`underlith.tokens.json` is that representation. It's the file that makes everything downstream possible. The JSON Schema draft defines the structure: how tokens are typed, how aliases are resolved, how brand tokens are distinguished from base tokens.

This isn't just infrastructure for other features. It's the moment Underlith stops being a CSS utility and starts being a design token protocol.

---

## Q2 2026 — Brand Layer: the source of truth your org actually owns

The brand layer is already built. What's missing is the starting point for teams who don't have a token file yet — starter templates for common stacks.

The deeper idea here: Underlith is not your source of truth. It's the infrastructure to build one. The `@your-org/tokens` package is your source of truth. You own it, you version it, you publish it. Underlith gave you the tools to create it.

When this phase is complete, the adoption path is: install Underlith, run one command, publish your brand. Any new product your org builds inherits every design decision automatically.

---

## Q3 2026 — Automation: making the invisible visible

The hardest part of adopting any design system isn't the setup — it's the migration. Codebases accumulate years of hardcoded values. `color: #3d7ef5`. `padding: 12px`. `border-radius: 6px`. Nobody knows how many there are or where they live.

The token-aware linter changes the conversation. Instead of "we should adopt design tokens someday," it becomes "we have 847 hardcoded values, and here's exactly where they are."

`underlith audit` gives engineering managers the metrics they need to make the case internally. "We're at 23% token coverage. Industry standard for mature design systems is 90%+. Here's the plan to get there." That's a roadmap item that gets approved.

Pre-commit hooks and CI templates close the loop: once you've migrated, you don't regress. The system enforces itself.

---

## Q4 2026 — Ecosystem: tokens as a living service

### Core

TypeScript types and visual regression are the reliability layer. When a token name changes, your editor tells you before CI does. When a token value changes, you know immediately whether it affected anything visually.

`underlith migrate` is the feature that removes the last remaining adoption barrier: legacy codebases. A developer shouldn't have to manually find every `#3d7ef5` and replace it with `var(--ul-color-brand-primary)`. The agent reads the codebase, reads the token file, and proposes the mappings. The developer reviews and approves. The migration happens in minutes, not weeks.

### Integrations

Integrations are optional. Underlith works without them. But for teams that want them, they unlock something qualitatively different.

**Figma bidirectional sync** closes the design-to-code loop completely. Today, a designer changes a color in Figma and a developer has to manually update the token file. With sync, the designer's change in Figma variables propagates to `tokens.json`, which updates `@your-org/tokens`, which updates every product on the next deploy. The reverse is also true: a developer updating a token syncs back to Figma automatically. Design and code stay in sync without anyone managing the sync.

**MCP server** is the most disruptive piece. When `underlith brand init` generates your `@your-org/tokens` package, it also generates an MCP server. Any editor that speaks Model Context Protocol — Cursor, Windsurf, Claude — can connect to it. The AI in your editor now knows your entire token vocabulary in real time.

The practical consequence: the AI stops hallucinating design values. It doesn't suggest `color: #3d7ef5` because it knows `var(--ul-color-brand-primary)` exists and is the correct token for that intent. Your design system becomes a constraint the AI operates within — not a convention it ignores.

This is what "tokens as contracts" means at full scale: not just between design and code, but between your design system and every tool your team uses.

---

## The throughline

Every phase builds on the previous one.

Motion tokens → brand layer → JSON export → linter → MCP.

Each step makes the next one possible. And at every step, the core principle holds: **Underlith is not your source of truth. It's the infrastructure to build one.**

The source of truth is yours. The infrastructure is shared.
