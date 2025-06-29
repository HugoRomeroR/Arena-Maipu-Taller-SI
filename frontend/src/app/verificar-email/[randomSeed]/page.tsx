'use client';

import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerificarEmailPage() {
  const searchParams = useSearchParams();
  const { randomSeed } = useParams(); // ✅ Obtenido desde el pathname
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const seedFromUrl = randomSeed;

    // Si el URL no tiene un token de verificación, no se puede hacer la validación.
    // El token viene en formato ?token={...ABad3233Fg...} en el URL
    if (!token) {
      setError('Token de verificación no proporcionado.');
      return;
    }

    const verificar = async () => {
      const res = await fetch('/api/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, randomSeed: seedFromUrl }),
      });

      const data = await res.json();

      if (!data.valid) {
        setError(data.error || 'Token inválido o expirado');
      } else {
        router.replace('/iniciar-sesion?registro-exitoso=true');
      }
    };

    verificar();
  }, [searchParams, randomSeed, router]);

  return (
    <div style={styles.bodyPage}>
			<div className="background-img" />
			<div className="background-img-color" />
			<div style={styles.whiteBoxWrappers}>
				<div style={styles.whiteBox}>
					<div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: (error === null) ? 'black' : 'red',
          }}>
						{ (error === null) ?
              "Verificando su correo..."
              :
              error
            }
					</div>
				</div>
        { (error !== null) &&
          <div style={styles.whiteBox}>
            Por favor, revise el URL o intente registrandose nuevamente.
          </div>
        }
			</div>
		</div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
	bodyPage: {
		position: 'relative',
		width: '100%',
		height: 'calc(100vh - 60px)',
	},
	whiteBoxWrappers: {
		position: 'relative',
		display: 'flex',
		height: 'calc(100vh - 60px)',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		flexGrow: '1',
		gap: '16px',
	},
	whiteBox: {
		display: 'flex',
		flexDirection: 'column',
		color: 'black',
		backgroundColor: 'rgba(255, 255, 255, 0.65)',
		borderRadius: '20px',
		border: 'none',
		fontFamily: '"Helvetica Neue", sans-serif',
		fontSize: '16px',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		width: 'auto',
		padding: '24px 64px',
		margin: '0',
		gap: '16px',
		boxSizing: 'border-box',
	},
}