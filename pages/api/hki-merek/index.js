import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let data = []
      
      // Try to get real data from Supabase
      if (supabaseAdmin) {
        try {
          const { data: realData, error } = await supabaseAdmin
            .from('hki_merek')
            .select(`
              *,
              ikm_binaan (
                nib,
                nik,
                nama_lengkap,
                nama_usaha,
                alamat_lengkap,
                nomor_hp
              )
            `)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })

          if (error) {
            console.warn('Database query failed:', error.message)
            throw error
          }

          data = realData || []
          console.log(`✅ HKI Merek: Loaded ${data.length} records from database`)
          
        } catch (dbError) {
          console.warn(`❌ HKI Merek database error, using fallback:`, dbError.message)
          data = getFallbackData()
        }
      } else {
        console.log(`⚠️ HKI Merek: No database configured, using fallback data`)
        data = getFallbackData()
      }

      res.status(200).json({ 
        success: true, 
        data: data,
        source: data.length > 0 && data[0].id ? 'database' : 'fallback',
        count: data.length
      })
      
    } catch (error) {
      console.error(`Error in HKI Merek API:`, error)
      
      // Always return fallback data on error
      const fallbackData = getFallbackData()
      res.status(200).json({ 
        success: true, 
        data: fallbackData,
        source: 'fallback',
        count: fallbackData.length,
        warning: 'Using fallback data due to database error'
      })
    }
  } else if (req.method === 'POST') {
    // Handle POST requests
    try {
      const insertData = req.body
      
      if (!supabaseAdmin) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database not configured' 
        })
      }

      const { data, error } = await supabaseAdmin
        .from('hki_merek')
        .insert(insertData)
        .select()

      if (error) throw error

      res.status(201).json({ 
        success: true, 
        data: data[0],
        message: 'HKI Merek berhasil ditambahkan'
      })
      
    } catch (error) {
      console.error(`Error creating HKI Merek:`, error)
      res.status(500).json({ 
        success: false, 
        message: error.message 
      })
    }
  } else if (req.method === 'PUT') {
    // Handle PUT requests
    try {
      const { id, ...updateData } = req.body
      
      if (!supabaseAdmin) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database not configured' 
        })
      }

      const { data, error } = await supabaseAdmin
        .from('hki_merek')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ 
        success: true, 
        data: data[0],
        message: 'HKI Merek berhasil diperbarui'
      })
      
    } catch (error) {
      console.error(`Error updating HKI Merek:`, error)
      res.status(500).json({ 
        success: false, 
        message: error.message 
      })
    }
  } else if (req.method === 'DELETE') {
    // Handle DELETE requests (soft delete)
    try {
      const { id } = req.body
      
      if (!supabaseAdmin) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database not configured' 
        })
      }

      const { error } = await supabaseAdmin
        .from('hki_merek')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      res.status(200).json({ 
        success: true,
        message: 'HKI Merek berhasil dihapus'
      })
      
    } catch (error) {
      console.error(`Error deleting HKI Merek:`, error)
      res.status(500).json({ 
        success: false, 
        message: error.message 
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

// Fallback data when database is not available
function getFallbackData() {
  return [
  {
    "id": "sample-1",
    "nomor_pendaftaran": "HKI001/2024",
    "link_bukti_daftar": "https://example.com/hki-bukti-1.pdf",
    "status_sertifikat": "Telah Didaftar",
    "tahun_fasilitasi": 2024,
    "link_sertifikat": "https://example.com/hki-sertifikat-1.pdf",
    "ikm_binaan": {
      "nib": "1909210016219",
      "nik": "3201234567890123",
      "nama_lengkap": "Ahmad Wijaya",
      "nama_usaha": "CV. Berkah Jaya"
    }
  },
  {
    "id": "sample-2",
    "nomor_pendaftaran": "HKI002/2024",
    "link_bukti_daftar": "https://example.com/hki-bukti-2.pdf",
    "status_sertifikat": "Proses",
    "tahun_fasilitasi": 2024,
    "link_sertifikat": null,
    "ikm_binaan": {
      "nib": "1909210016220",
      "nik": "3201234567890124",
      "nama_lengkap": "Siti Nurhaliza",
      "nama_usaha": "PT. Maju Bersama"
    }
  }
]
}
