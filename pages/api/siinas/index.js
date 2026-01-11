import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('siinas')
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

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error fetching SIINas:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { ikm_id, nomor_bukti_akun, tahun_registrasi, link_bukti } = req.body

      const { data, error } = await supabaseAdmin
        .from('siinas')
        .insert([{
          ikm_id,
          nomor_bukti_akun,
          tahun_registrasi,
          link_bukti
        }])
        .select()

      if (error) throw error

      res.status(201).json({ success: true, data })
    } catch (error) {
      console.error('Error creating SIINas:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ikm_id, nomor_bukti_akun, tahun_registrasi, link_bukti } = req.body

      const { data, error } = await supabaseAdmin
        .from('siinas')
        .update({
          ikm_id,
          nomor_bukti_akun,
          tahun_registrasi,
          link_bukti,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error updating SIINas:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body

      const { data, error } = await supabaseAdmin
        .from('siinas')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error deleting SIINas:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}