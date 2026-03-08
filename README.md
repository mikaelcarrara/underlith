# Underlith

Your design system shouldn't break every time you switch frameworks.

Most teams rebuild their design system from scratch after a stack migration — not because the design decisions changed, but because those decisions were never separated from the implementation. Colors hardcoded in components. Spacing defined per-framework. No single place where design intent actually lives.

**Underlith is not your source of truth — it's the infrastructure to build one.**

A framework-agnostic token system built on CSS Variables, Underlith gives you the tools to extract your brand decisions into a versioned, publishable package that survives framework changes, platform expansions, and team growth. The implementation is yours. The foundation is shared.

**[Documentation](https://mikaelcarrara.github.io/underlith)**

---

## How it works

Underlith organizes design decisions into three layers and a publishing pipeline:

```
Base tokens          →   Brand tokens         →   @your-org/tokens
(framework           →   (your org's          →   (published package,
 primitives)         →    identity)            →   consumed everywhere)
--ul-space-4              --ul-color-brand-primary     npm install @acme/tokens
--ul-radius-md            --ul-color-text              @import "acme.brand.css"
--ul-duration-fast        --ul-color-bg-surface        change once, update everywhere
```

**New project — 2 commands:**
```bash
underlith brand init --org acme   # scaffold @acme/tokens package
npm publish --access public       # publish brand layer
```

**Existing project — 3 commands:**
```bash
underlith init --shadcn --globals ./styles/globals.css   # map existing variables
underlith brand init --org acme                          # extract brand layer
npm publish --access public                              # publish
```

From here, every product your org builds installs `@acme/tokens` and inherits your brand decisions automatically.

---

## Installation

```bash
npm install @mikaelcarrara/underlith
```

Or clone from source:

```bash
git clone https://github.com/mikaelcarrara/underlith.git
```

---

## Usage

### Plain CSS

```css
@import "@mikaelcarrara/underlith/src/underlith.tokens.css";

color: var(--ul-color-text);
gap: var(--ul-space-4);
border-radius: var(--ul-radius-md);
```

### Tailwind v4

```css
@import "@mikaelcarrara/underlith/src/underlith.tokens.css";

@theme {
  --color-brand: var(--ul-color-brand-primary);
  --radius-md: var(--ul-radius-md);
}
```

```html
<div class="text-brand rounded-md">...</div>
```

### Sass / Less

```scss
@import "@mikaelcarrara/underlith/src/underlith.tokens.css";

$color-text: var(--ul-color-text);

@mixin button-primary {
  background: var(--ul-color-brand-primary);
  border-radius: var(--ul-radius-md);
}
```

### CSS-in-JS

```js
const Button = styled.button`
  padding: var(--ul-space-2) var(--ul-space-4);
  background: var(--ul-color-brand-primary);
  color: var(--ul-color-text-inverse);
  border-radius: var(--ul-radius-sm);
  transition: background var(--ul-duration-fast) var(--ul-ease-inout);
`;
```

### With your brand package

```css
@import "@acme/tokens/acme.brand.css";

/* All --ul-* tokens now carry acme brand values */
color: var(--ul-color-text);
background: var(--ul-color-brand-primary);
```

---

## Token layers

| Layer | Responsibility | Lives in |
|-------|---------------|----------|
| Base tokens | Raw scales — space, type, radius, motion, opacity | `@mikaelcarrara/underlith` |
| Brand tokens | Your org's color palette and identity values | `@your-org/tokens` |
| Semantic aliases | Intent over value — `--ul-color-text`, `--ul-color-bg-surface` | `@your-org/tokens` |

Semantic aliases are what components consume. When your brand evolves, you update the alias. Components never change.

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

Motion automatically respects `prefers-reduced-motion: reduce`.

---

## Why Underlith?

- **Framework agnostic** — plain CSS, Tailwind, Sass, CSS-in-JS, or any styling solution
- **Brand layer** — separates your identity from framework primitives at generation time
- **Publishable** — `@your-org/tokens` becomes the shared source of truth across every product
- **W3C aligned** — follows the W3C Design Tokens Community Group architecture
- **Automation ready** — designed for CI pipelines, linters, and AI-assisted migrations

---

## Documentation

- [**Getting Started**](https://mikaelcarrara.github.io/underlith/getting-started)
- [**Tokens Reference**](https://mikaelcarrara.github.io/underlith/tokens)
- [**Reference Components**](https://mikaelcarrara.github.io/underlith/components)
- [**Consumption Strategies**](https://mikaelcarrara.github.io/underlith/consumption)
- [**W3C Alignment**](https://mikaelcarrara.github.io/underlith/w3c-alignment)
- [**Architecture**](./ARCHITECTURE.md)
- [**Roadmap**](./ROADMAP.md)

---

## License

MIT © 2026 Mikael Carrara
