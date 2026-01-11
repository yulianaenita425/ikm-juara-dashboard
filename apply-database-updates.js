// Script untuk menerapkan database updates secara otomatis
import { supabaseAdmin } from './lib/supabase.js'

async function applyDatabaseUpdates() {
  console.log('🗄️ Applying database updates...\n')
  
  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not configured')
    return false
  }

  try {
    // 1. Update sertifikat_halal schema
    console.log('1. Updating sertifikat_halal schema...')
    const { error: error1 } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE sertifikat_halal 
        ADD COLUMN IF NOT EXISTS logo_halal TEXT;
      `
    })
    
    if (error1) {
      console.log('⚠️ sertifikat_halal update:', error1.message)
    } else {
      console.log('✅ sertifikat_halal schema updated')
    }

    // 2. Update tkdn_ik schema
    console.log('2. Updating tkdn_ik schema...')
    const { error: error2 } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE tkdn_ik 
        ADD COLUMN IF NOT EXISTS persentase_tkdn DECIMAL(5,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';
      `
    })
    
    if (error2) {
      console.log('⚠️ tkdn_ik update:', error2.message)
    } else {
      console.log('✅ tkdn_ik schema updated')
    }

    // 3. Create jenis_pelatihan table
    console.log('3. Creating jenis_pelatihan table...')
    const { data: tableExists } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'jenis_pelatihan')
      .single()

    if (!tableExists) {
      const { error: error3 } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          CREATE TABLE jenis_pelatihan (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            jenis_pelatihan TEXT NOT NULL,
            sub_kegiatan TEXT NOT NULL,
            waktu_pelaksanaan TEXT NOT NULL,
            tempat TEXT NOT NULL,
            link_materi TEXT,
            tahun_pelaksanaan INTEGER NOT NULL,
            status VARCHAR(20) CHECK (status IN ('Aktif', 'Selesai', 'Ditunda')) DEFAULT 'Aktif',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at TIMESTAMP WITH TIME ZONE NULL
          );
        `
      })
      
      if (error3) {
        console.log('⚠️ jenis_pelatihan creation:', error3.message)
      } else {
        console.log('✅ jenis_pelatihan table created')
      }
    } else {
      console.log('✅ jenis_pelatihan table already exists')
    }

    // 4. Insert sample data
    console.log('4. Inserting sample data...')
    const { error: error4 } = await supabaseAdmin
      .from('jenis_pelatihan')
      .upsert([
        {
          jenis_pelatihan: 'Digital Marketing untuk UMKM',
          sub_kegiatan: 'Pemasaran Online dan Media Sosial',
          waktu_pelaksanaan: '15-17 Januari 2024, 08:00-16:00 WIB',
          tempat: 'Aula Dinas Perindustrian Kota Madiun',
          tahun_pelaksanaan: 2024,
          status: 'Aktif'
        },
        {
          jenis_pelatihan: 'Manajemen Keuangan UMKM',
          sub_kegiatan: 'Pembukuan dan Laporan Keuangan',
          waktu_pelaksanaan: '20-22 Februari 2024, 08:00-16:00 WIB',
          tempat: 'Aula Dinas Perindustrian Kota Madiun',
          tahun_pelaksanaan: 2024,
          status: 'Aktif'
        },
        {
          jenis_pelatihan: 'Pengembangan Produk',
          sub_kegiatan: 'Inovasi dan Desain Produk',
          waktu_pelaksanaan: '10-12 Maret 2024, 08:00-16:00 WIB',
          tempat: 'Aula Dinas Perindustrian Kota Madiun',
          tahun_pelaksanaan: 2024,
          status: 'Selesai'
        }
      ], { 
        onConflict: 'jenis_pelatihan,sub_kegiatan',
        ignoreDuplicates: true 
      })
    
    if (error4) {
      console.log('⚠️ Sample data insertion:', error4.message)
    } else {
      console.log('✅ Sample data inserted')
    }

    console.log('\n🎉 Database updates completed successfully!')
    return true

  } catch (error) {
    console.error('❌ Database update failed:', error)
    return false
  }
}

applyDatabaseUpdates()