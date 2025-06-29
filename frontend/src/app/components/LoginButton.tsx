// app/components/LoginButton.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface MenuOption {
  name: string;
  ref: string;
  isHovered: boolean;
}

// Boton con logica para ser un login o un menu de usuario
export default function LoginButton() {
  const { status } = useSession()
  const router = useRouter()
  const [loginHover, setLoginHover] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([
    { name: 'Ver mi perfil', ref: '/perfil', isHovered: false },
    { name: 'Ver mis notificaciones', ref: '/notificaciones', isHovered: false },
    { name: 'Ver mis reservas', ref: '/reservas', isHovered: false },
    { name: 'Cerrar sesión', ref: '/cerrar-sesion', isHovered: false },
  ]);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si esta fuera del boton o del menu, cierra el menu.
      if (!buttonRef.current?.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (index: number) => {
    const updated = [...menuOptions];
    updated[index].isHovered = true;
    setMenuOptions(updated);
  };

  const handleMouseLeave = (index: number) => {
    const updated = [...menuOptions];
    updated[index].isHovered = false;
    setMenuOptions(updated);
  };

  const handleClick = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    status !== "authenticated" ?
    <Link
      href="/iniciar-sesion"
      style={{
        ...styles.button,
        backgroundColor: loginHover ? 'white' : '#F09596',
      }}
      onMouseEnter={() => setLoginHover(true)}
      onMouseLeave={() => setLoginHover(false)}
    >
      Iniciar Sesión
    </Link>
    :
    <>
      <button
        onClick={() => setOpen(!open)}
        ref={buttonRef}
        style={{
          ...styles.button,
          backgroundColor: loginHover ? 'white' : '#F09596',
        }}
        onMouseEnter={() => setLoginHover(true)}
        onMouseLeave={() => setLoginHover(false)}
      >
        Menú
      </button>

      {open && (
        <div style={styles.menu} ref={menuRef}>
          <ul style={styles.menuList}>
            {menuOptions.map((option, index) => (
              <li key={option.name}>
                <a
                  onClick={() => handleClick(option.ref)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  style={{
                    ...styles.menuItem,
                    ...(option.isHovered ? styles.menuItemHover : {}),
                    ...(option.name === 'Cerrar sesión' ? styles.logoutItem : {}),
                  }}
                >
                  {option.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    backgroundColor: '#F09596',
    color: 'black',
    fontFamily: '"Helvetica Neue", sans-serif',
    fontWeight: 'bold',
    textDecoration: 'none',
    userSelect: 'none',
    textAlign: 'center', // horizontal
    alignContent: 'center', // vertical
    border: 'none',
    borderRadius: '24px',
    margin: '12px 24px',
    padding: '2px 24px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  menu: {
    position: 'absolute',
    right: 0,
    marginTop: '60px',
    width: '220px',
    backgroundColor: 'black',
    border: 'none',
    zIndex: 10,
  },
  menuList: {
    listStyle: 'none',
    margin: 0,
    padding: '8px 0',
  },
  menuItem: {
    color: 'white',
    fontFamily: '"Helvetica Neue", sans-serif',
    textDecoration: 'none',
    userSelect: 'none',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'block',
  },
  menuItemHover: {
    color: 'black',
    backgroundColor: 'white',
  },
  logoutItem: {
    color: 'red',
  },
};