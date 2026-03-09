# Underlith — Token Governance Infrastructure

## Overview

**Underlith** is an **open-source governance layer for design tokens**.

It transforms design decisions into **versioned, enforceable contracts** that can be consumed by any frontend stack.

Instead of letting UI values drift across products and frameworks, Underlith introduces a **token infrastructure layer** that provides:

- **Versioned token packages** (`@org/tokens`)
- **CLI tooling** for adoption and publishing
- **CI guardrails** against hardcoded design values
- **Automated auditing** of token adoption

The result is **predictable UI evolution at scale**.

---

## The Problem

As organizations scale their products, **UI consistency becomes exponentially harder**.

Common symptoms include:

- Hardcoded design values scattered across repositories  
- Forks of design systems across teams  
- Slow and risky rebrands  
- Design drift between products  
- AI-generated UI that violates brand constraints  

Design systems attempt to solve this problem, but they operate **too high in the stack**.

Component libraries enforce **structure**.

They do **not enforce design values**.

Without governance at the token layer, design decisions remain **informal conventions rather than enforceable contracts**.

As product ecosystems expand across **web, mobile, and marketing platforms**, **design debt becomes infrastructure debt**.

---

## The Approach

Underlith treats design tokens as **infrastructure assets**.

Instead of living only inside design tools or build configurations, tokens become:

- **Versioned**
- **Auditable**
- **Enforceable**

These tokens are published as reusable packages:


@org/tokens


Applications consume these packages directly, ensuring that **design decisions propagate consistently across products**.

---

## Architecture

Underlith is composed of **four main layers**.

---

### Token Infrastructure

Tokens are generated and published as **versioned packages**.

**Current outputs**

- CSS variables

**Planned outputs**

- `underlith.tokens.json` (canonical token structure)
- TypeScript typings for token names

Tokens can represent primitives such as:

- Colors
- Typography
- Spacing
- Motion tokens (durations, easings, reduced-motion policy)

The token package becomes the **single source of truth for UI values**.

---

### CLI Integration

Underlith provides a **CLI designed for low-friction adoption**.

#### Initialize token infrastructure


underlith init


Scans existing CSS variables and maps them to tokens **without rewriting components**.

Example for **shadcn-based projects**:


underlith init --shadcn


---

#### Publish a brand layer


underlith brand init


Separates **infrastructure primitives** from **product-specific brand values**.

Generates:


underlith.base.css
underlith.brand.css


Brand tokens can then be published as:


@org/tokens


---

#### Migrate legacy values *(roadmap)*


underlith migrate


AI-assisted migration from **hardcoded values to tokens**.

---

### Governance Tooling

Automation ensures tokens are **actually used across repositories**.

Planned governance tooling includes:

- **Token-aware linter**
- **Detection of hardcoded design values**
- **Pre-commit hooks**
- **CI templates for token governance**

Additionally:


underlith audit


can scan a repository and report **token adoption coverage**.

---

### Observability *(Future Control Plane)*

At organizational scale, token governance benefits from **visibility**.

A future **control plane** could provide:

- Project registry
- Token version tracking
- Dependency graphs
- Blast radius analysis for token changes

This would allow organizations to understand:

- Which projects depend on which tokens
- Which versions are deployed
- Which changes affect which products

---

## Key Workflows

### Rapid Integration


underlith init


Maps existing CSS variables to tokens **without modifying components**.

---

### Brand Layer Publishing


underlith brand init


Separates infrastructure primitives from brand decisions and **publishes token packages**.

---

### Continuous Governance

CI pipelines enforce **token usage policies** and detect design drift.

---

### Adoption Auditing


underlith audit


Reports **token adoption coverage** across a project.

---

## Technical Differentiators

### Governance-first architecture

Most token tools focus on **formatting or synchronization**.

Underlith focuses on **contracts and enforcement**.

---

### Base vs Brand token layering

Clear separation between:


base tokens
brand tokens


This enables:

- **Multi-brand products**
- **Faster rebranding**
- **Shared design infrastructure**

---

### AI-safe UI infrastructure

By exposing tokens as **versioned contracts**, Underlith enables AI-assisted tools to generate UI **within deterministic constraints**.

---

### Low-friction adoption

Projects can adopt Underlith **without rewriting existing components**.

---

## Market Context

The design token ecosystem is evolving, but most tools still operate at the **format or synchronization layer**, not at the **governance layer**.

Underlith fills this gap.

---

### Industry Direction

Several industry shifts support this approach.

#### CSS-first architecture

The upcoming version of **Tailwind CSS** is moving toward a **CSS-first model**, where design primitives live directly in CSS rather than JavaScript configuration.

This reflects a broader shift in frontend architecture:  
**visual infrastructure should live close to the runtime.**

Underlith follows the same principle.

---

#### Design tools adopting tokens

**Figma** has introduced native support for tokens through **Variables and token APIs**.

Design tools are beginning to treat tokens as **first-class primitives**, but they focus on **authoring**, not governance.

Underlith provides the **missing operational layer between design and production**.

---

#### Automation and AI-generated UI

AI-assisted development is dramatically increasing **UI output velocity**.

Without constraints, this accelerates **design drift**.

By enforcing tokens as **contracts**, Underlith provides guardrails for **deterministic UI generation**.

---

## Roadmap

### Q1 2026 — Foundations

Establish the **core token infrastructure**.

- Motion tokens (durations, easings, delays, reduced-motion policy)
- CSS consumption examples
- `underlith init --shadcn`
- JSON Schema draft for token structure
- `underlith.tokens.json` export

---

### Q2 2026 — Brand Layer

Separate **infrastructure tokens from brand decisions**.

- `underlith.base.css`
- `underlith.brand.css`
- `underlith brand init`
- Publishable `@org/tokens` packages
- Starter templates for common stacks

---

### Q3 2026 — Automation

Introduce **governance tooling**.

- Token-aware linter
- Detection of hardcoded values
- Pre-commit hooks
- CI templates
- `underlith audit`

---

### Q4 2026 — Ecosystem

Expand **developer experience and integrations**.

#### Core

- TypeScript types for token names
- Visual regression harness
- `underlith migrate` *(AI-assisted)*

---

#### Integrations

##### Figma


tokens.json ↔ Figma Variables ↔ @org/tokens


Bidirectional token sync between **design tooling and production tokens**.

---

##### MCP

An MCP server bundled in the token package, allowing AI tools and editors to query **organization tokens directly**.

---

## Closing

Underlith transforms design tokens from **configuration into governed infrastructure**.

Instead of relying on documentation and conventions, teams gain:

- **Enforceable UI contracts**
- **Deterministic design automation**
- **Scalable brand consistency**

Design systems standardize **components**.

**Underlith standardizes the decisions behind them.**