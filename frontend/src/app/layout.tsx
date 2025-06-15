'use client';

import Image from "next/image";
import amlogo from "../../public/amlogo.png";
import Link from "next/link";
import React, { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Estado para manejar el hover del botón de inicio de sesión
  const [hoverLogin, setHoverLogin] = useState(false)

  return (
    <html lang="es">
      <title>Arena Maipú</title>
      <meta name="Arena Maipú" content="Reserva de canchas para recintos de Arena Maipú" />
      <body style={styles.pageBody}>
        <div style={styles.headerWrapper}>
          <div style={styles.headerBox}>
            
            <Link href="/inicio"
              style={{
                height: '100%',
                objectFit: 'contain',
                display: 'flex',
                alignItems: 'center',
                margin: '0px 24px',
              }}>
              <Image
                src={amlogo}
                alt="Arena Maipú Logo"
                style={{
                  ...styles.logoImg,
                }}
                draggable={false}
              /> 
            </Link>

            <div style={styles.centerDiv}>
              <Link href="/canchas" style={styles.centerDivText}> Canchas </Link>
              <Link href="/buscar-equipo" style={styles.centerDivText}> Buscar Equipo </Link>
              <Link href="/nosotros" style={styles.centerDivText}> Nosotros </Link>
            </div>

            <Link
              href="/login"
              style={{
                ...styles.loginButton,
                ...(hoverLogin ? styles.loginButtonHover : {}),
              }}
              onMouseEnter={() => setHoverLogin(true)}
              onMouseLeave={() => setHoverLogin(false)}
            >
              Iniciar Sesión
            </Link>
          
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
pageBody: {
  position: "relative",
  minHeight: "100vh",
  width: "100vw",
  background: "#AEAEAE",
  margin: 0,
  padding: 0,
  boxSizing: "border-box",
  overflowX: 'hidden',
},
  headerWrapper: {
    position: 'relative',
    height: '60px',
    width: '100%',
    overflow: 'hidden',
  },
  headerBox: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
  },
  logoImg: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  centerDiv: {
    display: 'flex',
    flexGrow: '1', // se estira para ocupar el espacio restante
    padding: '2px 24px',
    height: '100%',
    alignItems: 'center',
    gap: '24px',
  },
  centerDivText: {
    color: 'white',
    fontFamily: '"Helvetica Neue", sans-serif',
    textDecoration: 'none',
  },
  loginButton: {
    backgroundColor: '#FF9D25',
    color: 'black',
    fontFamily: '"Helvetica Neue", sans-serif',
    fontWeight: 'bold',
    textDecoration: 'none',
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
  loginButtonHover: {
    backgroundColor: 'white',
  },
}