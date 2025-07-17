// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [/* tus proveedores */],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.displayname = user.displayname;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.displayname = token.displayname as string;
      }
      return session;
    }
  }
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rut_usuario: string;
      email: string;
      telefono: string;
      username: string;
      displayname: string;
      role: string;
      createdAt: string;
      lastLogin: string;
      updatedAt: string;
    } & DefaultSession["user"];
    expires: string;
  }

  interface User extends DefaultUser {
    id: string;
    rut_usuario: string;
    email: string;
    telefono: string;
    username: string;
    displayname: string;
    role: string;
    createdAt: string;
    lastLogin: string;
    updatedAt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rut_usuario: string;
    email: string;
    telefono: string;
    username: string;
    displayname: string;
    role: string;
    createdAt: string;
    lastLogin: string;
    updatedAt: string;
  }
}