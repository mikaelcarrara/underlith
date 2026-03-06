# CI & Automation

This document defines how **CI, automation, and AI-assisted workflows** interact with Underlith as a **canonical design token system**.

Underlith is designed to operate as a **stable, machine-readable design layer** that enables:
- deterministic CI validation
- safe automation
- AI-assisted UI generation and refactoring

Tokens act as **hard constraints**, not suggestions.

## Role of CI in Underlith

CI is responsible for enforcing governance rules automatically.

Specifically, CI ensures that:
- tokens remain the single source of truth
- breaking changes are detected early
- design decisions are not bypassed by hardcoded values
- automation and AI outputs remain constrained by tokens

CI is **not optional** and **cannot be bypassed**.

## Core principles

- **Tokens are contracts** between design and code
- **Automation must be deterministic**
- **AI operates within constraints**
- **All outputs must be auditable**
- **Human approval remains mandatory for critical changes**

## Canonical inputs and outputs

### Inputs
- `src/tokens/**` — canonical token definitions
- `design-contract.json` — mapping between tokens and design tools
- Source code from consumer projects (for validation)

### Outputs
- `underlith.css` — CSS Custom Properties
- `underlith.json` — token data for tools and agents (optional, when generated)
- `underlith.d.ts` — TypeScript types (optional, when generated)
- CI reports (lint, breaking changes, audits)

## Required CI jobs

### 1. build:tokens

**Purpose**  
Generate all distributable artifacts from the canonical token source.

**Responsibilities**
- Read canonical token definitions
- Generate:
  - `underlith.css`
  - `underlith.json`
  - `underlith.d.ts`
- Ensure deterministic output

**Failure conditions**
- Invalid token schema
- Non-deterministic generation
- Missing artifacts

### 2. lint:tokens

**Purpose**  
Validate the structural and semantic correctness of tokens.

**Validations**
- Schema compliance
- Naming conventions
- Alias resolution
- Deprecated token usage
- Token type consistency
- Motion policy compliance (e.g., ease/duration naming)

**Failure conditions**
- Invalid schema
- Broken references
- Invalid token naming
- Illegal value changes

### 3. breaking-change detection

**Purpose**  
Detect changes that break the token contract.

**Detected as breaking**
- Token removal
- Token rename
- Token value change
- Semantic meaning change

**Behavior**
- CI fails by default
- Requires explicit approval from category owner
- Requires semver major bump

### 4. lint:code (token-aware)

**Purpose**  
Prevent hardcoded design values from entering codebases.

**Checks**
- Detect raw colors, spacing, font sizes, radii
- Compare against allowed token whitelist
- Report violations with suggested replacements
- Detect raw durations or cubic-bezier values; suggest `--duration-*` and `--ease-*`

**Use cases**
- PR validation
- Automated design QA
- Large-scale refactors

### 5. visual-regression (optional but recommended)

**Purpose**  
Ensure that token refactors do not unintentionally change visuals.

**Behavior**
- Compare before/after snapshots
- Validate visual equivalence
- Required for large-scale token migrations

### 6. audit-log

**Purpose**  
Ensure traceability and compliance.

**Logs**
- Token generation
- Refactors executed by automation
- AI-assisted changes
- Versioned outputs

**Requirement**
- Logs must be stored and reviewable

## Example CI job

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
      - run: npm run build:tokens        # generates CSS/JSON/TS as configured
      - run: npm run lint:tokens         # schema + governance checks

  breaking-changes:
    runs-on: ubuntu-latest
    needs: build-tokens
    steps:
      - uses: actions/checkout@v3
      - run: npm run detect:breaking

  validate-code:
    runs-on: ubuntu-latest
    needs: build-tokens
    steps:
      - uses: actions/checkout@v3
      - run: npm run lint:tokens-check

      - run: npm run lint:tokens-check   # token-aware static analysis (no hardcoded values)
    runs-on: ubuntu-latest
    if: needs.breaking-changes.result == 'success'
    steps:
      - uses: actions/checkout@v3
      - run: npm run visual-regression  
```

## AI-assisted workflows

## AI-assisted workflows

Underlith is designed to be safely consumed by AI and automation systems.

Tokens are:

- explicit
- semantic
- framework-agnostic
- machine-readable

This allows AI to operate within a bounded design space.

AI does not decide design.
AI executes within constraints.

---

## Example automation use cases

- Generate UI components constrained by tokens
- Validate CSS for design consistency
- Refactor UI across frameworks without visual drift
- Build design-to-code pipelines driven by intent, not pixels
- Generate controlled variations (themes, brands, A/B tests)


## Token-driven AI prompts (examples)

### Component generation

```
Generate a Card component using only the following design tokens:

- Colors: neutral-0, neutral-200, neutral-900
- Spacing: space-3, space-4, space-5
- Radius: radius-md
- Typography: font-size-md, font-weight-medium

Do not introduce new values.
Output plain HTML and CSS.
```

### Token validation / linting

```
Analyze the following CSS and report any values not mapped to tokens.

Allowed:
- Spacing: space-1 to space-6
- Colors: neutral and brand scales
- Font sizes: font-size-sm, font-size-md, font-size-lg
```

### Cross-framework refactor

```
Refactor this React component to plain HTML and CSS.

Replace all hardcoded values with design tokens.
Preserve visual output.
Do not introduce framework-specific patterns.
```

## Why this works

- Tokens reduce ambiguity
- Design intent becomes explicit
- Automation becomes predictable
- CI remains authoritative
- Human review is preserved

## How CI, AI and Governance connect

- Governance defines the rules
- CI enforces them
- AI operates within them

```
Design intent → Tokens → CI constraints → Automation / AI → Validated output
```

AI is a constrained executor, not a decision-maker.

## Final note

This file is canonical.

- The website may present a summarized version
- The repository uses this document as the source of truth
- Any automation or AI integration must comply with the rules defined here and in [GOVERNANCE.md](./GOVERNANCE.md)
