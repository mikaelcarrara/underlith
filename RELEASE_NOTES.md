# Underlith Release Notes

## v2.1.1 — 2026-03-08

Patch release following the first live end-to-end validation of the full pipeline. Fixes a CSS output bug in `brand init`, adds the missing CSS build step, and expands documentation to reflect the validated setup flow.

### CSS build pipeline

- New script `scripts/build-css.js` — concatenates all files from `src/tokens/` into a single `src/underlith.tokens.css`
- `package.json` now includes three scripts: `build:tokens`, `build:css`, and `build` (runs both)
- `src/underlith.tokens.css` is now a generated artifact — run `npm run build` to regenerate

### Bug fix: `brand init` orphaned braces

The CSS parser in `brand-init.js` was pushing every `}` to both `brandLines` and `baseLines` arrays, resulting in orphaned closing braces in the output files. Fixed with a context-aware parsing approach that tracks which block is active and routes closing braces to the correct array only. Output CSS is now valid and balanced.

### Documentation

- **Getting Started** — expanded with CLI global install, tokens file copy step, and publish flow. Validated on a live `npm publish`. Two complete independent tutorials: new project and existing project.
- **index.html** — Two Paths section updated with complete setup pipelines for both paths
- Footer standardized across all pages; `.html` extensions removed from internal links
- SEO meta descriptions aligned with current positioning
- New repository docs added:
  - **VISION.md** — the thinking behind each roadmap phase, from what exists today to Q4
  - **STEWARDSHIP.md** — token lifecycle, semver for design tokens, and long-term ownership model
- Updated repository docs:
  - **GOVERNANCE.md** — two levels separated (Underlith core vs brand package); references STEWARDSHIP.md
  - **ROADMAP.md** — Q4 split into Core and Integrations; MCP server added as integration item
  - **CI.md** — updated to reflect brand init and shadcn integration workflows
  - **DESIGNER-GUIDE.md** — change proposals now target `@your-org/tokens`, not Underlith core

### Tokens

- `tokens.json` regenerated and synchronized with current `src/tokens/*`

To regenerate build artifacts: `npm run build`

## 2.0.0 – 2026-03-07

Breaking changes:
- Token prefix standardized to --ul- across all documentation and consumption examples.
- `tokens.json` structure reorganized under the `ul` root key (e.g., `ul.space.4`, `ul.color.text.primary`) — affects JSON consumers.

New and improved:
- Token generator enhanced (`scripts/generate-tokens.js`): deep-merge across files and canonical variable preservation (prevents overrides by variants such as reduced-motion).
- `tokens.json` regenerated from `src/tokens/*`, including durations, easings, delays and composite motion tokens.
- Full documentation refresh (CSS/HTML) to reflect `--ul-` tokens.
- Consumption examples updated: plain CSS, Sass, styled-components and vanilla-extract now use `--ul-`.

Migration notes:
- Update all CSS custom property references to `--ul-*`.
- JSON consumers must update paths (e.g., `color.text.primary` → `ul.color.text.primary`).
- If you map tokens in external tools, re-import using the new structure.

## 1.0.0 – 2026-03-06

Initial public release of Underlith.

Highlights:
- Framework-agnostic design tokens system using CSS variables.
- Token categories for colors, spacing, typography, motion, elevation, opacity, radius/borders, and breakpoints.
- Base CSS and component styles (buttons, forms, grid, table, tabs, etc.).
- Example consumption patterns: plain CSS, Sass, styled-components, and vanilla-extract.
- CLI entry point (`underlith`) and token generation script.
- Documentation pages and assets included under `docs/`.

Notes:
- See `tokens.json` and `src/tokens/*` for token definitions.
- See `src/components/*` for component-level styles and `src/underlith.css` for the core bundle.

