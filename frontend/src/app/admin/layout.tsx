// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <aside style={{
        width: '240px',
        backgroundColor: '#ffffff',
        padding: '30px 20px',
        boxShadow: '2px 0 6px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '22px',
          color: '#0070f3',
          marginBottom: '30px'
        }}>Panel Admin</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '20px' }}>
              <a href="/admin/reservas" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: 500
              }}> Ver Reservas</a>
            </li>
            <li style={{ marginBottom: '20px' }}>
              <a href="/admin/estadisticas" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: 500
              }}> Estadísticas</a>
            </li>
            <li>
              <a href="/admin/clientes" style={{
                color: '#333',
                textDecoration: 'none',
                fontWeight: 500
              }}> Clientes Frecuentes</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main style={{
        flex: 1,
        padding: '40px',
        backgroundColor: '#f4f6f8'
      }}>
        {children}
      </main>
    </div>
  );
}
