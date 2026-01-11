// Fix TKDN schema by applying the update
const fetch = require('node-fetch');

async function fixTkdnSchema() {
  console.log('Fixing TKDN schema...');
  
  try {
    // Test the TKDN API to see current structure
    const response = await fetch('http://localhost:3000/api/tkdn-ik');
    const result = await response.json();
    
    console.log('Current TKDN API response:', result);
    
    if (result.success && result.data && result.data.length > 0) {
      console.log('Sample TKDN record:', result.data[0]);
      
      // Check if persentase_tkdn field exists
      const sampleRecord = result.data[0];
      if (sampleRecord.hasOwnProperty('persentase_tkdn')) {
        console.log('✅ persentase_tkdn field exists');
      } else {
        console.log('❌ persentase_tkdn field missing');
      }
      
      if (sampleRecord.hasOwnProperty('status_sertifikat')) {
        console.log('✅ status_sertifikat field exists');
      } else {
        console.log('❌ status_sertifikat field missing');
      }
    } else {
      console.log('No TKDN data found or API error');
    }
    
  } catch (error) {
    console.error('Error checking TKDN schema:', error);
  }
}

// Test adding a TKDN record with percentage
async function testTkdnWithPercentage() {
  console.log('\nTesting TKDN with percentage...');
  
  try {
    // First get an IKM ID
    const ikmResponse = await fetch('http://localhost:3000/api/ikm-binaan');
    const ikmResult = await ikmResponse.json();
    
    if (ikmResult.success && ikmResult.data.length > 0) {
      const testIkm = ikmResult.data[0];
      console.log('Using IKM:', testIkm.nama_lengkap);
      
      const tkdnData = {
        ikm_id: testIkm.id,
        nomor_sertifikat: 'TKDN-TEST-' + Date.now(),
        persentase_tkdn: 45.5,
        status_sertifikat: 'Telah Didaftar',
        link_sertifikat: 'https://drive.google.com/file/d/test/view',
        tahun_terbit: 2024
      };
      
      const response = await fetch('http://localhost:3000/api/tkdn-ik', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tkdnData)
      });
      
      const result = await response.json();
      console.log('TKDN creation result:', result);
      
      if (result.success) {
        console.log('✅ TKDN record created successfully with percentage');
        
        // Test updating the record
        const updateData = {
          id: result.data.id,
          ...tkdnData,
          persentase_tkdn: 55.0
        };
        
        const updateResponse = await fetch('http://localhost:3000/api/tkdn-ik', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        const updateResult = await updateResponse.json();
        console.log('TKDN update result:', updateResult);
        
        if (updateResult.success) {
          console.log('✅ TKDN record updated successfully');
        } else {
          console.log('❌ TKDN update failed:', updateResult.error);
        }
      } else {
        console.log('❌ TKDN creation failed:', result.error);
      }
    }
    
  } catch (error) {
    console.error('Error testing TKDN:', error);
  }
}

// Run the tests
fixTkdnSchema().then(() => {
  testTkdnWithPercentage();
});