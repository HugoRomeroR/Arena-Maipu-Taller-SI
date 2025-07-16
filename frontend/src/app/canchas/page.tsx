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

  const [modal, setModal] = useState<{ cancha: string; hora: string } | null>(null);
  const [reservas, setReservas] = useState<any[]>([]);

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0070f3' }}>Reservar Canchas</h1>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          Selecciona una fecha y elige tu horario preferido
        </p>
      </div>

      <label style={{ fontWeight: 'bold' }}>Selecciona una fecha:</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        style={{ marginBottom: 40, display: 'block' }}
      />

      {fecha && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {canchas.map((cancha) => (
            <div key={cancha.id} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ color: '#333' }}>{cancha.nombre}</h2>
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
                          setModal({ cancha: cancha.nombre, hora });
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
                        fontSize: '12px',
                        transition: 'transform 0.1s ease-in-out'
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
      )}

      {modal && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '24px', borderRadius: '8px',
            width: '300px', textAlign: 'center'
          }}>
            <h3>Confirmar Reserva</h3>
            <p><strong>Usuario:</strong> {session?.user?.name}</p>
            <p><strong>Cancha:</strong> {modal.cancha}</p>
            <p><strong>Horario:</strong> {modal.hora}</p>
            <button
              onClick={() => {
                setReservas([...reservas, {
                  usuario: session?.user?.name,
                  cancha: modal.cancha,
                  hora: modal.hora,
                  fecha
                }]);
                setModal(null);
              }}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Confirmar
            </button>
            <button
              onClick={() => setModal(null)}
              style={{
                marginTop: '10px',
                marginLeft: '10px',
                padding: '10px 20px',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
