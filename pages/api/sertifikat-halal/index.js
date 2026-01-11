// API endpoint untuk CRUD Sertifikat Halal
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
      case 'PUT':
        return await handlePut(req, res)
      case 'DELETE':
        return await handleDelete(req, res)
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Sertifikat Halal API error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
}

// GET - Ambil semua data Sertifikat Halal dengan join IKM Binaan
async function handleGet(req, res) {
  const { data, error } = await supabaseAdmin
    .from('sertifikat_halal')
    .select(`
      *,
      ikm_binaan:ikm_id (
        id,
        nib,
        nik,
        nama_lengkap,
        alamat_lengkap,
        nama_usaha,
        nomor_hp
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data || []
  })
}

// POST - Tambah data Sertifikat Halal baru
async function handlePost(req, res) {
  const { 
    ikm_id, 
    nomor_sertifikat, 
    link_sertifikat, 
    tahun_fasilitasi 
  } = req.body

  // Validasi input
  if (!ikm_id || !nomor_sertifikat || !link_sertifikat || !tahun_fasilitasi) {
    return res.status(400).json({
      error: 'Semua field wajib diisi'
    })
  }

  // Cek apakah IKM Binaan exists
  const { data: ikmExists } = await supabaseAdmin
    .from('ikm_binaan')
    .select('id')
    .eq('id', ikm_id)
    .is('deleted_at', null)
    .single()

  if (!ikmExists) {
    return res.status(400).json({
      error: 'IKM Binaan tidak ditemukan'
    })
  }

  // Insert data baru
  const { data, error } = await supabaseAdmin
    .from('sertifikat_halal')
    .insert([{
      ikm_id,
      nomor_sertifikat,
      link_sertifikat,
      tahun_fasilitasi
    }])
    .select(`
      *,
      ikm_binaan:ikm_id (
        id,
        nib,
        nik,
        nama_lengkap,
        alamat_lengkap,
        nama_usaha,
        nomor_hp
      )
    `)
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  return res.status(201).json({
    success: true,
    data: data,
    message: 'Data Sertifikat Halal berhasil ditambahkan'
  })
}

// PUT - Update data Sertifikat Halal
async function handlePut(req, res) {
  const { 
    id, 
    ikm_id, 
    nomor_sertifikat, 
    link_sertifikat, 
    tahun_fasilitasi 
  } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID diperlukan untuk update'
    })
  }

  // Update data
  const { data, error } = await supabaseAdmin
    .from('sertifikat_halal')
    .update({
      ikm_id,
      nomor_sertifikat,
      link_sertifikat,
      tahun_fasilitasi,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      ikm_binaan:ikm_id (
        id,
        nib,
        nik,
        nama_lengkap,
        alamat_lengkap,
        nama_usaha,
        nomor_hp
      )
    `)
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data,
    message: 'Data Sertifikat Halal berhasil diupdate'
  })
}

// DELETE - Soft delete Sertifikat Halal
async function handleDelete(req, res) {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID diperlukan untuk delete'
    })
  }

  // Soft delete
  const { data, error } = await supabaseAdmin
    .from('sertifikat_halal')
    .update({
      deleted_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data,
    message: 'Data Sertifikat Halal berhasil dihapus'
  })
}