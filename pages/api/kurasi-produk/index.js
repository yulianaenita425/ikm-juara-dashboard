import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('kurasi_produk')
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
      console.error('Error fetching Kurasi Produk:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      const { ikm_id, nomor_sertifikat, link_sertifikat } = req.body

      const { data, error } = await supabaseAdmin
        .from('kurasi_produk')
        .insert([{
          ikm_id,
          nomor_sertifikat,
          link_sertifikat
        }])
        .select()

      if (error) throw error

      res.status(201).json({ success: true, data })
    } catch (error) {
      console.error('Error creating Kurasi Produk:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ikm_id, nomor_sertifikat, link_sertifikat } = req.body

      const { data, error } = await supabaseAdmin
        .from('kurasi_produk')
        .update({
          ikm_id,
          nomor_sertifikat,
          link_sertifikat,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error updating Kurasi Produk:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body

      const { data, error } = await supabaseAdmin
        .from('kurasi_produk')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) throw error

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Error deleting Kurasi Produk:', error)
      res.status(500).json({ success: false, message: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}