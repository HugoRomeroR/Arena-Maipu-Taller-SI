// app/admin/layout.tsx
'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
        <div style={styles.pageWrapper}>
            <div style={styles.profileContainer}>
            <aside style={styles.sidebar}>
                <h2 style={styles.title}>Panel de Administrador</h2>
                <nav>
                {['reservas', 'estadisticas', 'clientes-frecuentes'].map((itemKey) => (
                    <button
                        key={itemKey}
                        onClick={() => router.replace(`/admin/${itemKey}`)}
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
                    <div style={{ overflowY: 'auto', height: '100%' }}>
                        {children}
                    </div>
                </div>
            </main>
            </div>
        </div>
    );
}

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
        height: 'auto',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '1200px',
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
        overflow: 'hidden',
        boxSizing: 'border-box',
        boxShadow: '0 0 8px rgba(0,0,0,0.05)',
    },
};
