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
    process.exit(1);
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
