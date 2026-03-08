# Designer Guide — Working with Underlith Tokens

This guide explains how designers should work with the design token system
to keep design and code in sync — without breaking things.

---

## The golden rule

> If you want to change a color, font, or spacing value —  
> **change the token, not the component.**

Tokens are the single source of truth for your org. When a token changes in
`@your-org/tokens`, every component that uses it updates automatically —
across all products your org builds.

---

## How it works

Underlith is the infrastructure. Your org's brand decisions live in a separate,
published package — `@your-org/tokens`.

```
Underlith                     @your-org/tokens
(framework primitives)   →    (your brand layer)   →   Every product
--ul-space-4                  --ul-color-brand-primary    installs it
--ul-radius-md                --ul-color-text             inherits all
--ul-font-size-md             --ul-color-bg-surface       brand decisions
```

When the brand evolves, you update `@your-org/tokens` and publish.
Every product updates on the next `npm update @your-org/tokens`.

---

## What is a token?

A token is a named design decision. Instead of saying "that lime green color",
you say `--ul-color-brand-primary`. Instead of "that small border radius",
you say `--ul-radius-sm`.

Names have meaning. Values can change. The name stays the same.

```
Token name:   --ul-color-brand-primary
Token value:  a specific shade of lime green

If the brand color changes, only the value changes.
The name stays --ul-color-brand-primary everywhere.
```

---

## How to propose a design change

### ✅ Correct way

1. Identify which token needs to change
2. Open an issue or PR on your org's token repository (`@your-org/tokens`)
   with the new value and the reason
3. After approval, publish a new version of the package
4. Every product that runs `npm update @your-org/tokens` gets the change automatically

### ❌ Wrong way

- Sending a message like _"change the button to this shade of green #D3FD54"_
- Editing component styles directly
- Updating Figma without updating the corresponding token in the package

---

## Figma ↔ Token naming convention

Use the same names in Figma variables as in the token package.
This creates a shared vocabulary between design and code.

| Figma variable        | Token                          |
|-----------------------|--------------------------------|
| `color-brand-primary` | `--ul-color-brand-primary`     |
| `color-brand-secondary` | `--ul-color-brand-secondary` |
| `color-text`          | `--ul-color-text`              |
| `color-text-secondary`| `--ul-color-text-secondary`    |
| `color-bg-surface`    | `--ul-color-bg-surface`        |
| `font-sans`           | `--ul-font-sans`               |
| `font-display`        | `--ul-font-display`            |
| `radius-sm`           | `--ul-radius-sm`               |
| `radius-md`           | `--ul-radius-md`               |

When these names match, a designer saying `color-brand-primary` and a developer
saying `--ul-color-brand-primary` are talking about exactly the same thing.

---

## What you can change vs. what you shouldn't

| You want to...                              | Do this                                        |
|---------------------------------------------|------------------------------------------------|
| Change a brand color                        | Update the token in `@your-org/tokens`         |
| Add a new brand color                       | Add a new token in `@your-org/tokens`          |
| Change font family                          | Update `--ul-font-sans` or `--ul-font-display` |
| Adjust border radius globally               | Update `--ul-radius-*` tokens                  |
| Change a color in one specific component    | Talk to the dev — it may need a new semantic alias |
| Change spacing, elevation, or motion values | These are base tokens — open a discussion first |

---

## Signs the process is working

- You refer to colors by token name, not hex values
- Design changes go through `@your-org/tokens`, not component tickets
- Figma variables and code tokens have the same names
- A single publish propagates the change to every product

## Signs something went wrong

- A dev receives "change this button to #D3FD54" instead of a token name
- A component was changed directly without updating the token
- Figma and code have different names for the same color
- Two products have different shades of the "same" brand color

---

## Questions?

Open a discussion on the [Underlith repository](https://github.com/mikaelcarrara/underlith/discussions)
or on your org's token repository.
