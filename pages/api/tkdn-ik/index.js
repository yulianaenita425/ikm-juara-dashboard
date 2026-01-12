import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let data = []
      
      if (supabaseAdmin) {
        try {
          const { data: realData, error } = await supabaseAdmin
            .from('tkdn_ik')
            .select(`
              *,
              ikm_binaan (
                nib,
                nik,
                nama_lengkap,
                nama_usaha
              )
            `)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })

          if (error) throw error

          // Add default status_sertifikat if column doesn't exist
          data = (realData || []).map(item => ({
            ...item,
            status_sertifikat: item.status_sertifikat || 'Proses',
            persentase_tkdn: item.persentase_tkdn || 0
          }))
          
          console.log(`✅ TKDN IK: Loaded ${data.length} records from database`)
          
        } catch (dbError) {
          console.warn('❌ TKDN IK database error, using fallback:', dbError.message)
          data = getFallbackTKDNData()
        }
      } else {
        console.log('⚠️ TKDN IK: No database configured, using fallback data')
        data = getFallbackTKDNData()
      }

      res.status(200).json({ 
        success: true, 
        data: data,
        source: data.length > 0 && data[0].id && !data[0].id.startsWith('sample') ? 'database' : 'fallback',
        count: data.length
      })
      
    } catch (error) {
      console.error('Error in TKDN IK API:', error)
      
      const fallbackData = getFallbackTKDNData()
      res.status(200).json({ 
        success: true, 
        data: fallbackData,
        source: 'fallback',
        count: fallbackData.length,
        warning: 'Using fallback data due to database error'
      })
    }
  } else if (req.method === 'POST') {
    try {
      const { ikm_id, nomor_sertifikat, persentase_tkdn, status_sertifikat, link_sertifikat, tahun_terbit } = req.body

      if (!supabaseAdmin) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database not configured' 
        })
      }

      const insertData = {
        ikm_id,
        nomor_sertifikat,
        persentase_tkdn: parseFloat(persentase_tkdn) || 0,
        link_sertifikat,
        tahun_terbit,
        status_sertifikat: status_sertifikat || 'Proses'
      }

      const { data, error } = await supabaseAdmin
        .from('tkdn_ik')
        .insert(insertData)
        .select()

      if (error) throw error

      res.status(201).json({ 
        success: true, 
        data: data[0],
        message: 'TKDN IK berhasil ditambahkan'
      })
      
    } catch (error) {
      console.error('Error creating TKDN IK:', error)
      res.status(500).json({ 
        success: false, 
        message: error.message 
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body
      
      if (!supabaseAdmin) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database not configured' 
        })
      }

      // Ensure persentase_tkdn is a number
      if (updateData.persentase_tkdn) {
        updateData.persentase_tkdn = parseFloat(updateData.persentase_tkdn) || 0
      }

      const { data, error } = await supabaseAdmin
        .from('tkdn_ik')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ 
        success: true, 
        data: data[0],
        message: 'TKDN IK berhasil diperbarui'
      })
      
    } catch (error) {
      console.error('Error updating TKDN IK:', error)
      res.status(500).json({ 
        success: false, 
        message: error.message 
      })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      
      if (!supabaseAdmin) {
        return res.status(500).json({ 
          success: false, 
          message: 'Database not configured' 
        })
      }

      const { error } = await supabaseAdmin
        .from('tkdn_ik')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      res.status(200).json({ 
        success: true,
        message: 'TKDN IK berhasil dihapus'
      })
      
    } catch (error) {
      console.error('Error deleting TKDN IK:', error)
      res.status(500).json({ 
        success: false, 
        message: error.message 
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

function getFallbackTKDNData() {
  return [
    {
      id: 'sample-1',
      nomor_sertifikat: 'TKDN001/2024',
      persentase_tkdn: 50,
      status_sertifikat: 'Proses',
      link_sertifikat: 'https://example.com/tkdn-1.pdf',
      tahun_terbit: 2024,
      ikm_binaan: {
        nib: '1909210016219',
        nik: '3201234567890123',
        nama_lengkap: 'Ahmad Wijaya',
        nama_usaha: 'CV. Berkah Jaya'
      }
    },
    {
      id: 'sample-2',
      nomor_sertifikat: 'TKDN002/2024',
      persentase_tkdn: 75,
      status_sertifikat: 'Aktif',
      link_sertifikat: 'https://example.com/tkdn-2.pdf',
      tahun_terbit: 2024,
      ikm_binaan: {
        nib: '1909210016220',
        nik: '3201234567890124',
        nama_lengkap: 'Siti Nurhaliza',
        nama_usaha: 'PT. Maju Bersama'
      }
    }
  ]
}
