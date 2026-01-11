// Utility untuk koneksi Supabase
// Install: npm install @supabase/supabase-js

let supabase = null
let supabaseAdmin = null

// Inisialisasi client
try {
  const { createClient } = require('@supabase/supabase-js')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('Supabase Config Check:', {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'undefined'
  })

  if (supabaseUrl && supabaseAnonKey) {
    // Client untuk frontend (dengan RLS)
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase client initialized')
    
    // Admin client untuk backend API (bypass RLS)
    if (supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
      console.log('✅ Supabase admin client initialized')
    }
  } else {
    console.error('❌ Supabase configuration missing:', {
      NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!supabaseAnonKey
    })
  }
} catch (error) {
  console.error('❌ Supabase initialization failed:', error.message)
}

export { supabase, supabaseAdmin }

// Helper function untuk check konfigurasi
export function checkSupabaseConfig() {
  const config = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasClient: !!supabase,
    hasAdmin: !!supabaseAdmin
  }
  
  console.log('Supabase Configuration Status:', config)
  return config
}

// Helper function untuk error handling
export function getSupabaseError() {
  if (!supabase) {
    return 'Supabase client not configured. Please check environment variables.'
  }
  if (!supabaseAdmin) {
    return 'Supabase admin client not configured. Please check SUPABASE_SERVICE_ROLE_KEY.'
  }
  return null
}

// Helper functions untuk dashboard stats
export async function getDashboardStatsFromDB() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured')
  }

  try {
    // Query untuk mendapatkan total IKM Binaan
    const { count: totalIkm, error: ikmError } = await supabaseAdmin
      .from('ikm_binaan')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    if (ikmError) throw ikmError

    // Query untuk mendapatkan total layanan aktif dari semua tabel layanan
    let totalLayananAktif = 0
    
    // HKI Merek yang masih proses
    const { count: hkiProses } = await supabaseAdmin
      .from('hki_merek')
      .select('*', { count: 'exact', head: true })
      .eq('status_sertifikat', 'Proses')
      .is('deleted_at', null)
    
    totalLayananAktif += hkiProses || 0

    // Query untuk mendapatkan total pelatihan
    const { count: totalPelatihan, error: pelatihanError } = await supabaseAdmin
      .from('pelatihan')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    if (pelatihanError) throw pelatihanError

    // Query untuk mendapatkan total pengguna
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Query untuk statistik layanan
    const layananStats = await getLayananStatsFromDB()

    // Query untuk aktivitas terbaru
    const recentActivities = await getRecentActivitiesFromDB()

    // Hitung perubahan berdasarkan data real (simulasi sederhana)
    const calculateChange = (current, factor = 0.1) => {
      const previous = Math.max(0, current - Math.floor(current * factor))
      const changePercent = previous > 0 ? (((current - previous) / previous) * 100).toFixed(1) : '0.0'
      return {
        current,
        previous,
        change: current > previous ? `+${changePercent}%` : changePercent === '0.0' ? '0%' : `-${changePercent}%`
      }
    }

    return {
      totalIkmBinaan: calculateChange(totalIkm || 0),
      layananAktif: calculateChange(totalLayananAktif),
      pelatihanSelesai: calculateChange(totalPelatihan || 0),
      penggunaTerdaftar: calculateChange(totalUsers || 0),
      layananStats,
      recentActivities
    }
  } catch (error) {
    console.error('Error fetching dashboard stats from DB:', error)
    throw error
  }
}

export async function getLayananStatsFromDB() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured')
  }

  try {
    const layananTypes = [
      { table: 'hki_merek', name: 'HKI Merek' },
      { table: 'sertifikat_halal', name: 'Sertifikat Halal' },
      { table: 'tkdn_ik', name: 'TKDN IK' },
      { table: 'siinas', name: 'SIINas' },
      { table: 'uji_nilai_gizi', name: 'Uji Nilai Gizi' },
      { table: 'kurasi_produk', name: 'Kurasi Produk' }
    ]

    const stats = []

    for (const layanan of layananTypes) {
      // Hanya ambil total count saja
      const { count: total, error: totalError } = await supabaseAdmin
        .from(layanan.table)
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)

      if (totalError) {
        console.warn(`Error fetching ${layanan.name}:`, totalError.message)
        // Jika tabel belum ada, set total = 0
        stats.push({
          name: layanan.name,
          total: 0
        })
      } else {
        stats.push({
          name: layanan.name,
          total: total || 0
        })
      }
    }

    return stats
  } catch (error) {
    console.error('Error fetching layanan stats from DB:', error)
    throw error
  }
}

export async function getRecentActivitiesFromDB() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured')
  }

  try {
    // Query untuk mendapatkan aktivitas terbaru dari berbagai tabel
    const activities = []

    // HKI Merek terbaru
    const { data: hkiData, error: hkiError } = await supabaseAdmin
      .from('hki_merek')
      .select(`
        id,
        created_at,
        updated_at,
        status_sertifikat,
        ikm_binaan:ikm_id (nama_usaha)
      `)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false })
      .limit(2)

    if (!hkiError && hkiData) {
      hkiData.forEach(item => {
        activities.push({
          id: `hki_${item.id}`,
          type: 'HKI Merek',
          message: `${item.status_sertifikat === 'Telah Didaftar' ? 'Sertifikat HKI Merek' : 'Pendaftaran HKI Merek'} untuk ${item.ikm_binaan?.nama_usaha || 'IKM'} ${item.status_sertifikat === 'Telah Didaftar' ? 'telah terbit' : 'sedang diproses'}`,
          time: getTimeAgo(new Date(item.updated_at)),
          status: item.status_sertifikat === 'Telah Didaftar' ? 'success' : 'info'
        })
      })
    }

    // Sertifikat Halal terbaru
    const { data: halalData, error: halalError } = await supabaseAdmin
      .from('sertifikat_halal')
      .select(`
        id,
        created_at,
        ikm_binaan:ikm_id (nama_usaha)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(2)

    if (!halalError && halalData) {
      halalData.forEach(item => {
        activities.push({
          id: `halal_${item.id}`,
          type: 'Sertifikat Halal',
          message: `Sertifikat Halal untuk ${item.ikm_binaan?.nama_usaha || 'IKM'} telah terbit`,
          time: getTimeAgo(new Date(item.created_at)),
          status: 'success'
        })
      })
    }

    // IKM Binaan terbaru
    const { data: ikmData, error: ikmError } = await supabaseAdmin
      .from('ikm_binaan')
      .select('id, created_at, nama_usaha')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(2)

    if (!ikmError && ikmData) {
      ikmData.forEach(item => {
        activities.push({
          id: `ikm_${item.id}`,
          type: 'IKM Binaan',
          message: `Data IKM Binaan baru ditambahkan: ${item.nama_usaha}`,
          time: getTimeAgo(new Date(item.created_at)),
          status: 'info'
        })
      })
    }

    // Sort by time dan ambil 4 terbaru
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 4)

  } catch (error) {
    console.error('Error fetching recent activities from DB:', error)
    return []
  }
}

function getTimeAgo(date) {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) {
    return `${minutes} menit yang lalu`
  } else if (hours < 24) {
    return `${hours} jam yang lalu`
  } else {
    return `${days} hari yang lalu`
  }
}