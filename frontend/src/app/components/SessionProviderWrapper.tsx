'use client'

import { SessionProvider } from "next-auth/react"

// Exporta el layout para estar usando SessionProvider
export default function SessionProviderWrapper({ children, session }: { children: React.ReactNode, session?: any }) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}