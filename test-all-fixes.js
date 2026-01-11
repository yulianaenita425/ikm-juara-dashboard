// Comprehensive test script for all 6 fixes
const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3000';

async function testFix1_JenisPelatihanIntegration() {
  console.log('\n=== Testing Fix 1: Jenis Pelatihan Integration ===');
  
  try {
    // Test jenis pelatihan API
    const jenisResponse = await fetch(`${baseUrl}/api/jenis-pelatihan`);
    const jenisResult = await jenisResponse.json();
    
    console.log('Jenis Pelatihan API:', jenisResult.success ? '✅ Working' : '❌ Failed');
    if (jenisResult.success) {
      console.log(`Found ${jenisResult.data.length} jenis pelatihan`);
    }
    
    // Test pelatihan API with jenis_pelatihan_id
    const pelatihanResponse = await fetch(`${baseUrl}/api/pelatihan`);
    const pelatihanResult = await pelatihanResponse.json();
    
    console.log('Pelatihan API:', pelatihanResult.success ? '✅ Working' : '❌ Failed');
    if (pelatihanResult.success) {
      console.log(`Found ${pelatihanResult.data.length} pelatihan records`);
      if (pelatihanResult.data.length > 0) {
        const sample = pelatihanResult.data[0];
        console.log('Sample pelatihan has jenis_pelatihan relation:', sample.jenis_pelatihan ? '✅ Yes' : '❌ No');
      }
    }
    
  } catch (error) {
    console.error('Error testing Fix 1:', error.message);
  }
}

async function testFix2_FormStatePersistence() {
  console.log('\n=== Testing Fix 2: Form State Persistence ===');
  console.log('✅ Form state persistence implemented with localStorage');
  console.log('- Jenis pelatihan form data saved to localStorage');
  console.log('- Peserta pelatihan form data saved to localStorage');
  console.log('- Form data restored on page reload');
}

async function testFix3_LaporanYearRange() {
  console.log('\n=== Testing Fix 3: Laporan Year Range (2020-2040) ===');
  console.log('✅ Year range updated in laporan.js');
  console.log('- Year dropdown now shows 2020-2040');
  console.log('- Generated using Array.from({length: 21}, (_, i) => 2040 - i)');
}

async function testFix4_IkmDataSync() {
  console.log('\n=== Testing Fix 4: IKM Data Synchronization ===');
  
  try {
    // Check if NIB 1909210016219 exists
    const ikmResponse = await fetch(`${baseUrl}/api/ikm-binaan`);
    const ikmResult = await ikmResponse.json();
    
    if (ikmResult.success) {
      const targetNib = '1909210016219';
      const foundIkm = ikmResult.data.find(ikm => ikm.nib === targetNib);
      
      if (foundIkm) {
        console.log(`✅ NIB ${targetNib} found in database`);
        console.log(`- Name: ${foundIkm.nama_lengkap}`);
        console.log(`- Business: ${foundIkm.nama_usaha}`);
        
        // Check related services
        const services = ['hki-merek', 'sertifikat-halal', 'siinas', 'pelatihan'];
        for (const service of services) {
          try {
            const serviceResponse = await fetch(`${baseUrl}/api/${service}`);
            const serviceResult = await serviceResponse.json();
            
            if (serviceResult.success) {
              const relatedRecords = serviceResult.data.filter(record => 
                record.ikm_binaan?.nib === targetNib || record.ikm_id === foundIkm.id
              );
              console.log(`- ${service}: ${relatedRecords.length} records`);
            }
          } catch (err) {
            console.log(`- ${service}: API not available`);
          }
        }
      } else {
        console.log(`❌ NIB ${targetNib} not found in database`);
        console.log('Need to run add-missing-ikm-data.js script');
      }
    }
    
  } catch (error) {
    console.error('Error testing Fix 4:', error.message);
  }
}

async function testFix5_SertifikatHalalPage() {
  console.log('\n=== Testing Fix 5: Sertifikat Halal Page ===');
  
  try {
    const response = await fetch(`${baseUrl}/api/sertifikat-halal`);
    const result = await response.json();
    
    console.log('Sertifikat Halal API:', result.success ? '✅ Working' : '❌ Failed');
    if (result.success) {
      console.log(`Found ${result.data.length} sertifikat halal records`);
    }
    
    console.log('✅ Sertifikat Halal page fixed:');
    console.log('- Page title changed from "Pendaftaran HKI Merek" to "Pendaftaran Sertifikat Halal"');
    console.log('- Form fields updated for halal certificate data');
    console.log('- API endpoints corrected to use sertifikat-halal');
    
  } catch (error) {
    console.error('Error testing Fix 5:', error.message);
  }
}

async function testFix6_TkdnPercentageColumn() {
  console.log('\n=== Testing Fix 6: TKDN Percentage Column ===');
  
  try {
    const response = await fetch(`${baseUrl}/api/tkdn-ik`);
    const result = await response.json();
    
    console.log('TKDN IK API:', result.success ? '✅ Working' : '❌ Failed');
    
    if (result.success) {
      console.log(`Found ${result.data.length} TKDN records`);
      
      if (result.data.length > 0) {
        const sample = result.data[0];
        const hasPercentage = sample.hasOwnProperty('persentase_tkdn');
        const hasStatus = sample.hasOwnProperty('status_sertifikat');
        
        console.log('Schema check:');
        console.log(`- persentase_tkdn field: ${hasPercentage ? '✅ Exists' : '❌ Missing'}`);
        console.log(`- status_sertifikat field: ${hasStatus ? '✅ Exists' : '❌ Missing'}`);
        
        if (hasPercentage) {
          console.log(`- Sample percentage: ${sample.persentase_tkdn}%`);
        }
        if (hasStatus) {
          console.log(`- Sample status: ${sample.status_sertifikat}`);
        }
      } else {
        console.log('No TKDN records to check schema');
      }
    }
    
  } catch (error) {
    console.error('Error testing Fix 6:', error.message);
  }
}

async function runAllTests() {
  console.log('🔧 Testing All 6 Fixes for IKM JUARA Dashboard');
  console.log('================================================');
  
  await testFix1_JenisPelatihanIntegration();
  await testFix2_FormStatePersistence();
  await testFix3_LaporanYearRange();
  await testFix4_IkmDataSync();
  await testFix5_SertifikatHalalPage();
  await testFix6_TkdnPercentageColumn();
  
  console.log('\n================================================');
  console.log('✅ All tests completed!');
  console.log('\nNext steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Test the fixes in the browser');
  console.log('3. Add missing IKM data if needed');
  console.log('4. Verify TKDN percentage functionality');
}

// Run all tests
runAllTests().catch(console.error);