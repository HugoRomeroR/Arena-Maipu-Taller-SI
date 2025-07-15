'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MiPerfil() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [content, setContent] = useState<string>('informacion');
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    useEffect(() => {
        const currentContent = searchParams.get('ver');
        if (currentContent !== null) {
            setContent(currentContent);
        }
    }, [searchParams])
    

    const getContent = (section: string) => {
        switch (section) {
        case 'informacion':
            return <div><h1>Información Personal</h1><p>Aquí va la info del usuario.</p></div>;
        case 'reservas':
            return <div><h1>Reservas</h1><p>Listado de tus reservas.</p></div>;
        case 'notificaciones':
            return <div><h1>Notificaciones</h1><p>Aquí van tus notificaciones.</p></div>;
        case 'cerrar-sesion':
            return <div><h1>Cerrar Sesión</h1><p>¿Estás seguro de que deseas salir?</p></div>;
        default:
            return <div><h1>Bienvenido</h1><p>Selecciona una sección.</p></div>;
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.profileContainer}>
            <aside style={styles.sidebar}>
                <h2 style={styles.title}>Mi Perfil</h2>
                <nav>
                {['información', 'reservas', 'notificaciones', 'cerrar-sesion'].map((itemKey) => (
                    <button
                        key={itemKey}
                        onClick={() => { router.replace(`/perfil?ver=${itemKey}`); setContent(itemKey) }}
                        onMouseEnter={() => setHoveredButton(itemKey)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onFocus={() => setHoveredButton(itemKey)}
                        onBlur={() => setHoveredButton(null)}
                        style={{
                            ...styles.link,
                            ...(hoveredButton === itemKey ? styles.linkHover : {}),
                        }}
                    >
                        {capitalize(itemKey.replace('-', ' '))}
                    </button>
                ))}
                </nav>
            </aside>
            <main style={styles.contentArea}>
                <div style={styles.contentBox}>
                {getContent(content)}
                </div>
            </main>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageWrapper: {
        minHeight: '100vh',
        padding: '48px',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '"Helvetica Neue", sans-serif',
    },
    profileContainer: {
        display: 'flex',
        width: '100%',
        maxWidth: '1200px',
        height: '80vh',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
    },
    sidebar: {
        width: '240px',
        padding: '24px',
        borderRight: '1px solid #eee',
        boxSizing: 'border-box',
    },
    title: {
        fontSize: '20px',
        marginBottom: '20px',
    },
    link: {
        display: 'block',
        width: '100%',
        paddingTop: '10px',
        paddingRight: '16px',
        paddingBottom: '10px',
        paddingLeft: '16px',
        marginBottom: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        textAlign: 'left',
        fontSize: '16px',
        color: '#333',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    },
    linkHover: {
        backgroundColor: '#cccccc',
        paddingLeft: '24px',
    },
    contentArea: {
        flex: 1,
        padding: '24px',
        boxSizing: 'border-box',
        backgroundColor: '#D9D9D9',
    },
    contentBox: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        overflowY: 'auto',
        boxSizing: 'border-box',
        boxShadow: '0 0 8px rgba(0,0,0,0.05)',
    },
};