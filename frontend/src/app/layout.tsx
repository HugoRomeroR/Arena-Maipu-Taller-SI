import Image from "next/image";
import SessionProviderWrapper from './components/SessionProviderWrapper'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import amlogo from "../../public/amlogo.png";
import Link from "next/link";
import LoginButton from "./components/LoginButton";
import './globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="es">
      <SessionProviderWrapper session={session}>
        <title>Arena Maipú</title>
        <meta name="Arena Maipú" content="Reserva de canchas para recintos de Arena Maipú" />
        <body id='body' className='scrollbarLayout' style={styles.pageBody} >
          <ClientLayoutWrapper>
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
                    style={styles.logoImg}
                    draggable={false}
                  /> 
                </Link>

                <div style={styles.centerDiv}>
                  <Link href="/canchas" style={styles.centerDivText}> Canchas </Link>
                  <Link href="/canchas?emparejamiento=true" style={styles.centerDivText}> Buscar Equipo </Link>
                  <Link href="/inicio/blog/nosotros" style={styles.centerDivText}> Nosotros </Link>
                </div>

                <LoginButton />
              
              </div>
            </div>
            {children}
          </ClientLayoutWrapper>
        </body>
      </SessionProviderWrapper>
    </html>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageBody: {
    position: "relative",
    height: '100vh',
    width: "100vw",
    maxWidth: '100vw',
    background: "#D9D9D9",
    margin: '0',
    padding: '0',
    boxSizing: "border-box",
    overflowX: 'hidden',
  },
  headerWrapper: {
    position: 'relative',
    height: '60px',
    width: '100%',
  },
  headerBox: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
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
    flexGrow: '1',
    padding: '2px 24px',
    height: '100%',
    alignItems: 'center',
    gap: '24px',
  },
  centerDivText: {
    color: 'white',
    fontFamily: '"Helvetica Neue", sans-serif',
    textDecoration: 'none',
    userSelect: 'none',
  },
  loginButton: {
    backgroundColor: '#F09596',
    color: 'black',
    fontFamily: '"Helvetica Neue", sans-serif',
    fontWeight: 'bold',
    textDecoration: 'none',
    userSelect: 'none',
    textAlign: 'center',
    alignContent: 'center',
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
