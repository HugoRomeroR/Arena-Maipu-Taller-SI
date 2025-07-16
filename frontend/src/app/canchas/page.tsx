'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

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

  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const [reservas, setReservas] = useState<any[]>([]);

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>

        <h2 style={{
          fontSize: '24px',
          marginBottom: '20px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px',
          color: '#333'
        }}>
          Calendario de Canchas
        </h2>

        <label style={{ fontWeight: 'bold' }}>Selecciona una fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{ marginBottom: 30, display: 'block' }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {canchas.map((cancha) => (
            <div key={cancha.id} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#0070f3' }}>{cancha.nombre}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {horarios.map((hora) => {
                  const estaReservado = reservas.some(
                    r => r.cancha === cancha.nombre && r.hora === hora && r.fecha === fecha
                  );

                  return (
                    <button
                      key={`${cancha.id}-${hora}`}
                      disabled={estaReservado}
                      onClick={() => {
                        if (session?.user) {
                          const query = new URLSearchParams({
                            cancha: cancha.nombre,
                            hora,
                            fecha
                          }).toString();
                          window.location.href = `/pago?${query}`;
                        } else {
                          alert("Debes iniciar sesión para reservar.");
                        }
                      }}
                      style={{
                        padding: '8px',
                        backgroundColor: estaReservado ? '#ccc' : '#f9f9f9',
                        color: estaReservado ? 'gray' : 'black',
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        width: '90px',
                        height: '60px',
                        fontWeight: 'bold',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                        cursor: estaReservado ? 'not-allowed' : 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <div>{hora}</div>
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
