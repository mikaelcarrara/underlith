# Token Governance

**Executive summary**  
This document defines policies, responsibilities, and procedures to ensure Underlith operates as the **Single Source of Truth** for visual design decisions. It includes principles, change processes, recommended CI jobs, practical templates, and success metrics. Copy this content to `Governance.md` in the canonical repository.

---

## Core principles and policies

- **Tokens as contracts**: tokens are stable contracts between design and code; value changes are breaking by default.  
- **Single source of truth**: the canonical repository is the only authorized place to edit tokens.  
- **Semantic versioning**: adopt **semver**; breaking changes require a major version bump.  
- **Auditability and traceability**: all changes must go through a PR with justification, changelog entry, and assigned owner.  
- **Mandatory human review**: critical changes require approval from the category owners.

---

## Roles and responsibilities

- **Category owners**
  - **Colors** — palette and semantic aliases  
  - **Typography** — typographic scales and related tokens  
  - **Spacing** — spacing scale  
  - **Motion, Elevation, Opacity, Breakpoints** — owners for their respective domains  

- **Integration team** — maintains export pipelines (CSS/JSON/TS) and CI jobs  
- **Design team** — validates semantic mappings and approves changes impacting visual identity
- **QA team** — monitors visual regressions and compliance metrics

---

## Change and deprecation process

1. **Open a PR** with description, category, and assigned owner.  
2. **Run automated validations** (schema validation, breaking-change detection, token-aware lint).  
3. **Review and approval** by category owners and the design team when applicable.  
4. **Merge and release**: publish artifacts `underlith.css`, `underlith.json`, `underlith.d.ts`.  
5. **Deprecation**: mark tokens as `deprecated` in files and changelog; maintain compatibility for **at least two releases** before removal.

---

## Release artifacts

- **underlith.css** — tokens as CSS Custom Properties  
- **underlith.json** — tokens in JSON for tools and agents (optional, when generated)  
- **underlith.d.ts** — TypeScript declaration files for app consumption (optional)  
- **CHANGELOG.md** — change history and deprecation instructions

---

## Accessibility and Motion policy

- All transitions and animations must use `--duration-*` and `--ease-*` variables.
- Prefer composite motion tokens (e.g., `--motion-skeleton`) when available.
- Motion must not be required for core functionality.
- Respect `prefers-reduced-motion: reduce` by collapsing durations to near-zero and limiting iterations.

Example reference implemented in `src/tokens/motion.css`:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-nano: 0ms;
    --duration-micro: 0ms;
    --duration-fast: 0ms;
    --duration-base: 0ms;
    --duration-moderate: 0ms;
    --duration-slow: 0ms;
    --duration-glacial: 0ms;
    --duration-epic: 0ms;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Recommended CI and automation

### Essential jobs

- **build:tokens** — generate CSS/JSON/TS from the canonical source  
- **lint:tokens** — validate schema and detect breaking changes  
- **lint:code** — detect hardcoded values outside the token whitelist  
- **refactor:agent** (optional) — run approved automated refactors  
- **visual-regression** — ensure replacements do not alter appearance  
- **audit-log** — record generations and refactors for review

### Example CI job

```yaml
name: Tokens CI

on:
  pull_request:
    paths:
      - 'src/tokens/**'
      - 'package.json'

jobs:
  build-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build:tokens # generates underlith.css, underlith.json, underlith.d.ts
      - run: npm run test:tokens  # validates schema and breaking changes

  validate-code:
    runs-on: ubuntu-latest
    needs: build-tokens
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint:tokens-check # detects hardcoded values in PRs
      - run: npm run visual-regression
