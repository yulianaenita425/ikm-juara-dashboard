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

// GET - Ambil semua data Pelatihan dengan join ke IKM Binaan dan Jenis Pelatihan
async function handleGet(req, res) {
  const { data, error } = await supabaseAdmin
    .from('pelatihan')
    .select(`
      *,
      ikm_binaan:ikm_id (
        nib,
        nik,
        nama_lengkap,
        alamat_lengkap,
        nama_usaha,
        nomor_hp
      ),
      jenis_pelatihan:jenis_pelatihan_id (
        jenis_pelatihan,
        sub_kegiatan,
        waktu_pelaksanaan,
        tempat,
        tahun_pelaksanaan
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pelatihan:', error)
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
  if (!ikm_id || !jenis_pelatihan_id || !nama_pelatihan) {
    return res.status(400).json({
      error: 'Field ikm_id, jenis_pelatihan_id, dan nama_pelatihan wajib diisi'
    })
  }

  // Cek apakah IKM sudah terdaftar di pelatihan yang sama
  const { data: existingPelatihan } = await supabaseAdmin
    .from('pelatihan')
    .select('id')
    .eq('ikm_id', ikm_id)
    .eq('jenis_pelatihan_id', jenis_pelatihan_id)
    .is('deleted_at', null)
    .single()

  if (existingPelatihan) {
    return res.status(400).json({
      error: 'IKM sudah terdaftar di pelatihan ini'
    })
  }

  // Insert data baru
  const { data, error } = await supabaseAdmin
    .from('pelatihan')
    .insert([{
      ikm_id,
      jenis_pelatihan_id,
      nama_pelatihan,
      tanggal_pelatihan: tanggal_pelatihan || new Date().toISOString().split('T')[0],
      sertifikat: sertifikat || null
    }])
    .select(`
      *,
      ikm_binaan:ikm_id (
        nib,
        nik,
        nama_lengkap,
        alamat_lengkap,
        nama_usaha,
        nomor_hp
      ),
      jenis_pelatihan:jenis_pelatihan_id (
        jenis_pelatihan,
        sub_kegiatan,
        waktu_pelaksanaan,
        tempat,
        tahun_pelaksanaan
      )
    `)
    .single()

  if (error) {
    console.error('Error inserting pelatihan:', error)
    throw error
  }

  return res.status(201).json({
    success: true,
    data: data,
    message: 'Peserta pelatihan berhasil ditambahkan'
  })
}

// PUT - Update data Pelatihan
async function handlePut(req, res) {
  const { id, sertifikat, tanggal_pelatihan } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID pelatihan wajib diisi'
    })
  }

  const updateData = {}
  if (sertifikat !== undefined) updateData.sertifikat = sertifikat
  if (tanggal_pelatihan !== undefined) updateData.tanggal_pelatihan = tanggal_pelatihan
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from('pelatihan')
    .update(updateData)
    .eq('id', id)
    .is('deleted_at', null)
    .select(`
      *,
      ikm_binaan:ikm_id (
        nib,
        nik,
        nama_lengkap,
        alamat_lengkap,
        nama_usaha,
        nomor_hp
      ),
      jenis_pelatihan:jenis_pelatihan_id (
        jenis_pelatihan,
        sub_kegiatan,
        waktu_pelaksanaan,
        tempat,
        tahun_pelaksanaan
      )
    `)
    .single()

  if (error) {
    console.error('Error updating pelatihan:', error)
    throw error
  }

  if (!data) {
    return res.status(404).json({
      error: 'Data pelatihan tidak ditemukan'
    })
  }

  return res.status(200).json({
    success: true,
    data: data,
    message: 'Data pelatihan berhasil diperbarui'
  })
}

// DELETE - Soft delete data Pelatihan
async function handleDelete(req, res) {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID pelatihan wajib diisi'
    })
  }

  const { data, error } = await supabaseAdmin
    .from('pelatihan')
    .update({ 
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .is('deleted_at', null)
    .select('id')
    .single()

  if (error) {
    console.error('Error deleting pelatihan:', error)
    throw error
  }

  if (!data) {
    return res.status(404).json({
      error: 'Data pelatihan tidak ditemukan'
    })
  }

  return res.status(200).json({
    success: true,
    message: 'Data pelatihan berhasil dihapus'
  })
}