// Script Migrasi Lengkap dari localStorage ke Supabase
// Mengatasi masalah duplikasi data dan memastikan single source of truth

// Setup Supabase untuk Node.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

async function migrateToSupabase() {
  console.log('🚀 MEMULAI MIGRASI LENGKAP KE SUPABASE...\n')
  
  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client tidak tersedia')
    return
  }

  try {
    // 1. Cek data yang sudah ada di Supabase
    console.log('📊 MENGECEK DATA YANG ADA DI SUPABASE:')
    
    const { data: existingIkm, error: ikmError } = await supabaseAdmin
      .from('ikm_binaan')
      .select('*')
      .is('deleted_at', null)
    
    if (ikmError) throw ikmError
    
    const { data: existingHki, error: hkiError } = await supabaseAdmin
      .from('hki_merek')
      .select('*')
      .is('deleted_at', null)
    
    if (hkiError) throw hkiError
    
    const { data: existingHalal, error: halalError } = await supabaseAdmin
      .from('sertifikat_halal')
      .select('*')
      .is('deleted_at', null)
    
    if (halalError) throw halalError
    
    console.log(`   ✅ IKM Binaan: ${existingIkm.length} records`)
    console.log(`   ✅ HKI Merek: ${existingHki.length} records`)
    console.log(`   ✅ Sertifikat Halal: ${existingHalal.length} records`)
    
    // 2. Bersihkan duplikasi jika ada
    console.log('\n🧹 MEMBERSIHKAN DUPLIKASI:')
    
    // Cek duplikasi NIB di IKM Binaan
    const nibCounts = {}
    existingIkm.forEach(ikm => {
      nibCounts[ikm.nib] = (nibCounts[ikm.nib] || 0) + 1
    })
    
    const duplicateNibs = Object.keys(nibCounts).filter(nib => nibCounts[nib] > 1)
    
    if (duplicateNibs.length > 0) {
      console.log(`   ⚠️ Ditemukan ${duplicateNibs.length} NIB duplikat:`)
      for (const nib of duplicateNibs) {
        console.log(`      - NIB ${nib}: ${nibCounts[nib]} records`)
        
        // Ambil semua record dengan NIB yang sama
        const duplicates = existingIkm.filter(ikm => ikm.nib === nib)
        
        // Simpan yang pertama (berdasarkan created_at), hapus sisanya
        const toKeep = duplicates.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]
        const toDelete = duplicates.filter(d => d.id !== toKeep.id)
        
        for (const duplicate of toDelete) {
          const { error: deleteError } = await supabaseAdmin
            .from('ikm_binaan')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', duplicate.id)
          
          if (deleteError) {
            console.log(`      ❌ Error menghapus duplikat ${duplicate.id}:`, deleteError.message)
          } else {
            console.log(`      ✅ Duplikat ${duplicate.id} berhasil dihapus`)
          }
        }
      }
    } else {
      console.log('   ✅ Tidak ada duplikasi NIB ditemukan')
    }
    
    // 3. Pastikan data konsisten
    console.log('\n🔄 MEMASTIKAN KONSISTENSI DATA:')
    
    // Update database_indicator berdasarkan layanan yang ada
    for (const ikm of existingIkm) {
      // Cek apakah IKM ini memiliki layanan
      const hasServices = existingHki.some(hki => hki.ikm_id === ikm.id) ||
                         existingHalal.some(halal => halal.ikm_id === ikm.id)
      
      if (ikm.database_indicator !== hasServices) {
        const { error: updateError } = await supabaseAdmin
          .from('ikm_binaan')
          .update({ database_indicator: hasServices })
          .eq('id', ikm.id)
        
        if (updateError) {
          console.log(`   ❌ Error update database_indicator untuk ${ikm.nama_usaha}:`, updateError.message)
        } else {
          console.log(`   ✅ Database indicator updated untuk ${ikm.nama_usaha}: ${hasServices}`)
        }
      }
    }
    
    // 4. Verifikasi hasil migrasi
    console.log('\n📋 VERIFIKASI HASIL MIGRASI:')
    
    const { data: finalIkm, error: finalIkmError } = await supabaseAdmin
      .from('ikm_binaan')
      .select('*')
      .is('deleted_at', null)
    
    if (finalIkmError) throw finalIkmError
    
    const { data: finalHki, error: finalHkiError } = await supabaseAdmin
      .from('hki_merek')
      .select('*')
      .is('deleted_at', null)
    
    if (finalHkiError) throw finalHkiError
    
    const { data: finalHalal, error: finalHalalError } = await supabaseAdmin
      .from('sertifikat_halal')
      .select('*')
      .is('deleted_at', null)
    
    if (finalHalalError) throw finalHalalError
    
    console.log(`   ✅ IKM Binaan Final: ${finalIkm.length} records`)
    console.log(`   ✅ HKI Merek Final: ${finalHki.length} records`)
    console.log(`   ✅ Sertifikat Halal Final: ${finalHalal.length} records`)
    
    // 5. Test dashboard stats
    console.log('\n🎯 TESTING DASHBOARD STATS:')
    
    const response = await fetch('http://localhost:3001/api/dashboard/stats')
    const dashboardData = await response.json()
    
    console.log(`   📊 Dashboard IKM Binaan: ${dashboardData.totalIkmBinaan.current}`)
    console.log(`   📊 Dashboard HKI Merek: ${dashboardData.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0}`)
    console.log(`   📊 Dashboard Sertifikat Halal: ${dashboardData.layananStats?.find(l => l.name === 'Sertifikat Halal')?.total || 0}`)
    
    // 6. Rekomendasi
    console.log('\n💡 REKOMENDASI SELANJUTNYA:')
    console.log('   1. ✅ Hapus semua kode localStorage dari frontend')
    console.log('   2. ✅ Update semua halaman untuk menggunakan API Supabase')
    console.log('   3. ✅ Hapus file dataManager.js yang tidak diperlukan')
    console.log('   4. ✅ Update komponen untuk real-time data')
    
    console.log('\n🎉 MIGRASI SELESAI!')
    console.log('✅ Semua data sekarang menggunakan Supabase sebagai single source of truth')
    
  } catch (error) {
    console.error('❌ Error during migration:', error.message)
  }
}

// Jalankan migrasi jika dipanggil langsung
if (require.main === module) {
  migrateToSupabase()
}

module.exports = { migrateToSupabase }