export default function SimpleLogin() {
  const handleLogin = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      margin: 0, 
      padding: '20px', 
      background: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%',
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          background: '#3b82f6', 
          borderRadius: '50%', 
          margin: '0 auto 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          fontWeight: 'bold', 
          fontSize: '18px' 
        }}>
          IKM
        </div>
        
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333', 
          marginBottom: '10px' 
        }}>
          Database IKM JUARA
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '30px' 
        }}>
          DisnakerKUKM Kota Madiun
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            color: '#333', 
            fontWeight: '500' 
          }}>
            Username
          </label>
          <input 
            type="text" 
            placeholder="admin" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px', 
              fontSize: '16px', 
              boxSizing: 'border-box' 
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            color: '#333', 
            fontWeight: '500' 
          }}>
            Password
          </label>
          <input 
            type="password" 
            placeholder="admin123" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px', 
              fontSize: '16px', 
              boxSizing: 'border-box' 
            }}
          />
        </div>
        
        <button 
          onClick={handleLogin}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '16px', 
            fontWeight: '500', 
            cursor: 'pointer' 
          }}
        >
          Login Admin
        </button>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px' 
        }}>
          <a 
            href="/test" 
            style={{ 
              color: '#3b82f6', 
              textDecoration: 'none', 
              margin: '0 10px' 
            }}
          >
            Test Page
          </a>
          <a 
            href="/login" 
            style={{ 
              color: '#3b82f6', 
              textDecoration: 'none', 
              margin: '0 10px' 
            }}
          >
            Original Login
          </a>
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#e3f2fd', 
          borderRadius: '4px', 
          fontSize: '14px', 
          color: '#1976d2' 
        }}>
          <strong>Status:</strong> Server berjalan di localhost:3000<br/>
          <strong>Test:</strong> Jika Anda melihat halaman ini, website berfungsi!
        </div>
      </div>
    </div>
  )
}