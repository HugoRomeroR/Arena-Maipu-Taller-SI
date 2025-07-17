'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || session.user.role !== 'admin') {
      router.push('/');
    } else {
      setAuthorized(true);
    }
  }, [status, session, router]);

  if (status === 'loading' || !authorized) {
    return <p style={{ padding: '2rem' }}>Cargando...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {session?.user.displayname}</p>
      {/* Aquí puedes cargar las reservas, estadísticas, etc. */}
    </div>
  );
}
