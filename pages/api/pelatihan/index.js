// API endpoint untuk CRUD Pelatihan
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
    console.error('Pelatihan API error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
}

// GET - Ambil semua data Pelatihan dengan join IKM Binaan
async function handleGet(req, res) {
  const { data, error } = await supabaseAdmin
    .from('pelatihan')
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
      ),
      jenis_pelatihan:jenis_pelatihan_id (
        id,
        jenis_pelatihan,
        sub_kegiatan,
        waktu_pelaksanaan,
        tempat,
        tahun_pelaksanaan,
        status
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data || []
  })
}

// POST - Tambah data Pelatihan baru
async function handlePost(req, res) {
  const { 
    ikm_id, 
    jenis_pelatihan_id,
    nama_pelatihan, 
    tanggal_pelatihan, 
    sertifikat 
  } = req.body

  // Validasi input
  if (!ikm_id || !nama_pelatihan || !tanggal_pelatihan) {
    return res.status(400).json({
      error: 'Field ikm_id, nama_pelatihan, dan tanggal_pelatihan wajib diisi'
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
    .from('pelatihan')
    .insert([{
      ikm_id,
      jenis_pelatihan_id: jenis_pelatihan_id || null,
      nama_pelatihan,
      tanggal_pelatihan,
      sertifikat: sertifikat || null
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
      ),
      jenis_pelatihan:jenis_pelatihan_id (
        id,
        jenis_pelatihan,
        sub_kegiatan,
        waktu_pelaksanaan,
        tempat,
        tahun_pelaksanaan,
        status
      )
    `)
    .single()

  if (error) {
    throw error
  }

  return res.status(201).json({
    success: true,
    data: data,
    message: 'Data Pelatihan berhasil ditambahkan'
  })
}

// PUT - Update data Pelatihan
async function handlePut(req, res) {
  const { 
    id, 
    ikm_id, 
    nama_pelatihan, 
    tanggal_pelatihan, 
    sertifikat 
  } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID diperlukan untuk update'
    })
  }

  // Update data
  const { data, error } = await supabaseAdmin
    .from('pelatihan')
    .update({
      ikm_id,
      nama_pelatihan,
      tanggal_pelatihan,
      sertifikat,
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
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data,
    message: 'Data Pelatihan berhasil diupdate'
  })
}

// DELETE - Soft delete Pelatihan
async function handleDelete(req, res) {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID diperlukan untuk delete'
    })
  }

  // Soft delete
  const { data, error } = await supabaseAdmin
    .from('pelatihan')
    .update({
      deleted_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return res.status(200).json({
    success: true,
    data: data,
    message: 'Data Pelatihan berhasil dihapus'
  })
}