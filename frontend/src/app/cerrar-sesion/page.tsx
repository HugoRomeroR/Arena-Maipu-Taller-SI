// app/cerrar-sesion/page.tsx
'use client'
import { useLayoutEffect } from 'react'
import { signOut } from 'next-auth/react'

export default function CerrarSesion() {
  useLayoutEffect(() => {
    signOut({ callbackUrl: '/inicio' })
  }, [])

  return <div></div>
}