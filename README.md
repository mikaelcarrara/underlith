# Underlith

Underlith doesn't replace your design decisions — it gives you the infrastructure to own them.

Most teams rebuild their design system from scratch after a stack migration — not because the design decisions changed, but because those decisions were never separated from the implementation. Colors hardcoded in components. Spacing defined per-framework. No single place where design intent actually lives.

By separating design decisions from implementation, Underlith ensures your design system doesn't break every time you migrate stacks.

**Underlith is not your source of truth — it's the infrastructure to build one.**

**[Documentation](https://mikaelcarrara.github.io/underlith)**

---

## Why Underlith?

- **Framework agnostic** — plain CSS, Tailwind, Sass, CSS-in-JS, or any styling solution
- **Brand layer** — separates your identity from framework primitives at generation time
- **Publishable** — `@your-org/tokens` becomes the shared source of truth across every product
- **W3C aligned** — follows the W3C Design Tokens Community Group architecture
- **Automation ready** — designed for CI pipelines, linters, and AI-assisted migrations

---

## How it works

Underlith separates design decisions from implementation across three layers and a publishing pipeline:

```
Base tokens          →   Brand tokens              →   @your-org/tokens
(framework               (your org's                   (published package,
 primitives)              identity)                     consumed everywhere)
--ul-space-4              --ul-color-brand-primary      npm install @acme/tokens
--ul-radius-md            --ul-color-text               @import "acme.brand.css"
--ul-duration-fast        --ul-color-bg-surface         change once, update everywhere
```

| Layer | Responsibility | Lives in |
|-------|---------------|----------|
| Base tokens | Raw scales — space, type, radius, motion, opacity | `@mikaelcarrara/underlith` |
| Brand tokens | Your org's color palette and identity values | `@your-org/tokens` |
| Semantic aliases | Intent over value — `--ul-color-text`, `--ul-color-bg-surface` | `@your-org/tokens` |

Semantic aliases are what components consume. When your brand evolves, you update the alias. Components never change.

---

## Getting started

### Install the CLI

```bash
npm install -g @mikaelcarrara/underlith
```

This makes the `underlith` command available globally. Run this once — then use the CLI from any project.

### New project

```bash
# Install package locally to access the starter tokens file
npm install @mikaelcarrara/underlith

# Copy starter tokens to your project root — edit brand values before next step
cp node_modules/@mikaelcarrara/underlith/src/underlith.tokens.css .

# Scaffold your brand package — use your npm username as --org
underlith brand init --org your-npm-username

# cd into the exact path the command printed, then publish
cd ./@your-npm-username/your-package-name
npm publish --access public
```

### Existing project

```bash
# Install CLI globally
npm install -g @mikaelcarrara/underlith

# Map existing variables — no component rewrites
underlith init --shadcn --globals ./styles/globals.css

# Copy tokens file if not present
cp node_modules/@mikaelcarrara/underlith/src/underlith.tokens.css .

# Scaffold brand package
underlith brand init --org your-npm-username

# cd into the exact path the command printed, then publish
cd ./@your-npm-username/your-package-name
npm publish --access public
```

From here, every product your org builds installs `@your-npm-username/your-package-name` and inherits your brand decisions automatically.

### Install the core

```bash
npm install @mikaelcarrara/underlith
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

### Motion tokens

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

## Documentation

### Site
- [**Getting Started**](https://mikaelcarrara.github.io/underlith/getting-started)
- [**Tokens Reference**](https://mikaelcarrara.github.io/underlith/tokens)
- [**Reference Components**](https://mikaelcarrara.github.io/underlith/components)
- [**Consumption Strategies**](https://mikaelcarrara.github.io/underlith/consumption)
- [**W3C Alignment**](https://mikaelcarrara.github.io/underlith/w3c-alignment)

### Repository
- [**Architecture**](./ARCHITECTURE.md)
- [**Roadmap**](./ROADMAP.md)
- [**Vision**](./VISION.md)
- [**Stewardship**](./STEWARDSHIP.md)
- [**CI & Automation**](./CI.md)
- [**Governance**](./GOVERNANCE.md)
- [**Contributing**](./CONTRIBUTING.md)
- [**Designer Guide**](./DESIGNER-GUIDE.md)

---

## License

MIT © 2026 Mikael Carrara
