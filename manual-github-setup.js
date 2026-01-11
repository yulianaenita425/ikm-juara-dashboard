#!/usr/bin/env node

/**
 * MANUAL GITHUB SETUP - IKM JUARA DASHBOARD
 * Script untuk setup GitHub repository secara manual (tanpa GitHub CLI)
 */

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🚀 MANUAL GITHUB SETUP - IKM JUARA DASHBOARD')
console.log('=' .repeat(60))

const repoName = 'ikm-juara-dashboard'
const repoDescription = 'Dashboard sistem database IKM JUARA untuk DisnakerKUKM Kota Madiun'

console.log('📝 Repository Details:')
console.log(`   Name: ${repoName}`)
console.log(`   Description: ${repoDescription}`)
console.log('')

console.log('📋 MANUAL SETUP INSTRUCTIONS:')
console.log('=' .repeat(40))
console.log('')

console.log('🌐 STEP 1: CREATE GITHUB REPOSITORY')
console.log('1. Go to: https://github.com/new')
console.log(`2. Repository name: ${repoName}`)
console.log(`3. Description: ${repoDescription}`)
console.log('4. Set to Public')
console.log('5. DO NOT initialize with README, .gitignore, or license')
console.log('6. Click "Create repository"')
console.log('')

console.log('📤 STEP 2: PUSH CODE TO GITHUB')
console.log('After creating the repository, GitHub will show you commands.')
console.log('Use these commands (replace YOUR_USERNAME with your GitHub username):')
console.log('')
console.log('git remote add origin https://github.com/YOUR_USERNAME/ikm-juara-dashboard.git')
console.log('git branch -M main')
console.log('git push -u origin main')
console.log('')

console.log('🔗 STEP 3: CONNECT TO VERCEL')
console.log('1. Go to: https://vercel.com/dashboard')
console.log('2. Click "Add New..." → "Project"')
console.log('3. Click "Continue with GitHub"')
console.log('4. Authorize Vercel to access your GitHub')
console.log(`5. Search for "${repoName}" and click "Import"`)
console.log('6. Configure settings:')
console.log('   - Framework Preset: Next.js (should auto-detect)')
console.log('   - Build Command: npm run build')
console.log('   - Output Directory: .next')
console.log('   - Install Command: npm install')
console.log('7. Add Environment Variables:')
console.log('   - NEXT_PUBLIC_SUPABASE_URL')
console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
console.log('8. Click "Deploy"')
console.log('')

// Check current Git status
console.log('📊 CURRENT GIT STATUS:')
console.log('=' .repeat(30))
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' })
  if (gitStatus.trim() === '') {
    console.log('✅ Working directory clean - ready to push')
  } else {
    console.log('⚠️ Uncommitted changes detected:')
    console.log(gitStatus)
  }
} catch (error) {
  console.log('❌ Error checking git status')
}

try {
  const gitRemote = execSync('git remote -v', { encoding: 'utf8' })
  if (gitRemote.trim() === '') {
    console.log('📝 No remote repository configured yet')
  } else {
    console.log('🔗 Current remotes:')
    console.log(gitRemote)
  }
} catch (error) {
  console.log('📝 No remote repository configured yet')
}

console.log('')
console.log('🎯 QUICK SETUP COMMANDS:')
console.log('=' .repeat(30))
console.log('# After creating GitHub repository, run these:')
console.log('')
console.log('# Replace YOUR_USERNAME with your actual GitHub username')
console.log('git remote add origin https://github.com/YOUR_USERNAME/ikm-juara-dashboard.git')
console.log('git branch -M main')
console.log('git push -u origin main')
console.log('')

// Create a batch file for Windows users
const batchContent = `@echo off
echo 🚀 IKM JUARA DASHBOARD - GitHub Setup
echo.
echo Please replace YOUR_USERNAME with your actual GitHub username
echo.
set /p username="Enter your GitHub username: "
echo.
echo Adding remote repository...
git remote add origin https://github.com/%username%/ikm-juara-dashboard.git
echo.
echo Setting main branch...
git branch -M main
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo ✅ Setup complete!
echo.
echo Next: Go to https://vercel.com/dashboard to connect your repository
pause
`

fs.writeFileSync('github-setup.bat', batchContent)
console.log('📝 Created github-setup.bat for easy Windows setup')

// Create shell script for other systems
const shellContent = `#!/bin/bash
echo "🚀 IKM JUARA DASHBOARD - GitHub Setup"
echo ""
echo "Please replace YOUR_USERNAME with your actual GitHub username"
echo ""
read -p "Enter your GitHub username: " username
echo ""
echo "Adding remote repository..."
git remote add origin https://github.com/$username/ikm-juara-dashboard.git
echo ""
echo "Setting main branch..."
git branch -M main
echo ""
echo "Pushing to GitHub..."
git push -u origin main
echo ""
echo "✅ Setup complete!"
echo ""
echo "Next: Go to https://vercel.com/dashboard to connect your repository"
`

fs.writeFileSync('github-setup.sh', shellContent)
console.log('📝 Created github-setup.sh for Linux/Mac setup')

console.log('')
console.log('🎉 SETUP FILES CREATED!')
console.log('=' .repeat(30))
console.log('Windows users: Run github-setup.bat')
console.log('Linux/Mac users: Run ./github-setup.sh')
console.log('')

console.log('📋 SUMMARY:')
console.log('1. ✅ Git repository initialized')
console.log('2. ✅ Files committed to Git')
console.log('3. 📝 Setup scripts created')
console.log('4. 🌐 Ready to create GitHub repository')
console.log('5. 🔗 Ready to connect to Vercel')
console.log('')

console.log('🔄 BENEFITS AFTER SETUP:')
console.log('✅ Auto-deployment on every push')
console.log('✅ Preview deployments for pull requests')
console.log('✅ Version control and backup')
console.log('✅ Team collaboration ready')
console.log('✅ Professional development workflow')

// Save setup info
const setupInfo = {
  repoName: repoName,
  description: repoDescription,
  setupFiles: ['github-setup.bat', 'github-setup.sh'],
  instructions: {
    github: 'https://github.com/new',
    vercel: 'https://vercel.com/dashboard'
  },
  timestamp: new Date().toISOString()
}

fs.writeFileSync('github-setup-info.json', JSON.stringify(setupInfo, null, 2))
console.log('')
console.log('💾 Setup information saved to github-setup-info.json')