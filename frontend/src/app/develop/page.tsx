// app/develop.tsx
'use client'

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { generateVerificationToken } from "../lib/generateVerificationToken";
import { useRouter } from "next/navigation";

interface Data {
  email: 'string',
  username: 'string',
  displayname: 'string',
}

export default function DevelopTestPage() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>("");
  const router = useRouter();

  const cuentaPrueba = {
    email: 'hromeror@utem.cl',
    username: 'Hugo',
    displayname: 'Jinja',
  }
  const randomSeed = "thisisarandomseed"

  async function generateToken(
    email: string,
    username: string,
    displayname: string,
    randomSeed: string
  ): Promise<string | null> {
    try {
      const res = await fetch('/api/devtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, displayname, randomSeed }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error('Error al generar el token:', json.error);
        return null;
      }

      return json.token;
    } catch (err) {
      console.error('Error en la petición:', err);
      return null;
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Esta pagina solo estara disponible en develop, es util para ver algunas herramientas
        de API antes de colocarlas finalmente.
      </h1>

      {status === "loading" ? (
        <p>Cargando...</p>
      ) : session ? (
        <>
          <h3>✅ Ha iniciado sesión como:</h3>
          <p> <strong>• Email: </strong> {session.user?.email}</p>
          <p> <strong>• Identificacion: </strong> {session.user?.username} </p>
          <p> <strong>• Nombre: </strong> {session.user?.displayname} </p>
          <p> <strong>• Rol: </strong> {session.user?.role} </p>
          <p> <strong>• Cuenta creada en: </strong> {session.user?.date} </p>
          <button onClick={() => signOut()} style={{ marginTop: "1rem" }}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <h3>❌ Aun no haz iniciado sesion</h3>
          <button
            onClick={async () => {
              const token = await generateToken(cuentaPrueba.email, cuentaPrueba.username, cuentaPrueba.displayname, randomSeed);
              setToken(token);
            }}
            style={{ marginTop: "1rem" }}
          >
            Generar token
          </button>
          <br></br><br></br><br></br>
          <a onClick={() => router.push(`http://localhost:3000/verificar-email/${randomSeed}?token=${token}`)}>
            http://localhost:3000/verificar-email/{randomSeed}?token={token}
          </a>
        </>
      )}
    </div>
  );
}