'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import { parseLargeDate } from '../components/utilities/parseData';
import { editUser } from '../lib/editUser';
import Image from 'next/image';
import editIcon from "../../../public/pencil.png";

export default function MiPerfil() {
    const { data: session, status, update } = useSession();
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

    const [currentEdit, setCurrentEdit] = useState<string>('default');
    const [inputValue, setInputValue] = useState<string>('');
    
    const infoBlockDisplay = (
        label: string,
        value: string,
        key: string,
        edit: boolean
    ) => {
        const isEditing = currentEdit === key;

        const handleEditButton = () => {
            setCurrentEdit(key);
            setInputValue(value);
        };

        const handleCancel = () => {
            setCurrentEdit('default');
            setInputValue('');
        };

        const handleAccept = async () => {
            const response = await editUser(inputValue, currentEdit);
            if (response.status === 'ok') {
                await update();
            }
            setCurrentEdit('default');
        };

        return (
            <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>{label}</label>
                <div
                    style={{
                    ...styles.infoBlock,
                    ...(currentEdit !== 'default' && !isEditing ? styles.disabled : {}),
                    }}
                >
                    {edit && isEditing ? (
                    <>
                        <input
                        style={styles.input}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAccept();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        autoFocus
                        />
                        <button style={styles.actionButton} onClick={handleAccept}>
                        Aceptar
                        </button>
                        <button style={styles.cancelButton} onClick={handleCancel}>
                        Cancelar
                        </button>
                    </>
                    ) : (
                    <>
                        <div style={styles.value}>{value}</div>
                        {edit && currentEdit === 'default' && (
                        <button
                            style={styles.editButton}
                            onClick={handleEditButton}
                            title="Editar"
                        >
                            <Image
                                src={editIcon}
                                alt="Editar"
                                style={styles.editIcon}
                                draggable={false}
                            />
                        </button>
                        )}
                    </>
                    )}
                </div>
            </div>
        );
    };

    const getContent = (section: string) => {
        switch (section) {
        case 'información':
            return <div>
                {status === 'loading' ? 
                    ( <p style={{ fontStyle: 'italic', color: '#888' }}>Cargando...</p> ) 
                    : session ?
                    (
                        <>
                            <div style={styles.headerInformation}>
                                <h3 style={{ margin: '12px 0 0 0' }}>¡Bienvenido{session.user?.displayname ? ", " + session.user?.displayname + "!" : "!"}</h3>
                            </div>

                            <hr style={styles.hr} />
                            <h3 style={styles.subTitleContent}>Información general</h3>
                            <hr style={styles.hr} />

                            {infoBlockDisplay('Nombre único', session.user?.username ?? '', 'username', true)}
                            {infoBlockDisplay('Nombre público', session.user?.displayname ?? '', 'displayname', true)}

                            <hr style={styles.hr} />
                            <h3 style={styles.subTitleContent}>Información personal</h3>
                            <hr style={styles.hr} />

                            {infoBlockDisplay('Correo electrónico', session.user?.email ?? '', 'email', false)}
                            {infoBlockDisplay('Teléfono de contacto', session.user?.telefono ?? '', 'telefono', true)}
                            {infoBlockDisplay('RUT', session.user?.rut_usuario ?? '', 'rut_usuario', false)}

                            <hr style={styles.hr} />
                            <h3 style={styles.subTitleContent}>Información de la cuenta</h3>
                            <hr style={styles.hr} />

                            {infoBlockDisplay('Rol de usuario', session.user?.role ?? '', 'role', false)}
                            {infoBlockDisplay('Cuenta creada en', parseLargeDate(session.user?.createdAt) ?? '', 'createdAt', false)}
                            {infoBlockDisplay('Última conexión en', parseLargeDate(session.user?.lastLogin) ?? '', 'lastLogin', false)}
                            {infoBlockDisplay('Última modificación', parseLargeDate(session.user?.updatedAt) ?? '', 'updatedAt', false)}
                        
                            <hr style={styles.hr} />
                            <h3 style={styles.subTitleContent}>Contraseña</h3>
                            <hr style={styles.hr} />

                            {infoBlockDisplay('Actualizar contraseña', '', 'contrasena', true)}
                        </>
                    ) : (
                        <h3 style={{ color: '#b00' }}>Aún no haz iniciado sesión</h3>
                    )
                }
            </div>
        case 'reservas':
            return <div>
                <div style={styles.headerInformation}>
                    <h3 style={{ margin: '12px 0 0 0' }}>Mis reservas</h3>
                </div>

                <hr style={styles.hr} />

                { /* Mensaje hardcodeado */ }
                <p style={{ margin: 0 }}>Ocurrío un error al cargar las reservas. Por favor, intentelo denuevo.</p>
                
            </div>
        case 'notificaciones':
            return <div>
                <div style={styles.headerInformation}>
                    <h3 style={{ margin: '12px 0 0 0' }}>Notificaciones</h3>
                </div>

                <hr style={styles.hr} />
                
                { /* Mensaje hardcodeado */ }
                <p style={{ margin: 0 }}>Ocurrío un error al cargar las notificaciones. Por favor, intentelo denuevo.</p>

            </div>
        case 'cerrar-sesión':
            return <div>
                <div style={styles.headerInformation}>
                    <h3 style={{ margin: '12px 0 0 0' }}>Cerrar sesión</h3>
                </div>

                <hr style={styles.hr} />
                
                <p style={{ margin: 0 }}>¿Estás seguro de que deseas salir?</p>
                <button
                    onClick={() => signOut()}
                    style={styles.buttonSignOut}
                >
                    Cerrar sesión
                </button>
            </div>
        default:
            setContent('información');
            return <div></div>
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.profileContainer}>
            <aside style={styles.sidebar}>
                <h2 style={styles.title}>Mi Perfil</h2>
                <nav>
                {['información', 'reservas', 'notificaciones', 'cerrar-sesión'].map((itemKey) => (
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
                    <div style={{ overflowY: 'auto', height: '100%' }}>
                        {getContent(content)}
                    </div>
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
    headerInformation: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        fontSize: '20px',
    },
    buttonEdit: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
    },
    buttonSignOut: {
        marginTop: '1.5rem',
        padding: '10px 16px',
        backgroundColor: '#d9534f',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    infoBlock: {
        backgroundColor: '#efefef',
        border: '1px solid #cccccc',
        borderRadius: '16px',
        padding: '12px 16px',
        marginBottom: '24px',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
    },
    label: {
        display: 'block',
        fontWeight: 600,
        fontSize: '14px',
        marginBottom: '4px',
        marginLeft: '16px',
        color: '#333',
    },
    value: {
        fontSize: '15px',
        color: '#000',
    },
    hr: {
        margin: '16px',
    },
    subTitleContent: {
        margin: '0px',
        color: 'white',
        borderRadius: '8px',
        background: 'linear-gradient(to right, #e43dbaff 0%, #ffffff 100%)',
        padding: '8px',
    },
    input: {
        fontSize: '15px',
        padding: '4px 8px',
        borderRadius: '8px',
        border: '1px solid #999',
        flex: 1,
    },
    actionButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    disabled: {
        opacity: 0.5,
        pointerEvents: 'none',
    },
    editButton: {
        width: '16px',
        height: '16px',
        padding: '0',
        border: 'none',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    editIcon: {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        pointerEvents: 'none',
    }
};
