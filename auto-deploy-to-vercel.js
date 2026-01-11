// Script untuk auto deploy ke Vercel via Git
const { execSync } = require('child_process')

console.log('🚀 AUTO DEPLOY TO VERCEL VIA GIT')
console.log('Melakukan commit dan push otomatis untuk trigger deployment\n')

async function autoDeployToVercel() {
  try {
    console.log('📋 DEPLOYMENT STEPS:')
    console.log('='.repeat(50))
    
    // Step 1: Check git status
    console.log('1. 🔍 Checking git status...')
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' })
      if (status.trim()) {
        console.log('   ✅ Changes detected:')
        console.log(status.split('\n').filter(line => line.trim()).map(line => `   ${line}`).join('\n'))
      } else {
        console.log('   ⚠️ No changes detected')
      }
    } catch (error) {
      console.log('   ⚠️ Git status check failed:', error.message)
    }
    
    // Step 2: Add all files
    console.log('\n2. 📦 Adding all files to git...')
    try {
      execSync('git add .', { stdio: 'inherit' })
      console.log('   ✅ All files added successfully')
    } catch (error) {
      console.log('   ❌ Failed to add files:', error.message)
      return false
    }
    
    // Step 3: Commit changes
    console.log('\n3. 💾 Committing changes...')
    const commitMessage = `Deploy all 6 fixes - ${new Date().toISOString()}`
    try {
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' })
      console.log('   ✅ Changes committed successfully')
    } catch (error) {
      console.log('   ⚠️ Commit failed (might be no changes):', error.message)
    }
    
    // Step 4: Push to origin
    console.log('\n4. 🚀 Pushing to origin...')
    try {
      execSync('git push origin main', { stdio: 'inherit' })
      console.log('   ✅ Pushed to origin successfully')
      console.log('   🎉 Vercel will auto-deploy from this push!')
    } catch (error) {
      console.log('   ❌ Push failed:', error.message)
      console.log('   💡 Try manual push: git push origin main')
      return false
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('🎯 DEPLOYMENT STATUS: SUCCESS!')
    console.log('✅ All changes pushed to Git')
    console.log('✅ Vercel will auto-deploy in ~2-3 minutes')
    console.log('✅ Check deployment at: https://vercel.com/dashboard')
    
    console.log('\n⏰ EXPECTED TIMELINE:')
    console.log('• Now: Git push completed')
    console.log('• +1 min: Vercel detects changes')
    console.log('• +2-3 min: Build & deployment complete')
    console.log('• +3-4 min: Website updated with all fixes')
    
    console.log('\n🔗 VERIFICATION URLS:')
    console.log('• Main site: https://ikm-juara-dashboard.vercel.app/')
    console.log('• API test: https://ikm-juara-dashboard.vercel.app/api/test-supabase')
    console.log('• Dashboard: https://ikm-juara-dashboard.vercel.app/dashboard')
    
    return true
    
  } catch (error) {
    console.log('\n❌ DEPLOYMENT FAILED:', error.message)
    console.log('\n💡 MANUAL ALTERNATIVES:')
    console.log('1. Run: git add . && git commit -m "Deploy fixes" && git push')
    console.log('2. Or use Vercel dashboard to redeploy')
    console.log('3. Or upload files directly to Vercel')
    return false
  }
}

// Execute auto deploy
autoDeployToVercel().then(success => {
  if (success) {
    console.log('\n🎉 AUTO DEPLOYMENT INITIATED!')
    console.log('Check Vercel dashboard for deployment progress.')
  } else {
    console.log('\n⚠️ AUTO DEPLOYMENT FAILED!')
    console.log('Please try manual deployment methods.')
  }
})