#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
    console.log('Usage: underlith <command>');
    console.log('Commands:');
    console.log('  init      Initialize a new Underlith configuration');
    console.log('  generate  Generate tokens.json from source');
    console.log('  brand     Manage brand tokens');
    process.exit(1);
}

if (command === 'brand') {
    const subCommand = args[1];
    if (subCommand === 'init') {
        const scriptPath = path.join(__dirname, '../scripts/brand-init.js');
        if (fs.existsSync(scriptPath)) {
            // Remove 'brand' and 'init' from args so script sees flags correctly
            // Actually, my script uses process.argv directly, so I need to pass them or handle them.
            // The script uses process.argv.slice(2).
            // If I run `underlith brand init --flag`, argv is [node, underlith, brand, init, --flag]
            // script.js slice(2) gets [brand, init, --flag]
            // My parser handles flags starting with --. It ignores non-flags.
            // So 'brand' and 'init' will be ignored by the parser loop.
            // Perfect.
            require(scriptPath);
        } else {
            console.error('❌ Could not find brand-init script.');
            process.exit(1);
        }
    } else {
        console.log('Usage: underlith brand <command>');
        console.log('Commands:');
        console.log('  init      Scaffold a new brand token package');
    }
    // Return to avoid hitting other commands? 
    // The structure uses if/if, not if/else if.
    // But since I require the script (which might be async or exit), I should probably return or exit?
    // The script is async main(), but it doesn't await in require.
    // However, the script executes immediately on require.
    // I should probably wrap the script execution better, but for now require is fine.
    // Just ensure we don't fall through to other commands if they match (they won't).
    return;
}

if (command === 'init') {
    console.log('Initializing Underlith...');
    // For MVP, just creating a basic config file or verifying structure
    const configPath = path.join(process.cwd(), 'underlith.config.js');

    if (fs.existsSync(configPath)) {
        console.log('⚠️  underlith.config.js already exists.');
    } else {
        const defaultConfig = `module.exports = {
  tokens: './src/tokens',
  output: './tokens.json'
};
`;
        fs.writeFileSync(configPath, defaultConfig);
        console.log('✅ Created underlith.config.js');
    }
}

if (command === 'generate') {
    console.log('Generating tokens...');
    // For MVP, we bridge to the existing script we just made
    // In a real CLI, we would import the logic directly
    try {
        const scriptPath = path.join(__dirname, '../scripts/generate-tokens.js');

        // Check if script exists, if not, we might be in a consumer project
        // But for this repo context, we assume we are running locally or linked
        if (fs.existsSync(scriptPath)) {
            require(scriptPath);
        } else {
            console.error('❌ Could not find generation script.');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error during generation:', error);
        process.exit(1);
    }
}
