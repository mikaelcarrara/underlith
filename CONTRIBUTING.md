# Contributing to Underlith

Thank you for your interest in contributing to **Underlith**.  
This document explains **how to contribute safely and consistently** to the canonical design tokens repository.

Underlith operates as a **single source of truth** for visual decisions.  
All contributions must follow the governance rules defined in [`GOVERNANCE.md`](./GOVERNANCE.md).

---

## Scope of this repository

This repository is **not** an application or UI library.

It contains:
- Canonical design tokens
- Token schemas and metadata
- Export pipelines (CSS / JSON / TypeScript)
- CI automation for validation and governance

It does **not** contain:
- HTML templates
- Components
- Application-specific styles
- Product UI implementations

If you want to showcase usage, create a **separate repository** that consumes Underlith.

---

## Before you contribute

Please make sure you have read:
- [`README.md`](./README.md)
- [`GOVERNANCE.md`](./GOVERNANCE.md)

If you are unsure whether a change should live here, open an **Issue** before submitting a PR.

---

## What you can contribute

You may contribute:
- New tokens (following schema and naming rules)
- Adjustments to existing tokens (with justification)
- Token deprecations
- Improvements to export pipelines
- CI validation enhancements
- Documentation related to tokens and governance

You may **not**:
- Introduce hardcoded visual values into artifacts
- Change token values without semantic justification
- Bypass CI or governance checks
- Introduce breaking changes without approval

---

## Token principles (summary)

All contributions must respect these principles:

- **Tokens are contracts** between design and code
- **Value changes are breaking by default**
- **Semantic tokens are preferred over raw values**
- **The canonical source is the only editable source**
- **All changes must be traceable and auditable**

For details, see `GOVERNANCE.md`.

---

## Branching and workflow

1. Fork the repository
2. Create a branch from `main`
   ```bash
   git checkout -b feat/tokens-color-alias
   ```
3. Make your changes
4. Ensure all checks pass
5. Open a Pull Request

## Pull Request requirements

Every PR must include:

- Clear description of what changed and why
- Token category clearly identified
- Assigned category owner
- Updated examples if consumption changes
- Changelog entry
- CI checks passing
- Motion/accessibility compliance (respects `prefers-reduced-motion`, uses `--duration-*` and `--ease-*`)

PRs that do not meet these requirements will be blocked.

## Pull Request template

All PRs must follow this structure:

```markdown
# Title
Short summary of the token change

## Category
- [ ] colors
- [ ] typography
- [ ] spacing
- [ ] motion
- [ ] elevation
- [ ] breakpoints
- [ ] semantic-aliases

## Description
Explain what changed and why.

## Impact
List affected products or repositories.
Specify if this is a breaking change.

## Owner
@owner-username

## Checklist
- [ ] Schema validated
- [ ] Breaking change check executed
- [ ] Changelog updated
- [ ] Deprecation marked (if applicable)
- [ ] Visual regression tests passed (if applicable)
```

## Token deprecation policy

When deprecating a token:

- Mark it as deprecated in the canonical source
- Add a note in CHANGELOG.md
- Provide a recommended replacement
- Keep the token available for at least two releases

Do not remove deprecated tokens without a major version bump

## CI and validation

All PRs automatically run token-aware CI jobs, including:

- Schema validation
- Breaking change detection
- Token linting
- Optional visual regression tests
- Static checks to prevent hardcoded durations/easings and enforce motion tokens

If CI fails:

- Fix the issue
- Or justify the change and request owner approval

Bypassing CI is not allowed.

## Design synchronization

If your change impacts design decisions:

- Ensure it aligns with design-contract.json
- Coordinate with design owners
- Provide references to design tool styles when applicable

Tokens must remain consistent across design and code.

## Review and approval

Approval rules:

- Non-breaking changes: category owner approval
- Breaking changes: category owner + design approval
- Critical changes: additional review may be required

Expected SLA:

- Non-critical changes: up to 3 business days
- Breaking changes: defined per team agreement

## Release process (maintainers only)

After merge:

- Tokens are rebuilt into CSS, JSON and TypeScript artifacts
- Version is bumped according to semver
- Release notes are published
- Artifacts are distributed to consumers

Contributors should not publish releases unless explicitly authorized.

## Code of conduct

All contributors are expected to:

- Communicate respectfully
- Provide constructive feedback
- Respect design and engineering constraints

Unprofessional behavior may result in blocked contributions.

## Questions or help

If you need help:

- Open an Issue
- Reach out to a category owner
- Consult GOVERNANCE.md for policy clarification

By contributing to Underlith, you agree to follow this document and the governance rules that keep the system stable, auditable and scalable.
