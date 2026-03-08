const fs = require('fs');
const path = require('path');

function buildCssBundle() {
  try {
    const tokensDir = path.join(__dirname, '../src/tokens');
    const outFile = path.join(__dirname, '../src/underlith.tokens.css');

    if (!fs.existsSync(tokensDir)) {
      console.error(`❌ Tokens directory not found: ${tokensDir}`);
      process.exit(1);
    }

    const entries = fs
      .readdirSync(tokensDir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.endsWith('.css'))
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b, 'en'));

    if (entries.length === 0) {
      console.error(`❌ No .css files found in ${tokensDir}`);
      process.exit(1);
    }

    const parts = [];
    for (const file of entries) {
      const p = path.join(tokensDir, file);
      const content = fs.readFileSync(p, 'utf8');
      parts.push(content.trimEnd());
    }

    const bundle = parts.join('\n\n') + '\n';

    const outDir = path.dirname(outFile);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outFile, bundle, 'utf8');
    console.log('✅ Generated underlith.tokens.css');
  } catch (err) {
    console.error('❌ Error building CSS tokens bundle:', err);
    process.exit(1);
  }
}

buildCssBundle();
