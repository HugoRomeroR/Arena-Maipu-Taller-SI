// app/develop.tsx
'use client'

import { signOut, useSession } from "next-auth/react";

export default function DevelopTestPage() {
  const { data: session, status } = useSession();

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
          <p> <strong>• Cuenta creada en: </strong> {session.user?.createdAt} </p>
          <p> <strong>• Ultima conexion en: </strong> {session.user?.lastLogin} </p>
          <button onClick={() => signOut()} style={{ marginTop: "1rem" }}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <h3>❌ Aun no haz iniciado sesion</h3>
        </>
      )}
    </div>
  );
}