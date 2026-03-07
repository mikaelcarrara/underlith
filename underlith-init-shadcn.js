#!/usr/bin/env node

/**
 * underlith init --shadcn
 *
 * Integrates Underlith into a shadcn/ui + Tailwind project.
 *
 * What it does:
 *   1. Reads the existing globals.css to extract shadcn CSS Variables
 *   2. Maps them to Underlith semantic token names
 *   3. Generates underlith.tokens.css with the Underlith token definitions
 *   4. Patches globals.css so shadcn variables point to Underlith tokens
 *   5. Generates UNDERLITH.md documenting the integration
 *
 * Zero component rewrites — only globals.css is patched.
 *
 * Usage:
 *   node underlith-init-shadcn.js --globals ./src/app/globals.css
 *   node underlith-init-shadcn.js --globals ./src/styles/globals.css --dry-run
 */

import fs   from "fs";
import path from "path";
import { parseArgs } from "util";

// ── CLI args ──────────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    globals:  { type: "string", default: "./src/app/globals.css" },
    output:   { type: "string", default: "./src/styles/underlith.tokens.css" },
    "dry-run": { type: "boolean", default: false },
    "no-ai":   { type: "boolean", default: false },
  },
});

const globalsPath = path.resolve(args.globals);
const outputPath  = path.resolve(args.output);
const dryRun      = args["dry-run"];
const noAI        = args["no-ai"];
const apiKey      = process.env.ANTHROPIC_API_KEY && String(process.env.ANTHROPIC_API_KEY).trim();
const model       = process.env.ANTHROPIC_MODEL && String(process.env.ANTHROPIC_MODEL).trim() || "claude-3-sonnet-20240229";

if (!fs.existsSync(globalsPath)) {
  console.error(`globals.css not found at: ${globalsPath}`);
  console.error("Use --globals <path> to specify its location.");
  process.exit(1);
}

// ── Read globals.css ──────────────────────────────────────────────────────────

const globalsContent = fs.readFileSync(globalsPath, "utf8");

// Extract all CSS variable declarations from :root and .dark blocks
const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
const extractedVars = {};
let match;
while ((match = varRegex.exec(globalsContent)) !== null) {
  extractedVars[match[1]] = match[2].trim();
}

console.log(`\n🔍 Found ${Object.keys(extractedVars).length} CSS variables in ${args.globals}\n`);

// ── Map variables to Underlith tokens ────────────────────────────────────────

const systemPrompt = `
You are a design token architect specializing in Underlith integration.

Given a list of shadcn/ui CSS variables, your job is to:
1. Map each variable to a semantic Underlith token name following the convention:
   --color-[category]-[variant], --space-[scale], --radius-[size], --font-[property]-[variant]
2. Return ONLY a valid JSON object — no markdown, no explanation, no extra text.

JSON format:
{
  "tokens": {
    "--underlith-token-name": "value"
  },
  "mapping": {
    "--shadcn-var": "var(--underlith-token-name)"
  }
}

Rules:
- Use semantic names, not utility names. E.g: --color-surface-default, not --color-white
- Colors from shadcn use HSL format (e.g. "0 0% 100%") — keep the value as-is
- Group by category: color, space, radius, font, shadow
- If a variable cannot be mapped semantically, include it in mapping pointing to itself
`.trim();

const userPrompt = `
Map these shadcn/ui CSS variables to Underlith semantic tokens:

${JSON.stringify(extractedVars, null, 2)}
`.trim();

let tokens, mapping;

const useAI = !noAI && !!apiKey;

if (useAI) {
  console.log("🤖 Mapeando variáveis para tokens Underlith via Claude...\n");
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Falha na API da Anthropic, usando mapeamento local.\nDetalhes:", errText);
    } else {
      const data = await response.json();
      const raw  = data.content.map(b => b.text || "").join("").trim();
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        tokens = parsed.tokens;
        mapping = parsed.mapping;
      } catch {
        console.warn("Resposta da Claude não pôde ser parseada. Usando mapeamento local.");
      }
    }
  } catch (e) {
    console.warn("Erro ao contatar Anthropic. Usando mapeamento local.");
  }
} else {
  if (!apiKey && !noAI) {
    console.warn("ANTHROPIC_API_KEY não encontrada. Usando mapeamento local. Defina ANTHROPIC_API_KEY para habilitar IA.");
  } else if (noAI) {
    console.log("IA desabilitada (--no-ai). Usando mapeamento local.\n");
  }
}

if (!tokens || !mapping) {
  tokens = {};
  mapping = {};
  for (const [name, value] of Object.entries(extractedVars)) {
    const tokenName = `--ul-${name}`;
    tokens[tokenName] = value;
    mapping[name] = `var(${tokenName})`;
  }
}

const mappedTokens = tokens;
const mappedMapping = mapping;

// ── Generate underlith.tokens.css ─────────────────────────────────────────────

const tokenLines = Object.entries(mappedTokens)
  .map(([name, value]) => `  ${name}: ${value};`)
  .join("\n");

const underlithCSS = `/**
 * Underlith Tokens — generated by underlith init --shadcn
 * Single source of truth for all design decisions.
 *
 * Edit values here. All shadcn components update automatically.
 * DO NOT edit shadcn variables directly — edit tokens here instead.
 */

:root {
${tokenLines}
}
`;

// ── Patch globals.css ─────────────────────────────────────────────────────────

let patchedGlobals = globalsContent;

// Replace each shadcn variable value with var(--underlith-token)
for (const [shadcnVar, underlithRef] of Object.entries(mappedMapping)) {
  if (underlithRef === `var(--${shadcnVar})`) continue; // skip unmapped
  const regex = new RegExp(`(--${shadcnVar}\\s*:\\s*)[^;]+;`, "g");
  patchedGlobals = patchedGlobals.replace(regex, `$1${underlithRef};`);
}

// Add import at top if not already present
const importLine = `@import "./underlith.tokens.css";\n`;
if (!patchedGlobals.includes("underlith.tokens.css")) {
  patchedGlobals = importLine + patchedGlobals;
}

// ── Generate UNDERLITH.md ─────────────────────────────────────────────────────

const mappingTable = Object.entries(mappedMapping)
  .filter(([k, v]) => v !== `var(--${k})`)
  .map(([k, v]) => `| \`--${k}\` | \`${v}\` |`)
  .join("\n");

const underlithMD = `# Underlith Integration

This project uses [Underlith](https://mikaelcarrara.github.io/underlith/) as the 
single source of truth for design tokens.

## How it works

Underlith tokens are defined in \`src/styles/underlith.tokens.css\`.  
shadcn/ui CSS variables in \`globals.css\` point to these tokens.  
All components continue to work without any changes.

\`\`\`
Underlith tokens  →  shadcn variables  →  components
(edit here)           (auto-updated)       (unchanged)
\`\`\`

## Token mapping

| shadcn variable | Underlith token |
|----------------|-----------------|
${mappingTable}

## Updating design values

Edit \`underlith.tokens.css\` — never edit shadcn variables directly.

\`\`\`css
/* Change the primary color across ALL projects: */
--color-brand-primary: 217 91% 60%;
\`\`\`

## Sharing tokens across projects

\`\`\`bash
npm install @mikaelcarrara/underlith
\`\`\`

\`\`\`css
@import "@mikaelcarrara/underlith/src/underlith.tokens.css";
\`\`\`
`;

// ── Output ────────────────────────────────────────────────────────────────────

console.log("📋 Token mapping preview:\n");
for (const [k, v] of Object.entries(mappedMapping).slice(0, 8)) {
  console.log(`  --${k.padEnd(30)} → ${v}`);
}
if (Object.keys(mappedMapping).length > 8) {
  console.log(`  ... and ${Object.keys(mappedMapping).length - 8} more\n`);
}

if (dryRun) {
  console.log("\n🔍 Dry run — no files written.\n");
  console.log("=== underlith.tokens.css ===\n");
  console.log(underlithCSS);
  process.exit(0);
}

// Write files
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, underlithCSS, "utf8");
fs.writeFileSync(globalsPath, patchedGlobals, "utf8");
fs.writeFileSync(path.join(path.dirname(globalsPath), "../../UNDERLITH.md"), underlithMD, "utf8");

console.log(`\n✅ Done!\n`);
console.log(`   ${outputPath} — Underlith token definitions`);
console.log(`   ${globalsPath} — patched to use Underlith tokens`);
console.log(`   UNDERLITH.md — integration documentation\n`);
console.log(`Next: review the token values in underlith.tokens.css and adjust to your brand.\n`);
