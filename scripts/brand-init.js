const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Console helpers
const log = (msg) => console.log(`[underlith] ${msg}`);
const success = (msg) => console.log(`[underlith:ok] ${msg}`);
const warn = (msg) => console.log(`[underlith:warn] ${msg}`);
const error = (msg) => console.error(`[underlith:error] ${msg}`);

// Argument parsing helper
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = value;
    }
  }
  return parsed;
}

// Interactive prompt helper
function ask(question, defaultValue) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const prompt = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

function validateOrgName(name) {
  return /^[a-z0-9-]+$/.test(name);
}

function cleanupEmptyBlocks(content) {
  // Removes empty :root { } blocks including whitespace
  // Regex explains:
  // :root\s*\{     -> matches :root { with optional space
  // [\s\r\n]*      -> matches any whitespace/newlines inside
  // \}             -> matches closing brace
  return content.replace(/:root\s*\{[\s\r\n]*\}/g, '').trim();
}

async function main() {
  const args = parseArgs();

  // 1. Collect inputs
  let tokensPath = args.tokens || './underlith.tokens.css';
  let orgName = args.org;
  let pkgName = args.name;
  let outDir = args.out;

  // Interactive mode if missing args
  if (!orgName || !pkgName) {
    if (!orgName) {
      orgName = await ask('Organization name (e.g. acme)');
    }
    while (!validateOrgName(orgName)) {
      error('Invalid organization name. Use lowercase letters, numbers, and hyphens only.');
      orgName = await ask('Organization name (e.g. acme)');
    }

    if (!pkgName) {
      pkgName = await ask('Package name (e.g. tokens)');
    }
    
    if (!tokensPath && !fs.existsSync(tokensPath)) {
        tokensPath = await ask('Path to tokens file', './underlith.tokens.css');
    }
  }
  
  // Default outDir if not provided
  if (!outDir) {
    outDir = `./@${orgName}/${pkgName}`;
  }

  // 2. Validate inputs
  if (!fs.existsSync(tokensPath)) {
    error(`Tokens file not found at: ${tokensPath}`);
    process.exit(1);
  }

  log(`Reading tokens from ${tokensPath}`);
  
  // 3. Read and parse tokens
  const cssContent = fs.readFileSync(tokensPath, 'utf8');
  const lines = cssContent.split('\n');
  
  const brandLines = [];
  const baseLines = [];
  
  let isBrandBlock = false; // determined by comments
  let insideBrandBlock = false;
  let insideBaseBlock = false;
  let brandDepth = 0;
  let baseDepth = 0;
  let brandCount = 0;
  let baseCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Comment markers define block intent going forward
    if (trimmed.startsWith('/*')) {
      const isBrandComment = trimmed.toLowerCase().includes('brand');
      isBrandBlock = !!isBrandComment;
      if (isBrandComment) {
        brandLines.push(line);
      } else {
        baseLines.push(line);
      }
      continue;
    }
    
    // Open root block only on the active side
    if (trimmed.startsWith(':root')) {
      if (isBrandBlock) {
        brandLines.push(line);
        brandDepth += (trimmed.includes('{') ? 1 : 0);
        insideBrandBlock = true;
        insideBaseBlock = false;
      } else {
        baseLines.push(line);
        baseDepth += (trimmed.includes('{') ? 1 : 0);
        insideBaseBlock = true;
        insideBrandBlock = false;
      }
      continue;
    }
    
    // Closing brace: send only to the array with an open block
    if (trimmed === '}') {
      if (brandDepth > 0) {
        brandLines.push(line);
        brandDepth--;
        if (brandDepth === 0) insideBrandBlock = false;
      } else if (baseDepth > 0) {
        baseLines.push(line);
        baseDepth--;
        if (baseDepth === 0) insideBaseBlock = false;
      } else {
        // No active block: default to base for safety
        baseLines.push(line);
      }
      continue;
    }
    
    // Token lines
    if (trimmed.startsWith('--')) {
      const tokenName = trimmed.split(':')[0];
      const isOrgScoped = tokenName.includes(orgName);
      const isBrandNamed = tokenName.includes('brand');
      
      if (insideBrandBlock || isBrandBlock || isOrgScoped || isBrandNamed) {
        brandLines.push(line);
        brandCount++;
      } else {
        baseLines.push(line);
        baseCount++;
      }
      continue;
    }
    
    // Empty line: push to currently active side
    if (trimmed === '') {
      if (insideBrandBlock) {
        brandLines.push(line);
      } else if (insideBaseBlock || (!insideBrandBlock && !insideBaseBlock && !isBrandBlock)) {
        baseLines.push(line);
      } else {
        // default to brand if brand block is signaled but not open yet
        brandLines.push(line);
      }
      continue;
    }
    
    // Other content (copy to the active side)
    if (insideBrandBlock || isBrandBlock) {
      brandLines.push(line);
    } else {
      baseLines.push(line);
    }
  }

  log(`Found ${brandCount} brand tokens, ${baseCount} base tokens`);
  
  if (brandCount === 0) {
      warn('No brand tokens found. Check your org name or "brand" keywords.');
      process.exit(0);
  }

  log(`Scaffolding @${orgName}/${pkgName}...`);

  // 4. Generate Output
  const fullOutDir = path.resolve(process.cwd(), outDir);
  
  if (fs.existsSync(fullOutDir)) {
      warn(`Directory ${outDir} already exists. Overwriting...`);
  } else {
      fs.mkdirSync(fullOutDir, { recursive: true });
  }

  // Files content
  const brandCssName = `${orgName}.brand.css`;
  const baseCssName = `${orgName}.base.css`;
  
  const packageJson = {
    name: `@${orgName}/${pkgName}`,
    version: "1.0.0",
    description: `Brand design tokens for ${orgName} — built on Underlith`,
    main: brandCssName,
    files: [brandCssName, baseCssName],
    keywords: ["design-tokens", "css-variables", "underlith", orgName],
    peerDependencies: {
        "@mikaelcarrara/underlith": ">=1.0.0"
    },
    license: "MIT"
  };

  const readme = `# @${orgName}/${pkgName}

Brand design tokens for ${orgName}.

## Installation

\`\`\`bash
npm install @${orgName}/${pkgName}
\`\`\`

## Usage

\`\`\`css
@import "@${orgName}/${pkgName}/${brandCssName}";
\`\`\`

> Built on [Underlith](https://github.com/mikaelcarrara/underlith)
`;

  // Write files with cleanup
  fs.writeFileSync(path.join(fullOutDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  success(`@${orgName}/${pkgName}/package.json`);
  
  fs.writeFileSync(path.join(fullOutDir, 'README.md'), readme);
  success(`@${orgName}/${pkgName}/README.md`);
  
  const finalizeCss = (arr) => {
    const content = cleanupEmptyBlocks(arr.join('\n')).trim();
    if (!content) return content;
    if (content.includes(':root')) return content;
    return `:root {\n${content}\n}`;
  };
  const finalBrandCss = finalizeCss(brandLines);
  fs.writeFileSync(path.join(fullOutDir, brandCssName), finalBrandCss + '\n');
  success(`@${orgName}/${pkgName}/${brandCssName}`);
  
  const finalBaseCss = finalizeCss(baseLines);
  fs.writeFileSync(path.join(fullOutDir, baseCssName), finalBaseCss + '\n');
  success(`@${orgName}/${pkgName}/${baseCssName}`);

  // 5. Next steps
  console.log('\nNext steps:');
  console.log(`  1. cd ${outDir}`);
  console.log(`  2. Review ${brandCssName}`);
  console.log('  3. npm publish --access public');
}

main().catch(err => {
    error(err.message);
    process.exit(1);
});
