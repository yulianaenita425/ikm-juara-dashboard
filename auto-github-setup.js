#!/usr/bin/env node

/**
 * AUTO GITHUB SETUP - IKM JUARA DASHBOARD
 * Script otomatis untuk membuat repository GitHub dan push kode
 */

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🚀 AUTO GITHUB SETUP - IKM JUARA DASHBOARD')
console.log('=' .repeat(60))

// Repository details
const repoName = 'ikm-juara-dashboard'
const repoDescription = 'Dashboard sistem database IKM JUARA untuk DisnakerKUKM Kota Madiun'

console.log('📝 Repository Details:')
console.log(`   Name: ${repoName}`)
console.log(`   Description: ${repoDescription}`)
console.log('')

// Check if GitHub CLI is installed
console.log('🔍 Checking GitHub CLI...')
try {
  const ghVersion = execSync('gh --version', { encoding: 'utf8', stdio: 'pipe' })
  console.log('✅ GitHub CLI is installed:', ghVersion.split('\n')[0])
} catch (error) {
  console.log('❌ GitHub CLI not found. Installing instructions:')
  console.log('')
  console.log('📦 INSTALL GITHUB CLI:')
  console.log('Windows: winget install --id GitHub.cli')
  console.log('Or download from: https://cli.github.com/')
  console.log('')
  console.log('After installation, run: gh auth login')
  console.log('Then run this script again.')
  process.exit(1)
}

// Check if user is authenticated
console.log('🔐 Checking GitHub authentication...')
try {
  const authStatus = execSync('gh auth status', { encoding: 'utf8', stdio: 'pipe' })
  console.log('✅ GitHub authentication OK')
} catch (error) {
  console.log('❌ Not authenticated with GitHub')
  console.log('🔑 Please run: gh auth login')
  console.log('Then run this script again.')
  process.exit(1)
}

// Create GitHub repository
console.log('📝 Creating GitHub repository...')
try {
  const createCmd = `gh repo create ${repoName} --description "${repoDescription}" --public --clone=false`
  execSync(createCmd, { stdio: 'inherit' })
  console.log('✅ GitHub repository created successfully!')
} catch (error) {
  if (error.message.includes('already exists')) {
    console.log('⚠️ Repository already exists, continuing...')
  } else {
    console.log('❌ Failed to create repository:', error.message)
    process.exit(1)
  }
}

// Get GitHub username
console.log('👤 Getting GitHub username...')
try {
  const username = execSync('gh api user --jq .login', { encoding: 'utf8', stdio: 'pipe' }).trim()
  console.log(`✅ GitHub username: ${username}`)
  
  const repoUrl = `https://github.com/${username}/${repoName}.git`
  console.log(`🔗 Repository URL: ${repoUrl}`)
  
  // Add remote origin
  console.log('🔗 Adding remote origin...')
  try {
    execSync(`git remote add origin ${repoUrl}`, { stdio: 'pipe' })
    console.log('✅ Remote origin added')
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️ Remote origin already exists, updating...')
      execSync(`git remote set-url origin ${repoUrl}`, { stdio: 'inherit' })
      console.log('✅ Remote origin updated')
    } else {
      throw error
    }
  }
  
  // Set main branch
  console.log('🌿 Setting main branch...')
  try {
    execSync('git branch -M main', { stdio: 'inherit' })
    console.log('✅ Main branch set')
  } catch (error) {
    console.log('⚠️ Branch already named main or error occurred')
  }
  
  // Push to GitHub
  console.log('📤 Pushing to GitHub...')
  try {
    execSync('git push -u origin main', { stdio: 'inherit' })
    console.log('✅ Code pushed to GitHub successfully!')
  } catch (error) {
    console.log('❌ Failed to push to GitHub:', error.message)
    process.exit(1)
  }
  
  // Save repository info
  const repoInfo = {
    name: repoName,
    description: repoDescription,
    url: repoUrl,
    username: username,
    created: new Date().toISOString(),
    status: 'SUCCESS'
  }
  
  fs.writeFileSync('github-repository-info.json', JSON.stringify(repoInfo, null, 2))
  
  console.log('')
  console.log('=' .repeat(60))
  console.log('🎉 GITHUB REPOSITORY SETUP COMPLETE!')
  console.log('=' .repeat(60))
  console.log('')
  console.log('📋 REPOSITORY INFO:')
  console.log(`🌐 GitHub URL: https://github.com/${username}/${repoName}`)
  console.log(`🔗 Clone URL: ${repoUrl}`)
  console.log(`👤 Owner: ${username}`)
  console.log('')
  console.log('✅ NEXT STEP: CONNECT TO VERCEL')
  console.log('1. Go to: https://vercel.com/dashboard')
  console.log('2. Click "Add New..." → "Project"')
  console.log('3. Click "Continue with GitHub"')
  console.log(`4. Search for "${repoName}" and click "Import"`)
  console.log('5. Configure settings (should auto-detect Next.js)')
  console.log('6. Click "Deploy"')
  console.log('')
  console.log('🔄 AUTO-DEPLOYMENT ENABLED:')
  console.log('- Every push to main branch will auto-deploy')
  console.log('- Pull requests will create preview deployments')
  console.log('- Environment variables can be set in Vercel dashboard')
  console.log('')
  console.log('🎯 Your project is now professional-grade with:')
  console.log('✅ Version control (Git)')
  console.log('✅ Cloud backup (GitHub)')
  console.log('✅ Auto-deployment (Vercel)')
  console.log('✅ Collaboration ready')
  
} catch (error) {
  console.log('❌ Error getting GitHub username:', error.message)
  process.exit(1)
}

// Open GitHub repository in browser
console.log('')
console.log('🌐 Opening GitHub repository in browser...')
try {
  execSync(`gh repo view --web`, { stdio: 'pipe' })
  console.log('✅ GitHub repository opened in browser')
} catch (error) {
  console.log('⚠️ Could not open browser automatically')
  console.log(`Please visit: https://github.com/${username}/${repoName}`)
}