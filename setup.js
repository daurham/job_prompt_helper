#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Job Prompt Helper Setup');
console.log('==========================\n');

const examplePath = path.join(__dirname, 'data', 'prompts.example.js');
const targetPath = path.join(__dirname, 'data', 'prompts.js');

try {
  // Check if prompts.js already exists
  if (fs.existsSync(targetPath)) {
    console.log('⚠️  data/prompts.js already exists!');
    console.log('   If you want to start fresh, delete it and run this script again.\n');
  } else {
    // Copy the example file
    fs.copyFileSync(examplePath, targetPath);
    console.log('✅ Created data/prompts.js from example template');
    console.log('📝 Edit data/prompts.js with your personal information');
    console.log('🔄 Reload the extension in Chrome after making changes\n');
  }
  
  console.log('📋 Next steps:');
  console.log('   1. Edit data/prompts.js with your personal information');
  console.log('   2. Reload the extension in Chrome (chrome://extensions/)');
  console.log('   3. Press Ctrl+Shift+J on any webpage to test');
  console.log('\n🎯 Happy job hunting!');
  
} catch (error) {
  console.error('❌ Error during setup:', error.message);
  console.log('\n📖 Manual setup:');
  console.log('   1. Copy data/prompts.example.js to data/prompts.js');
  console.log('   2. Edit data/prompts.js with your information');
  console.log('   3. Reload the extension');
} 