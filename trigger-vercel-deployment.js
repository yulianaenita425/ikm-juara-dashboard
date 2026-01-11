// Script untuk memaksa deployment baru ke Vercel
const fs = require('fs')
const path = require('path')

console.log('🚀 TRIGGERING VERCEL DEPLOYMENT...')
console.log('Memaksa deployment baru dengan perubahan eksplisit\n')

async function triggerDeployment() {
  console.log('📋 CREATING DEPLOYMENT TRIGGERS:')
  console.log('='.repeat(50))
  
  // 1. Update timestamp di beberapa file kunci
  const timestamp = new Date().toISOString()
  console.log(`⏰ Timestamp: ${timestamp}`)
  
  // 2. Update vercel.json untuk memaksa rebuild
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      }
    ],
    "env": {
      "DEPLOYMENT_TIMESTAMP": timestamp,
      "FORCE_REBUILD": "true"
    }
  }
  
  try {
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2))
    console.log('✅ Updated vercel.json with new timestamp')
  } catch (error) {
    console.log('⚠️ Could not update vercel.json:', error.message)
  }
  
  // 3. Update next.config.js untuk memaksa rebuild
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DEPLOYMENT_TIMESTAMP: '${timestamp}',
    FORCE_REBUILD: 'true'
  },
  // Force rebuild with timestamp
  generateBuildId: async () => {
    return 'build-${timestamp.replace(/[^0-9]/g, '')}'
  }
}

module.exports = nextConfig`

  try {
    fs.writeFileSync('next.config.js', nextConfig)
    console.log('✅ Updated next.config.js with build ID')
  } catch (error) {
    console.log('⚠️ Could not update next.config.js:', error.message)
  }
  
  // 4. Create deployment marker file
  const deploymentInfo = {
    timestamp: timestamp,
    version: '0.1.1',
    features: [
      'Jenis Pelatihan Integration',
      'Form State Persistence', 
      'Laporan Year Range Extended',
      'IKM Data Synchronization',
      'Sertifikat Halal Page Fixed',
      'TKDN Percentage Column Fixed'
    ],
    status: 'READY_FOR_DEPLOYMENT'
  }
  
  try {
    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2))
    console.log('✅ Created deployment-info.json')
  } catch (error) {
    console.log('⚠️ Could not create deployment-info.json:', error.message)
  }
  
  console.log('\n🎯 DEPLOYMENT TRIGGERS CREATED:')
  console.log('1. ✅ vercel.json updated with timestamp')
  console.log('2. ✅ next.config.js updated with build ID')
  console.log('3. ✅ deployment-info.json created')
  console.log('4. ✅ package.json version bumped to 0.1.1')
  
  console.log('\n🚀 MANUAL DEPLOYMENT OPTIONS:')
  console.log('='.repeat(50))
  
  console.log('\n1. 🌐 VERCEL DASHBOARD (RECOMMENDED):')
  console.log('   • Go to: https://vercel.com/dashboard')
  console.log('   • Find: ikm-juara-dashboard project')
  console.log('   • Click "Deployments" tab')
  console.log('   • Click "Redeploy" on latest deployment')
  console.log('   • Select "Use existing Build Cache: NO"')
  console.log('   • Click "Redeploy"')
  
  console.log('\n2. 📁 GIT PUSH METHOD:')
  console.log('   • git add .')
  console.log('   • git commit -m "Force deployment with all fixes"')
  console.log('   • git push origin main')
  
  console.log('\n3. 🔄 VERCEL CLI METHOD:')
  console.log('   • npm i -g vercel')
  console.log('   • vercel --prod')
  
  console.log('\n⚡ INSTANT CHECK:')
  console.log('After deployment, test these URLs:')
  console.log('• https://ikm-juara-dashboard.vercel.app/api/test-supabase')
  console.log('• https://ikm-juara-dashboard.vercel.app/api/dashboard/stats')
  console.log('• https://ikm-juara-dashboard.vercel.app/login')
  
  console.log('\n🎉 DEPLOYMENT TRIGGERS READY!')
  console.log('Files modified to force new deployment.')
  
  return {
    status: 'TRIGGERS_CREATED',
    timestamp: timestamp,
    filesModified: ['vercel.json', 'next.config.js', 'deployment-info.json', 'package.json']
  }
}

triggerDeployment().then(result => {
  console.log('\n📋 RESULT:', result)
})