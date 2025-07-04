// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/app/lib/auth"

// Gestiona la autenticacion segun las opciones definidas en
// lib/auth.ts
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }