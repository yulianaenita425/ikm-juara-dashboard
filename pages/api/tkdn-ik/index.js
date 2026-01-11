import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
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
      const processedData = data.map(item => ({
        ...item,
        status_sertifikat: item.status_sertifikat || 'Proses'
      }))

      res.status(200).json({ success: true, data: processedData })
    } catch (error) {
      console.error('Error fetching TKDN IK:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { ikm_id, nomor_sertifikat, persentase_tkdn, status_sertifikat, link_sertifikat, tahun_terbit } = req.body

      // Prepare insert data - only include status_sertifikat if column exists
      const insertData = {
        ikm_id,
        nomor_sertifikat,
        persentase_tkdn: parseFloat(persentase_tkdn) || 0,
        link_sertifikat,
        tahun_terbit
      }

      // Try to include status_sertifikat, but handle if column doesn't exist
      if (status_sertifikat) {
        insertData.status_sertifikat = status_sertifikat
      }

      const { data, error } = await supabaseAdmin
        .from('tkdn_ik')
        .insert([insertData])
        .select(`
          *,
          ikm_binaan (
            nib,
            nik,
            nama_lengkap,
            nama_usaha
          )
        `)

      if (error) {
        // If error is about status_sertifikat column, try without it
        if (error.message.includes('status_sertifikat')) {
          console.log('⚠️  status_sertifikat column not found, inserting without it')
          delete insertData.status_sertifikat
          
          const { data: retryData, error: retryError } = await supabaseAdmin
            .from('tkdn_ik')
            .insert([insertData])
            .select(`
              *,
              ikm_binaan (
                nib,
                nik,
                nama_lengkap,
                nama_usaha
              )
            `)

          if (retryError) throw retryError
          
          // Add status_sertifikat to response data for frontend compatibility
          if (retryData && retryData[0]) {
            retryData[0].status_sertifikat = status_sertifikat || 'Proses'
          }
          
          res.status(201).json({ success: true, data: retryData[0] })
          return
        }
        throw error
      }

      res.status(201).json({ success: true, data: data[0] })
    } catch (error) {
      console.error('Error creating TKDN IK:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ikm_id, nomor_sertifikat, persentase_tkdn, status_sertifikat, link_sertifikat, tahun_terbit } = req.body

      // Prepare update data - only include status_sertifikat if column exists
      const updateData = {
        ikm_id,
        nomor_sertifikat,
        persentase_tkdn: parseFloat(persentase_tkdn) || 0,
        link_sertifikat,
        tahun_terbit,
        updated_at: new Date().toISOString()
      }

      // Try to include status_sertifikat, but handle if column doesn't exist
      if (status_sertifikat) {
        updateData.status_sertifikat = status_sertifikat
      }

      const { data, error } = await supabaseAdmin
        .from('tkdn_ik')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          ikm_binaan (
            nib,
            nik,
            nama_lengkap,
            nama_usaha
          )
        `)

      if (error) {
        // If error is about status_sertifikat column, try without it
        if (error.message.includes('status_sertifikat')) {
          console.log('⚠️  status_sertifikat column not found, updating without it')
          delete updateData.status_sertifikat
          
          const { data: retryData, error: retryError } = await supabaseAdmin
            .from('tkdn_ik')
            .update(updateData)
            .eq('id', id)
            .select(`
              *,
              ikm_binaan (
                nib,
                nik,
                nama_lengkap,
                nama_usaha
              )
            `)

          if (retryError) throw retryError
          
          // Add status_sertifikat to response data for frontend compatibility
          if (retryData && retryData[0]) {
            retryData[0].status_sertifikat = status_sertifikat || 'Proses'
          }
          
          res.status(200).json({ success: true, data: retryData[0] })
          return
        }
        throw error
      }

      res.status(200).json({ success: true, data: data[0] })
    } catch (error) {
      console.error('Error updating TKDN IK:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body

      const { data, error } = await supabaseAdmin
        .from('tkdn_ik')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error deleting TKDN IK:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}