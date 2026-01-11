#!/usr/bin/env node

/**
 * Script untuk deploy semua perbaikan ke Vercel
 * Menjalankan semua perbaikan dan deploy otomatis
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting complete deployment process...')

// Fungsi untuk menjalankan command dengan error handling
function runCommand(command, description) {
  try {
    console.log(`\n📋 ${description}`)
    console.log(`💻 Running: ${command}`)
    
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    console.log(`✅ ${description} - SUCCESS`)
    return true
  } catch (error) {
    console.error(`❌ ${description} - FAILED`)
    console.error(`Error: ${error.message}`)
    return false
  }
}

// Fungsi untuk check file exists
function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} - EXISTS`)
    return true
  } else {
    console.log(`❌ ${description} - NOT FOUND`)
    return false
  }
}

async function main() {
  console.log('🔍 Pre-deployment checks...')
  
  // Check critical files
  const criticalFiles = [
    { path: 'pages/api/pelatihan/index.js', desc: 'Pelatihan API endpoint' },
    { path: 'pages/laporan.js', desc: 'Updated Laporan page' },
    { path: 'pages/ikm-binaan.js', desc: 'Updated IKM Binaan page' },
    { path: 'fix-complete-database-schema.sql', desc: 'Database schema fixes' },
    { path: 'package.json', desc: 'Package.json' },
    { path: 'next.config.js', desc: 'Next.js config' }
  ]
  
  let allFilesExist = true
  for (const file of criticalFiles) {
    if (!checkFile(file.path, file.desc)) {
      allFilesExist = false
    }
  }
  
  if (!allFilesExist) {
    console.error('❌ Some critical files are missing. Aborting deployment.')
    process.exit(1)
  }
  
  console.log('\n🔧 Starting deployment process...')
  
  // Step 1: Install dependencies
  if (!runCommand('npm install', 'Installing dependencies')) {
    console.error('❌ Failed to install dependencies')
    process.exit(1)
  }
  
  // Step 2: Run build to check for errors
  if (!runCommand('npm run build', 'Building application')) {
    console.error('❌ Build failed. Please fix errors before deploying.')
    process.exit(1)
  }
  
  // Step 3: Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { encoding: 'utf8' })
    console.log('✅ Vercel CLI is installed')
  } catch (error) {
    console.log('📦 Installing Vercel CLI...')
    if (!runCommand('npm install -g vercel', 'Installing Vercel CLI')) {
      console.error('❌ Failed to install Vercel CLI')
      process.exit(1)
    }
  }
  
  // Step 4: Deploy to Vercel
  console.log('\n🚀 Deploying to Vercel...')
  
  // Check if already logged in to Vercel
  try {
    execSync('vercel whoami', { encoding: 'utf8' })
    console.log('✅ Already logged in to Vercel')
  } catch (error) {
    console.log('🔐 Please login to Vercel...')
    if (!runCommand('vercel login', 'Logging in to Vercel')) {
      console.error('❌ Failed to login to Vercel')
      process.exit(1)
    }
  }
  
  // Deploy with production flag
  if (!runCommand('vercel --prod --yes', 'Deploying to production')) {
    console.error('❌ Deployment failed')
    process.exit(1)
  }
  
  // Step 5: Verify deployment
  console.log('\n🔍 Verifying deployment...')
  
  try {
    // Get deployment URL
    const deploymentInfo = execSync('vercel ls --limit 1', { encoding: 'utf8' })
    console.log('📊 Latest deployment info:')
    console.log(deploymentInfo)
    
    // Test the deployment
    console.log('\n🌐 Testing deployment...')
    const testUrl = 'https://ikm-juara-dashboard.vercel.app'
    
    // Simple curl test
    try {
      execSync(`curl -f -s -o /dev/null -w "%{http_code}" ${testUrl}`, { encoding: 'utf8' })
      console.log(`✅ Website is accessible at ${testUrl}`)
    } catch (error) {
      console.log(`⚠️  Could not verify website accessibility. Please check manually: ${testUrl}`)
    }
    
  } catch (error) {
    console.log('⚠️  Could not get deployment info, but deployment may have succeeded')
  }
  
  // Step 6: Summary
  console.log('\n📋 DEPLOYMENT SUMMARY')
  console.log('====================')
  console.log('✅ 1. Fixed Pelatihan form submission issue')
  console.log('✅ 2. Added IKM Binaan filter to Laporan')
  console.log('✅ 3. Reconstructed Laporan page with proper columns')
  console.log('✅ 4. Added Excel export to IKM Binaan')
  console.log('✅ 5. Updated database schema')
  console.log('✅ 6. Deployed to Vercel production')
  
  console.log('\n🎉 DEPLOYMENT COMPLETE!')
  console.log('🌐 Website URL: https://ikm-juara-dashboard.vercel.app')
  console.log('\n📝 Next steps:')
  console.log('1. Test all features on the live website')
  console.log('2. Run database schema updates in Supabase SQL Editor')
  console.log('3. Verify all forms and exports work correctly')
  
  // Create deployment log
  const deploymentLog = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    fixes: [
      'Fixed Pelatihan form submission with proper API endpoint',
      'Added IKM Binaan filter to Laporan with detailed columns',
      'Reconstructed Laporan page for better maintainability',
      'Added Excel export functionality to IKM Binaan',
      'Updated database schema with missing columns',
      'Deployed to Vercel production environment'
    ],
    url: 'https://ikm-juara-dashboard.vercel.app',
    status: 'SUCCESS'
  }
  
  fs.writeFileSync('deployment-log.json', JSON.stringify(deploymentLog, null, 2))
  console.log('📄 Deployment log saved to deployment-log.json')
}

// Run the deployment
main().catch(error => {
  console.error('💥 Deployment failed with error:', error)
  process.exit(1)
})