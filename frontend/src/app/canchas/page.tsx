'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const canchas = [
  { id: 1, nombre: 'Cancha 1' },
  { id: 2, nombre: 'Cancha 2' },
  { id: 3, nombre: 'Cancha 3' },
  { id: 4, nombre: 'Cancha 4' },
  { id: 5, nombre: 'Cancha 5' },
  { id: 6, nombre: 'Cancha 6' },
  { id: 7, nombre: 'Cancha 7' },
  { id: 8, nombre: 'Cancha 9' },
  { id: 9, nombre: 'Cancha 10' },
  { id: 10, nombre: 'Cancha 11' },
  { id: 11, nombre: 'Cancha 12' },
  { id: 12, nombre: 'Cancha 13' }
];

const horarios = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
  '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-00:00',
];

export default function CalendarioPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [fecha, setFecha] = useState(() => {
    const param = searchParams.get('fecha');
    if (param) return param;

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // eslint-disable-next-line
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch(`/api/calendarios?fecha=${fecha}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setReservas(data);
        }
      } catch (error) {
        console.error('Error cargando reservas:', error);
      }
    };

    fetchReservas();
  }, [fecha]);

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#eaeff4',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '14px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        padding: '40px'
      }}>
        <h2 style={{
          fontSize: '28px',
          color: '#222',
          marginBottom: '24px',
          borderBottom: '2px solid #0070f3',
          paddingBottom: '10px'
        }}>
          Calendario de Canchas
        </h2>

        <label style={{ fontWeight: 600 }}>Selecciona una fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{
            marginBottom: '30px',
            display: 'block',
            padding: '10px 16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '15px'
          }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {canchas.map((cancha) => (
            <div key={cancha.id} style={{
              backgroundColor: '#fafafa',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #ddd'
            }}>
              <h3 style={{
                marginBottom: '12px',
                color: '#0070f3',
                fontSize: '20px'
              }}>{cancha.nombre}</h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {horarios.map((hora) => {
                  const estaReservado = reservas.some(
                    r => r.cancha === cancha.nombre && r.hora === hora && r.fecha === fecha
                  );

                  return (
                    <button
                      key={`${cancha.id}-${hora}`}
                      disabled={estaReservado}
                      onClick={() => {
                        if (!session?.user) {
                          alert("Debes iniciar sesión para reservar.");
                          return;
                        }

                        const query = new URLSearchParams({
                          cancha: cancha.nombre,
                          hora,
                          fecha
                        }).toString();

                        window.location.href = `/pago?${query}`;
                      }}
                      style={{
                        padding: '10px',
                        backgroundColor: estaReservado ? '#ddd' : '#f5f5f5',
                        color: estaReservado ? '#999' : '#333',
                        border: '1px solid #bbb',
                        borderRadius: '8px',
                        width: '90px',
                        height: '55px',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: estaReservado ? 'not-allowed' : 'pointer',
                        boxShadow: '1px 1px 3px rgba(0,0,0,0.05)'
                      }}
                    >
                      {hora}
                      {estaReservado && <div style={{ fontSize: '10px', color: 'red' }}>Reservado</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
