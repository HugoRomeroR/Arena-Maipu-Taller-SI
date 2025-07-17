'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function EstadisticasAdminPage() {
  const [estadisticas, setEstadisticas] = useState({
    canchas: [],
    clientes: [],
    totales: { reservas: 0, usuarios: 0 }
  });

  useEffect(() => {
    const fetchEstadisticas = async () => {
      const res = await fetch('/api/estadisticas');
      const data = await res.json();
      setEstadisticas(data);
    };
    fetchEstadisticas();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#222' }}>Panel de Estadísticas</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '20px', color: '#0070f3' }}>Resumen General</h3>
        <p>Total de reservas: <strong>{estadisticas.totales.reservas}</strong></p>
        <p>Clientes únicos: <strong>{estadisticas.totales.usuarios}</strong></p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', color: '#0070f3' }}>Canchas más reservadas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={estadisticas.canchas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cancha" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="reservas" fill="#0070f3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 style={{ fontSize: '20px', color: '#0070f3' }}>Clientes frecuentes</h3>
        <ul>
          {estadisticas.clientes.map((cliente: any, idx: number) => (
            <li key={idx}>
              {cliente.nombre} - {cliente.reservas} reservas
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
