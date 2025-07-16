'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Wrapper para el layout, contiene la logica para agregar aire entre el contenido
// y el scroll lateral (el de la derecha)
export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [haveScroll, setHaveScroll] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    let frame: number
    let resizeObserver: ResizeObserver
    let mutationObserver: MutationObserver

    const checkScroll = () => {
      const el = document.documentElement
      const isScrollActive = el.scrollHeight > el.clientHeight
      setHaveScroll(isScrollActive)
    }

    const scheduleScrollCheck = () => {
      let count = 0
      const checkRepeatedly = () => {
        checkScroll()
        count++
        if (count < 5) {
          frame = requestAnimationFrame(checkRepeatedly)
        }
      }
      checkRepeatedly()
    }

    // Escuchar resize de ventana
    window.addEventListener('resize', checkScroll)

    const target = document.getElementById('body') || document.body

    // Observar cambios de tamaño
    // eslint-disable-next-line prefer-const
    resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(target)

    // Observar cambios estructurales (nodos hijos, etc.)
    // eslint-disable-next-line prefer-const
    mutationObserver = new MutationObserver(checkScroll)
    mutationObserver.observe(target, {
      childList: true,
      subtree: true,
    })

    // Chequeos iniciales
    checkScroll()
    scheduleScrollCheck()

    return () => {
      window.removeEventListener('resize', checkScroll)
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  return (
    <div style={{ ...(haveScroll ? { marginRight: '20px' } : { marginRight: '0px' }) }}>
      {children}
    </div>
  )
}