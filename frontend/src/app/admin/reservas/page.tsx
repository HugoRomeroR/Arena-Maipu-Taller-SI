'use client';

import { useEffect, useState } from 'react';

export default function ReservasAdminPage() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch('/api/calendarios', { cache: 'no-store' });
        const data = await res.json();
        setReservas(data.reservas); // NO USES calendarios
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      }
    };

    fetchReservas();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Reservas registradas</h1>
      <table style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: 10 }}>Usuario</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 10 }}>Cancha</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 10 }}>Fecha</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 10 }}>Hora</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: 10 }}>{r.usuario}</td>
              <td style={{ padding: 10 }}>{r.cancha}</td>
              <td style={{ padding: 10 }}>{r.fecha}</td>
              <td style={{ padding: 10 }}>{r.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
