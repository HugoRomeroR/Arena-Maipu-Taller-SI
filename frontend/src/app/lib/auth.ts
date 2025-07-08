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
//     username: "usuario10ejemplo",
//     displayname: "Usuario De Ejemplo",
//     email: "usuario@correo.com",
//     role: "admin",
//     date: "20/02/2024",
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

          return {
            id: user.id_usuario.toString(),
            username: user.nombre_unico,
            displayname: user.nombre_publico,
            email: user.email,
            role: user.rol_usuario,
            date: user.fecha_creacion,
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
        token.username = user.username
        token.displayname = user.displayname
        token.email = user.email
        token.role = user.role
        token.date = user.date
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.displayname = token.displayname
        session.user.email = token.email
        session.user.role = token.role
        session.user.date = token.date
      }
      return session
    },
  },
}