import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let data = []
      
      // Try to get real data from Supabase
      if (supabaseAdmin) {
        try {
          const { data: realData, error } = await supabaseAdmin
            .from('uji_nilai_gizi')
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
          console.log(`✅ Uji Nilai Gizi: Loaded ${data.length} records from database`)
          
        } catch (dbError) {
          console.warn(`❌ Uji Nilai Gizi database error, using fallback:`, dbError.message)
          data = getFallbackData()
        }
      } else {
        console.log(`⚠️ Uji Nilai Gizi: No database configured, using fallback data`)
        data = getFallbackData()
      }

      res.status(200).json({ 
        success: true, 
        data: data,
        source: data.length > 0 && data[0].id ? 'database' : 'fallback',
        count: data.length
      })
      
    } catch (error) {
      console.error(`Error in Uji Nilai Gizi API:`, error)
      
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
        .from('uji_nilai_gizi')
        .insert(insertData)
        .select()

      if (error) throw error

      res.status(201).json({ 
        success: true, 
        data: data[0],
        message: 'Uji Nilai Gizi berhasil ditambahkan'
      })
      
    } catch (error) {
      console.error(`Error creating Uji Nilai Gizi:`, error)
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
        .from('uji_nilai_gizi')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ 
        success: true, 
        data: data[0],
        message: 'Uji Nilai Gizi berhasil diperbarui'
      })
      
    } catch (error) {
      console.error(`Error updating Uji Nilai Gizi:`, error)
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
        .from('uji_nilai_gizi')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      res.status(200).json({ 
        success: true,
        message: 'Uji Nilai Gizi berhasil dihapus'
      })
      
    } catch (error) {
      console.error(`Error deleting Uji Nilai Gizi:`, error)
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
    "nomor_lhu": "LHU001/2024",
    "tanggal_hasil_uji": "2024-02-15",
    "tahun_fasilitasi": 2024,
    "link_lhu": "https://example.com/lhu-1.pdf",
    "ikm_binaan": {
      "nib": "1909210016219",
      "nik": "3201234567890123",
      "nama_lengkap": "Ahmad Wijaya",
      "nama_usaha": "CV. Berkah Jaya"
    }
  },
  {
    "id": "sample-2",
    "nomor_lhu": "LHU002/2024",
    "tanggal_hasil_uji": "2024-03-15",
    "tahun_fasilitasi": 2024,
    "link_lhu": "https://example.com/lhu-2.pdf",
    "ikm_binaan": {
      "nib": "1909210016221",
      "nik": "3201234567890125",
      "nama_lengkap": "Budi Santoso",
      "nama_usaha": "UD. Sejahtera"
    }
  }
]
}
