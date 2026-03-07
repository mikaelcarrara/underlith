# Designer Guide — Working with Underlith Tokens

This guide explains how designers should work with the Kobana design system
to keep design and code in sync — without breaking things.

---

## The golden rule

> If you want to change a color, font, or spacing value —  
> **change the token, not the component.**

Tokens are the single source of truth. When a token changes, every component
that uses it updates automatically — across all Kobana products.

---

## What is a token?

A token is a named design decision. Instead of saying "that green button color",
you say `kobana-lime`. Instead of "that small border radius", you say `radius-sm`.

Names have meaning. Values can change. The name stays the same.

```
Token name:   kobana-lime
Token value:  73 99% 66%  (a specific shade of lime green)
```

If the brand color changes, only the value changes — the name stays `kobana-lime`
everywhere.

---

## How to propose a design change

### ✅ Correct way

1. Identify which token needs to change
2. Open an issue or PR on the [Kobana UI repository](https://github.com/universokobana/kobana-ui)
   with the new value and the reason
3. After merge, the token is updated in Kobana UI

### ❌ Wrong way

- Sending a Slack message like _"change the button to this shade of green"_
- Editing component styles directly
- Updating Figma without updating the corresponding token

---

## Figma ↔ Token naming convention

Use the same names in Figma variables as in Underlith tokens.
This creates a shared vocabulary between design and code.

| Figma variable      | Underlith token         |
|---------------------|-------------------------|
| `kobana-lime`       | `--ul-kobana-lime`      |
| `kobana-purple`     | `--ul-kobana-purple`    |
| `kobana-black`      | `--ul-kobana-black`     |
| `font-sans`         | `--ul-font-sans`        |
| `font-display`      | `--ul-font-display`     |
| `radius-sm`         | `--ul-radius-sm`        |
| `radius-md`         | `--ul-radius-md`        |

When these names match, a designer saying `kobana-lime` and a developer saying
`--ul-kobana-lime` are talking about exactly the same thing.

---

## What you can change vs. what you shouldn't

| You want to...                        | Do this                              |
|---------------------------------------|--------------------------------------|
| Change a brand color                  | Update the token in Underlith        |
| Add a new brand color                 | Add a new token in Underlith         |
| Change font family                    | Update `--ul-font-sans` or `--ul-font-display` |
| Adjust border radius globally         | Update `--ul-radius`                 |
| Change a color in one specific component | Talk to the dev — it may need a new token |

---

## Signs the process is working

- You refer to colors by token name, not hex values
- Design changes go through the token layer, not component tickets
- Figma variables and code tokens have the same names

## Signs something went wrong

- A dev receives "change this button to #D3FD54" instead of "update kobana-lime"
- A component was changed directly without updating the token
- Figma and code have different names for the same color

---

## Questions?

Open a discussion on the [Underlith repository](https://github.com/mikaelcarrara/underlith/discussions).
