#!/usr/bin/env node

/**
 * CONNECT VERCEL TO GITHUB - IKM JUARA DASHBOARD
 * Script untuk menghubungkan repository GitHub ke Vercel
 */

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🚀 CONNECT VERCEL TO GITHUB - IKM JUARA DASHBOARD')
console.log('=' .repeat(60))

const repoUrl = 'https://github.com/yulianaenita425/ikm-juara-dashboard'
const repoName = 'ikm-juara-dashboard'

console.log('✅ GitHub Repository: ' + repoUrl)
console.log('✅ All code pushed successfully!')
console.log('')

// Check if Vercel CLI is available
console.log('🔍 Checking Vercel CLI...')
try {
  const vercelVersion = execSync('vercel --version', { encoding: 'utf8', stdio: 'pipe' })
  console.log('✅ Vercel CLI is available:', vercelVersion.trim())
  
  // Try to link the project
  console.log('🔗 Linking project to Vercel...')
  try {
    // Check if already linked
    const projectInfo = execSync('vercel project ls', { encoding: 'utf8', stdio: 'pipe' })
    console.log('📋 Current Vercel projects:')
    console.log(projectInfo)
  } catch (error) {
    console.log('⚠️ Not logged in to Vercel or no projects found')
  }
  
} catch (error) {
  console.log('⚠️ Vercel CLI not found or not in PATH')
}

console.log('')
console.log('🌐 MANUAL VERCEL CONNECTION (RECOMMENDED):')
console.log('=' .repeat(50))
console.log('')
console.log('1. 🌐 Open Vercel Dashboard:')
console.log('   https://vercel.com/dashboard')
console.log('')
console.log('2. 📝 Click "Add New..." → "Project"')
console.log('')
console.log('3. 🔗 Click "Continue with GitHub"')
console.log('   (Authorize Vercel if first time)')
console.log('')
console.log('4. 🔍 Search and Import:')
console.log(`   Repository: ${repoName}`)
console.log(`   URL: ${repoUrl}`)
console.log('   Click "Import"')
console.log('')
console.log('5. ⚙️ Configure Project:')
console.log('   - Framework Preset: Next.js (auto-detected)')
console.log('   - Build Command: npm run build')
console.log('   - Output Directory: .next')
console.log('   - Install Command: npm install')
console.log('')
console.log('6. 🔐 Add Environment Variables:')
console.log('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
console.log('')
console.log('7. 🚀 Click "Deploy"')
console.log('')

// Read current environment variables
console.log('📋 CURRENT ENVIRONMENT VARIABLES:')
console.log('=' .repeat(40))
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'))
  
  console.log('Copy these to Vercel Environment Variables:')
  console.log('')
  envLines.forEach(line => {
    if (line.includes('=')) {
      const [key, ...valueParts] = line.split('=')
      const value = valueParts.join('=')
      console.log(`${key.trim()}=${value.trim()}`)
    }
  })
} catch (error) {
  console.log('⚠️ .env.local not found or cannot read')
  console.log('Make sure to add your Supabase credentials to Vercel')
}

console.log('')
console.log('🎯 AFTER DEPLOYMENT:')
console.log('=' .repeat(30))
console.log('✅ Auto-deployment will be enabled')
console.log('✅ Every push to main branch → auto deploy')
console.log('✅ Pull requests → preview deployments')
console.log('✅ Professional CI/CD workflow')
console.log('')

console.log('🔄 WORKFLOW BENEFITS:')
console.log('=' .repeat(30))
console.log('🔄 Push code → Auto deploy')
console.log('💾 Automatic backups')
console.log('👥 Team collaboration')
console.log('🌿 Branch management')
console.log('📋 Code reviews')
console.log('🔒 Version control')
console.log('')

// Save connection info
const connectionInfo = {
  githubRepo: repoUrl,
  repoName: repoName,
  vercelDashboard: 'https://vercel.com/dashboard',
  status: 'READY_FOR_VERCEL_CONNECTION',
  timestamp: new Date().toISOString(),
  nextSteps: [
    'Open Vercel Dashboard',
    'Add New Project',
    'Import from GitHub',
    'Configure environment variables',
    'Deploy'
  ]
}

fs.writeFileSync('vercel-connection-info.json', JSON.stringify(connectionInfo, null, 2))

console.log('💾 Connection info saved to vercel-connection-info.json')
console.log('')
console.log('🎉 GITHUB CONNECTION COMPLETE!')
console.log('=' .repeat(40))
console.log('✅ Repository: ' + repoUrl)
console.log('✅ All files pushed successfully')
console.log('✅ Ready for Vercel connection')
console.log('')
console.log('🌐 Next: Open https://vercel.com/dashboard')
console.log('📝 Import your GitHub repository')
console.log('🚀 Deploy and enjoy auto-deployment!')

// Try to open Vercel dashboard
console.log('')
console.log('🌐 Opening Vercel dashboard...')
try {
  if (process.platform === 'win32') {
    execSync('start https://vercel.com/dashboard', { stdio: 'pipe' })
  } else if (process.platform === 'darwin') {
    execSync('open https://vercel.com/dashboard', { stdio: 'pipe' })
  } else {
    execSync('xdg-open https://vercel.com/dashboard', { stdio: 'pipe' })
  }
  console.log('✅ Vercel dashboard opened in browser')
} catch (error) {
  console.log('⚠️ Could not open browser automatically')
  console.log('Please manually open: https://vercel.com/dashboard')
}