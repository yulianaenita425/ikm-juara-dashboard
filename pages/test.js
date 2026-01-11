export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>Test Page</h1>
      <p>Jika Anda melihat halaman ini, server Next.js berjalan dengan baik!</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
          Ke Halaman Login
        </a>
      </div>
    </div>
  )
}