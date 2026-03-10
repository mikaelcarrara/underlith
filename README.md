# Underlith

[![Quality](https://github.com/mikaelcarrara/underlith/actions/workflows/quality.yml/badge.svg?branch=main)](https://github.com/mikaelcarrara/underlith/actions/workflows/quality.yml)

**Infrastructure for design token governance.**

Underlith turns design decisions into **enforceable systems**.

Most teams rebuild their design system after a stack migration — not because the decisions changed, but because those decisions were never separated from the implementation.

Colors hardcoded in components.  
Spacing defined per framework.  
Design intent scattered across codebases.

When design decisions live inside implementations, they disappear every time the stack changes.

Underlith separates **design decisions from implementation** and gives teams the infrastructure to **govern them across frameworks and platforms**.

One versioned token layer.  
Every framework.  
Every product.

**Underlith is not your source of truth — it's the infrastructure to build one.**

**Documentation**  
https://mikaelcarrara.github.io/underlith

---

# Line Endings (EOL)

To ensure consistent diffs and behavior across operating systems:

- All text files are stored with LF line endings in the repository
- .gitattributes enforces LF for text files and marks binaries
- .editorconfig configures editors to save with LF and common formatting basics
- On Windows, the repository config uses core.autocrlf=input and core.eol=lf to avoid CRLF conversions
- CI validates EOL policy: fails if CRLF is present or if .gitattributes would renormalize files

This keeps the repo clean and prevents spurious EOL diffs in PRs.

# License
# Why Underlith?

- **Framework agnostic** — plain CSS, Tailwind, Sass, CSS-in-JS, or any styling solution
- **Brand layer** — separates identity from framework primitives
- **Publishable** — `@your-org/tokens` becomes the shared source of truth across products
- **W3C aligned** — follows the W3C Design Tokens Community Group architecture
- **Automation ready** — designed for CI pipelines, linters, and AI-assisted migrations

---

# How it works

Underlith separates design decisions from implementation through **three layers and a publishing pipeline**.

```
Base tokens          →   Brand tokens              →   @your-org/tokens
(framework               (your org's                   (published package,
primitives)              identity)                     consumed everywhere)

--ul-space-4              --ul-color-brand-primary      npm install @acme/tokens
--ul-radius-md            --ul-color-text               @import "acme.brand.css"
--ul-duration-fast        --ul-color-bg-surface         change once, update everywhere
```

| Layer | Responsibility | Package |
|-------|---------------|---------|
| **Base tokens** | Raw scales — space, type, radius, motion, opacity | `@mikaelcarrara/underlith` |
| **Brand tokens** | Your organization's identity values | `@your-org/tokens` |
| **Semantic aliases** | Intent over value (`--ul-color-text`, `--ul-color-bg-surface`) | `@your-org/tokens` |

Components consume **semantic aliases**.

When the brand evolves, **aliases change — components don't.**

---

# Getting Started

## Install the CLI

```bash
npm install -g @mikaelcarrara/underlith
```

This makes the `underlith` command available globally.

---

## New project

```bash
# Install package locally to access starter tokens
npm install @mikaelcarrara/underlith

# Copy starter tokens file
cp node_modules/@mikaelcarrara/underlith/src/underlith.tokens.css .

# Scaffold brand package
underlith brand init --org your-npm-username

# Publish package
cd ./@your-npm-username/your-package-name
npm publish --access public
```

Every product in your organization can now install your token package.

---

## Existing project

```bash
# Install CLI
npm install -g @mikaelcarrara/underlith

# Map existing CSS variables
underlith init --shadcn --globals ./styles/globals.css

# Copy tokens file if needed
cp node_modules/@mikaelcarrara/underlith/src/underlith.tokens.css .

# Scaffold brand package
underlith brand init --org your-npm-username

# Publish
cd ./@your-npm-username/your-package-name
npm publish --access public
```

From here, every product installs your token package and inherits your brand decisions automatically.

---

# Usage

Once you have published `@your-org/tokens`, that is the only import your products need.
Underlith is the infrastructure that generated it — your token package is the source of truth.

## Plain CSS

```css
@import "@your-org/tokens/your-org.brand.css";

color: var(--ul-color-text);
gap: var(--ul-space-4);
border-radius: var(--ul-radius-md);
```

---

## Tailwind v4

```css
@import "@your-org/tokens/your-org.brand.css";

@theme {
  --color-brand: var(--ul-color-brand-primary);
  --font-sans: var(--ul-font-sans);
  --radius-md: var(--ul-radius-md);
}
```

---

## Sass / Less

```scss
@import "@your-org/tokens/your-org.brand.css";

@mixin button-primary {
  background: var(--ul-color-brand-primary);
  border-radius: var(--ul-radius-md);
}
```

---

## CSS-in-JS

```js
// globals.css already imports @your-org/tokens — just consume the tokens
const Button = styled.button`
  padding: var(--ul-space-2) var(--ul-space-4);
  background: var(--ul-color-brand-primary);
  color: var(--ul-color-text-inverse);
  border-radius: var(--ul-radius-sm);
  transition: background var(--ul-duration-fast) var(--ul-ease-inout);
`;
```

---

## Motion tokens

```css
.tooltip {
  transition: opacity var(--ul-duration-fast) var(--ul-ease-inout);
}

.skeleton {
  animation: var(--ul-motion-skeleton);
}
```

Motion tokens automatically respect `prefers-reduced-motion: reduce`.

---

## When your brand evolves

Update the token in your brand package, bump the version, and publish.

```bash
# Edit underlith.tokens.css in your @your-org/tokens package
# then:
npm version minor
npm publish --access public
```

Every product inherits the change on `npm update @your-org/tokens`.  
No component changes. No manual propagation.

---

# Documentation

## Site

* Getting Started
* Tokens Reference
* Reference Components
* Consumption Strategies
* W3C Alignment

https://mikaelcarrara.github.io/underlith

---

## Repository

* [Overview](./OVERVIEW.md)
* [Architecture](./ARCHITECTURE.md)
* [Roadmap](./ROADMAP.md)
* [Vision](./VISION.md)
* [Stewardship](./STEWARDSHIP.md)
* [CI & Automation](./CI.md)
* [Governance](./GOVERNANCE.md)
* [Contributing](./CONTRIBUTING.md)
* [Designer Guide](./DESIGNER-GUIDE.md)

---

# License

MIT © 2026 Mikael Carrara
