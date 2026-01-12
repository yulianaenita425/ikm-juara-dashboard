const { execSync } = require('child_process');

console.log('🚀 FORCE MANUAL DEPLOYMENT...\n');

try {
  console.log('1️⃣ Cleaning build cache...');
  try {
    execSync('Remove-Item -Recurse -Force .next', { stdio: 'inherit', shell: 'powershell' });
    console.log('✅ Build cache cleared');
  } catch (e) {
    console.log('⚠️ No build cache to clear');
  }
  
  console.log('\n2️⃣ Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed');
  
  console.log('\n3️⃣ Deploying to Vercel...');
  
  // Try different deployment approaches
  const deploymentCommands = [
    'npx vercel --prod --force --yes',
    'npx vercel deploy --prod --force',
    'npx vercel --prod'
  ];
  
  let deploymentSuccess = false;
  
  for (const cmd of deploymentCommands) {
    try {
      console.log(`\n🔄 Trying: ${cmd}`);
      const output = execSync(cmd, { encoding: 'utf8', timeout: 120000 });
      console.log(output);
      
      if (output.includes('Production:') || output.includes('Aliased:')) {
        deploymentSuccess = true;
        console.log('✅ Deployment successful!');
        break;
      }
    } catch (error) {
      console.log(`❌ Command failed: ${error.message}`);
      continue;
    }
  }
  
  if (!deploymentSuccess) {
    console.log('\n⚠️ All deployment commands failed');
    console.log('🔧 Manual steps required:');
    console.log('1. Check Vercel dashboard');
    console.log('2. Verify GitHub integration');
    console.log('3. Try deploying from Vercel dashboard');
  }
  
  console.log('\n4️⃣ Testing deployment...');
  
  // Wait a bit for deployment to propagate
  console.log('⏳ Waiting 30 seconds for deployment to propagate...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // Test the deployment
  const testScript = require('./test-cache-buster.js');
  
} catch (error) {
  console.error('❌ Deployment error:', error.message);
  
  console.log('\n🔧 TROUBLESHOOTING STEPS:');
  console.log('1. Check if Vercel CLI is properly authenticated');
  console.log('2. Verify project is linked to correct Vercel project');
  console.log('3. Check if there are any build errors');
  console.log('4. Try manual deployment from Vercel dashboard');
  console.log('5. Check GitHub integration status');
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}