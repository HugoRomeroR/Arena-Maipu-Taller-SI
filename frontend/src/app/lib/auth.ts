// app/lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import db from './db';
import bcrypt from 'bcryptjs';

// Configura NextAuth.js con el proveedor de credenciales.
// Si las credenciales son válidas, se crea un JWT con los datos del usuario.
// La sesión resultante estará disponible en el cliente vía useSession().
//
// Ejemplo de sesión (lado cliente):
// {
//   user: {
//     id: "1",
//     rut_usuario: "12.345.678-9",
//     email: "usuario@correo.com",
//     telefono: "+12 3 4567 2389",
//     username: "usuario10ejemplo",
//     displayname: "Usuario De Ejemplo",
//     role: "admin",
//     createdAt: "2023-10-01T12:00:00.000Z",
//     lastLogin: "2023-10-01T12:00:00.000Z",
//     updatedAt: "2023-10-01T12:00:00.000Z"
//   },
//   expires: "2025-07-01T00:00:00.000Z"
// }
//
// NextAuth expone automáticamente rutas como:
// - /api/auth/session         → para obtener la sesión actual
// - /api/auth/callback/...    → para procesar el login
// - /api/auth/signin, signout → para iniciar/cerrar sesión
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const result = await db.query(
            'SELECT * FROM usuario WHERE LOWER(email) = LOWER($1)',
            [credentials.email]
          );

          const user = result.rows[0];
          if (!user) return null

          const isValid = await bcrypt.compare(credentials.password, user.contrasena);
          if (!isValid) return null;

          // Actualiza la última conexión
          await db.query(
            'UPDATE usuario SET fecha_ultima_conexion = NOW() WHERE id_usuario = $1',
            [user.id_usuario]
          );

          return {
            id: user.id_usuario.toString(),
            rut_usuario: user.rut_usuario,
            email: user.email,
            telefono: user.telefono,
            username: user.nombre_unico,
            displayname: user.nombre_publico,
            role: user.rol_usuario,
            createdAt: user.fecha_creacion,
            lastLogin: new Date().toISOString(),
            updatedAt: user.fecha_ultima_modificacion,
          };

        } catch (err) {
          console.error("Error en authorize:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/iniciar-sesion",
    signOut: "/cerrar-sesion",
    error: "/error", // No se esta usando
    verifyRequest: "/verificar-sesion", // No se esta usando
    newUser: "/bienvenido", // No se esta usando
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.rut_usuario = user.rut_usuario
        token.email = user.email
        token.telefono = user.telefono
        token.username = user.username
        token.displayname = user.displayname
        token.role = user.role
        token.createdAt = user.createdAt
        token.lastLogin = user.lastLogin
        token.updatedAt = user.updatedAt
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.rut_usuario = token.rut_usuario
        session.user.email = token.email
        session.user.telefono = token.telefono
        session.user.username = token.username
        session.user.displayname = token.displayname
        session.user.role = token.role
        session.user.createdAt = token.createdAt
        session.user.lastLogin = token.lastLogin
        session.user.updatedAt = token.updatedAt
      }
      return session
    },
  },
}