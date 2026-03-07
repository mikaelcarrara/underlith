# Underlith Release Notes

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

