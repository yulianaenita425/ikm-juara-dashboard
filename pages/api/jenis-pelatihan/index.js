// API endpoint untuk CRUD Jenis Pelatihan
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
    console.error('Jenis Pelatihan API error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    })
  }
}

// GET - Ambil semua data Jenis Pelatihan dengan jumlah peserta
async function handleGet(req, res) {
  // Ambil data jenis pelatihan
  const { data: jenisData, error: jenisError } = await supabaseAdmin
    .from('jenis_pelatihan')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (jenisError) {
    throw jenisError
  }

  // Ambil jumlah peserta untuk setiap jenis pelatihan
  const jenisWithPeserta = await Promise.all(
    (jenisData || []).map(async (jenis) => {
      const { count, error: countError } = await supabaseAdmin
        .from('pelatihan')
        .select('id', { count: 'exact' })
        .eq('jenis_pelatihan_id', jenis.id)
        .is('deleted_at', null)

      if (countError) {
        console.error('Error counting peserta:', countError)
      }

      return {
        ...jenis,
        jumlah_peserta: count || 0
      }
    })
  )

  return res.status(200).json({
    success: true,
    data: jenisWithPeserta
  })
}

// POST - Tambah data Jenis Pelatihan baru
async function handlePost(req, res) {
  const { 
    jenis_pelatihan, 
    sub_kegiatan, 
    waktu_pelaksanaan,
    tempat,
    link_materi,
    tahun_pelaksanaan,
    status
  } = req.body

  // Validasi input
  if (!jenis_pelatihan || !sub_kegiatan || !waktu_pelaksanaan || !tempat || !tahun_pelaksanaan) {
    return res.status(400).json({
      error: 'Field jenis_pelatihan, sub_kegiatan, waktu_pelaksanaan, tempat, dan tahun_pelaksanaan wajib diisi'
    })
  }

  // Insert data baru
  const { data, error } = await supabaseAdmin
    .from('jenis_pelatihan')
    .insert([{
      jenis_pelatihan,
      sub_kegiatan,
      waktu_pelaksanaan,
      tempat,
      link_materi: link_materi || null,
      tahun_pelaksanaan,
      status: status || 'Aktif'
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return res.status(201).json({
    success: true,
    data: data,
    message: 'Jenis Pelatihan berhasil ditambahkan'
  })
}

// PUT - Update data Jenis Pelatihan
async function handlePut(req, res) {
  const { 
    id, 
    jenis_pelatihan, 
    sub_kegiatan, 
    waktu_pelaksanaan,
    tempat,
    link_materi,
    tahun_pelaksanaan,
    status
  } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID diperlukan untuk update'
    })
  }

  // Update data
  const { data, error } = await supabaseAdmin
    .from('jenis_pelatihan')
    .update({
      jenis_pelatihan,
      sub_kegiatan,
      waktu_pelaksanaan,
      tempat,
      link_materi: link_materi || null,
      tahun_pelaksanaan,
      status,
      updated_at: new Date().toISOString()
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
    message: 'Jenis Pelatihan berhasil diupdate'
  })
}

// DELETE - Soft delete Jenis Pelatihan
async function handleDelete(req, res) {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({
      error: 'ID diperlukan untuk delete'
    })
  }

  // Soft delete
  const { data, error } = await supabaseAdmin
    .from('jenis_pelatihan')
    .update({
      deleted_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()

  if (error) {
    throw error
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      error: 'Jenis Pelatihan tidak ditemukan'
    })
  }

  return res.status(200).json({
    success: true,
    message: 'Jenis Pelatihan berhasil dihapus'
  })
}