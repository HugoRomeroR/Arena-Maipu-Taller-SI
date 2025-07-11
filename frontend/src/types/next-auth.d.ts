// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

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