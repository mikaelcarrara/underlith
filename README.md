# Underlith

Underlith is a framework-agnostic design tokens system built with CSS Variables. It serves as a **single source of truth** for design decisions, enabling consistent UI foundations across any framework, platform, or tech stack.

Unlike a UI library, Underlith provides the *definitions* (tokens) that drive the UI, ensuring that design intent is preserved from design tools to production code.

**[Documentation](https://mikaelcarrara.github.io/underlith)**

---

## Why Underlith?

*   **Framework Agnostic**: Works with plain CSS, Sass, CSS-in-JS, or any other styling solution.
*   **W3C Aligned**: Follows the W3C Design Tokens Community Group architecture (Definition → Transformation → Source → Consumption).
*   **Automation Ready**: Designed to be consumed by CI pipelines and AI agents for safe, deterministic refactors.
*   **Governance First**: Enforces design rules via strict token contracts, not just conventions.

---

## Core Principles

Underlith operates under strict governance to ensure it remains a reliable foundation.

*   **Single Source of Truth**: The canonical repository is the only place where tokens are defined.
*   **Tokens as Contracts**: Changing a token value is a breaking change.
*   **Automated Validation**: CI ensures no tokens are broken and detects breaking changes automatically.
*   **AI Compatible**: Tokens provide a bounded context that allows AI to generate and refactor UI safely.

For deep dives into our operating model:
*   [**Governance Policy**](./GOVERNANCE.md) - How we manage changes and ownership.
*   [**CI & Automation**](./CI.md) - How automation preserves integrity.
*   [**Contributing**](./CONTRIBUTING.md) - How to propose changes safely.

---

## Architecture & W3C Alignment

Underlith implements the "Source of Truth" layer in the W3C reference architecture:

1.  **Definition**: Design intent defined in design tools.
2.  **Transformation**: Raw data processed into usable artifacts.
3.  **Source of Truth (Underlith)**: The detailed, versioned, and semantic definition of all tokens (CSS variables, JSON).
4.  **Consumption**: Applications (React, Vue, iOS, Android) consuming these tokens.

Read more in [W3C Alignment](./docs/w3c-alignment.html).

---

## Installation

### Via NPM (Recommended)

```bash
npm install @mikaelcarrara/underlith
```

### From Source (local)

- Copy the `src/` folder into your project and import what you need.
- Or preview the documentation locally by opening `docs/index.html` in a browser.

### Manual Download

Clone or download from GitHub:

```bash
git clone https://github.com/mikaelcarrara/underlith.git
```

Or download directly and include in your project.

## Usage

Underlith is designed to be consumed, not imposed. You can use it in multiple ways.  
CSS consumption examples across plain CSS and CSS-in-JS.

### 1. Plain CSS
Import the full system or valid subsets from the package:
```css
/* Import everything */
@import "@mikaelcarrara/underlith/src/underlith.css";

/* Or just tokens */
@import "@mikaelcarrara/underlith/src/tokens/colors.css";
```

### 2. CSS-in-JS (styled-components/emotion)
Use CSS Variables directly in template literals:

```js
const Button = styled.button`
  padding: var(--space-2) var(--space-4);
  background: var(--color-brand-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast) var(--ease-inout);
`;
```

### 3. Motion tokens
Motion tokens: durations, easings, delays and composite tokens; reduced-motion policy.  
Available in `src/tokens/motion.css`.

```css
.tooltip {
  transition: opacity var(--duration-fast) var(--ease-inout);
}

.skeleton {
  animation: var(--motion-skeleton);
}
```

---

## Documentation

*   [**Presentation**](https://mikaelcarrara.github.io/underlith/)
*   [**Getting Started**](https://mikaelcarrara.github.io/underlith/getting-started)
*   [**Tokens Reference**](https://mikaelcarrara.github.io/underlith/tokens)
*   [**Reference Components**](https://mikaelcarrara.github.io/underlith/components)
*   [**Consumption Strategies**](https://mikaelcarrara.github.io/underlith/consumption)
*   [**Automation & AI**](https://mikaelcarrara.github.io/underlith/automation)
*   [**W3C Alignment**](https://mikaelcarrara.github.io/underlith/w3c-alignment)

---

## Accessibility

- Motion respects `prefers-reduced-motion: reduce` by collapsing durations to near-zero.
- Avoid introducing hardcoded cubic-beziers or durations; use `--duration-*` and `--ease-*`.

---

## License

MIT © 2026 Mikael Carrara
