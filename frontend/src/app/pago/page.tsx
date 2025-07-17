'use client';

import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PagoPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const cancha = searchParams.get('cancha');
  const hora = searchParams.get('hora');
  const fecha = searchParams.get('fecha');
const confirmarPago = async () => {
  const res = await fetch('/api/calendarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: session?.user?.name || session?.user?.email,
      cancha,
      hora,
      fecha
    })
  });

  const result = await res.json();
  if (result.success) {
    alert('Reserva registrada con éxito');
    window.location.href = `/canchas?fecha=${fecha}`;
  } else {
    alert('Error al registrar la reserva');
  }
};

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>

        {/* Encabezado */}
        <h2 style={{
          fontSize: '24px',
          marginBottom: '20px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px',
          color: '#333'
        }}>
          Detalles de la Reserva
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ width: '48%' }}>
            <p><strong>Cancha:</strong> {cancha}</p>
            <p><strong>Fecha:</strong> {fecha}</p>
            <p><strong>Horario:</strong> {hora}</p>
          </div>
          <div style={{ width: '48%' }}>
            <p><strong>Categoría:</strong> Futbolito</p>
            <p><strong>Estado:</strong> Pendiente de pago</p>
            <p><strong>Duración:</strong> 1 hora</p>
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          backgroundColor: '#e6f4ea',
          borderRadius: '8px',
          color: '#2e7d32',
          fontSize: '14px'
        }}>
          El sistema registrará tu reserva una vez realizado el pago correctamente.
        </div>

        {/* Información del usuario */}
        <h3 style={{
          fontSize: '20px',
          marginTop: '30px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '8px'
        }}>
          Tus datos
        </h3>
        <div style={{ marginTop: '10px' }}>
          <p><strong>Nombre:</strong> {session?.user?.name || 'No disponible'}</p>
          <p><strong>Email:</strong> {session?.user?.email || 'No disponible'}</p>
        </div>

        {/* Botón de pago */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
  onClick={confirmarPago}
  style={{
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 32px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer'
  }}
>
  Confirmar y Pagar
</button>

       
        </div>
      </div>
    </div>
  );
}