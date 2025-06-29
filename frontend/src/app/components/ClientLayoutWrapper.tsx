'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Wrapper para el layout, contiene la logica para agregar aire entre el contenido
// y el scroll lateral (el de la derecha)
export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [haveScroll, setHaveScroll] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkScroll = () => {
      const body = document.getElementById('body')
      if (body instanceof HTMLElement) {
        const isScrollActive = body.scrollHeight > body.clientHeight
        setHaveScroll(isScrollActive)
      }
    }
    window.addEventListener('resize', checkScroll)

    // Iniciar setInterval cada 10ms durante 100ms
    checkScroll()
    const interval = setInterval(checkScroll, 10)

    // Detenerlo después de 100ms
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 100)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      window.removeEventListener('resize', checkScroll)
    }
  }, [pathname])

  return (
    <div style={{ ...(haveScroll ? { marginRight: '20px' } : { marginRight: '0px' }) }}>
      {children}
    </div>
  )
}