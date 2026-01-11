// API endpoint untuk CRUD Buku Tamu
import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (!supabaseAdmin) {
    return res.status(500).json({ 
      error: 'Supabase not configured'
    })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res)
      case 'POST':
        return await handlePost(req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Buku Tamu API error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
}

// GET - Ambil semua data Buku Tamu
async function handleGet(req, res) {
  const { data, error } = await supabaseAdmin
    .from('buku_tamu')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data || []
  })
}

// POST - Tambah data Buku Tamu baru
async function handlePost(req, res) {
  const { nama_lengkap, nomor_hp, alamat_lengkap } = req.body

  // Validasi input
  if (!nama_lengkap || !nomor_hp || !alamat_lengkap) {
    return res.status(400).json({
      error: 'Semua field wajib diisi'
    })
  }

  // Insert data baru
  const { data, error } = await supabaseAdmin
    .from('buku_tamu')
    .insert([{
      nama_lengkap,
      nomor_hp,
      alamat_lengkap
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return res.status(201).json({
    success: true,
    data: data,
    message: 'Data buku tamu berhasil disimpan'
  })
}