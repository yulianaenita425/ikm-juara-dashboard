import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PreviewPage() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPreviewData()
  }, [])

  const loadPreviewData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading preview data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ color: '#991b1b', fontSize: '2rem', marginBottom: '1rem' }}>
            Error Loading Preview
          </h1>
          <p style={{ color: '#dc2626', marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#dc2626',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '1rem' 
        }}>
          Preview Aplikasi IKM JUARA
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280', 
          marginBottom: '1.5rem' 
        }}>
          Database IKM JUARA DisnakerKUKM Kota Madiun
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          background: '#dcfce7',
          color: '#166534',
          borderRadius: '9999px',
          fontSize: '0.875rem'
        }}>
          ✅ Migrasi Supabase Selesai - Zero Duplikasi Data
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Memuat data statistik...</p>
        </div>
      )}

      {/* Statistics Overview */}
      {!loading && stats && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            textAlign: 'center', 
            marginBottom: '2rem' 
          }}>
            Statistik Real-time
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: '#3b82f6',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginRight: '1rem'
                }}>
                  🏢
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                    Total IKM Binaan
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {stats.totalIkmBinaan.current}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: '#10b981',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginRight: '1rem'
                }}>
                  📄
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                    HKI Merek
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {stats.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: '#8b5cf6',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginRight: '1rem'
                }}>
                  ✅
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                    Sertifikat Halal
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {stats.layananStats?.find(l => l.name === 'Sertifikat Halal')?.total || 0}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: '#f59e0b',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginRight: '1rem'
                }}>
                  👥
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>
                    Total Layanan
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {stats.layananStats?.reduce((sum, l) => sum + l.total, 0) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          textAlign: 'center', 
          marginBottom: '2rem' 
        }}>
          Fitur Aplikasi
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { title: 'Dashboard Real-time', desc: 'Monitoring statistik real-time', icon: '📊', path: '/dashboard', active: true },
            { title: 'Manajemen IKM Binaan', desc: 'CRUD lengkap data IKM', icon: '🏢', path: '/ikm-binaan', active: true },
            { title: 'HKI Merek', desc: 'Pengelolaan HKI Merek', icon: '📄', path: '/layanan/hki-merek', active: true },
            { title: 'Sertifikat Halal', desc: 'Manajemen sertifikat halal', icon: '✅', path: '/layanan/sertifikat-halal', active: true },
            { title: 'TKDN IK', desc: 'Tingkat Komponen Dalam Negeri', icon: '⚙️', path: '/layanan/tkdn-ik', active: false },
            { title: 'SIINas', desc: 'Sistem Informasi Industri', icon: '📋', path: '/layanan/siinas', active: false }
          ].map((feature, index) => (
            <div
              key={index}
              onClick={() => feature.active ? router.push(feature.path) : alert(`Fitur ${feature.title} sedang dalam pengembangan`)}
              style={{
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                padding: '1.5rem',
                cursor: feature.active ? 'pointer' : 'not-allowed',
                opacity: feature.active ? 1 : 0.75,
                transition: 'all 0.3s ease',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                if (feature.active) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)'
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>{feature.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
                    {feature.title}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '9999px',
                    background: feature.active ? '#dcfce7' : '#fef3c7',
                    color: feature.active ? '#166534' : '#92400e'
                  }}>
                    {feature.active ? 'Aktif' : 'Pengembangan'}
                  </span>
                </div>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                {feature.desc}
              </p>
              {feature.active && (
                <div style={{ marginTop: '1rem', color: '#2563eb', fontSize: '0.875rem' }}>
                  → Klik untuk mengakses
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button
          onClick={() => router.push('/login')}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '0.75rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginRight: '1rem',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.background = '#2563eb'}
        >
          Masuk ke Aplikasi
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: '#059669',
            color: 'white',
            padding: '0.75rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#047857'}
          onMouseLeave={(e) => e.target.style.background = '#059669'}
        >
          Lihat Dashboard
        </button>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}