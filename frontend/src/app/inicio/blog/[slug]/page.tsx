// app/inicio/blog/[slug]/page.tsx
'use client'

import { notFound, useParams } from 'next/navigation'
import { getArticleBySlug } from '@/app/lib/articles' // Ajusta el path según corresponda
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'
import Link from 'next/link'

interface Article {
    id_articulo: number;
    autor_nombre: string;
    id_evento: number | null;

    titulo: string;
    contenido: string;
    imagen_url: string | null;
    slug: string;
    layout: number | null;

    estado: 'borrador' | 'publicado' | 'archivado';
    fecha_creacion: string;
    fecha_publicacion: string | null;
    fecha_modificacion: string | null;

    es_evento: boolean;
}

interface PostInfo {
    titulo: string;
    slug: string;
}

export default function BlogPost() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [status, setStatus] = useState<string>('default');
  const [postAnterior, setPostAnterior] = useState<PostInfo | null>(null);
  const [postSiguiente, setPostSiguiente] = useState<PostInfo | null>(null);
  
    useEffect(() => {
        async function getArticle() {
            const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug ?? '';
            const response = await getArticleBySlug(slug);
            setStatus(response.status);
            setArticle(response.article);
            setPostAnterior(response.anterior);
            setPostSiguiente(response.siguiente);
        }

        getArticle();
    }, [params])

    if (status === 'error') {
        return notFound()
    } else if (status === 'default') {
        return (
            <div style={styles.container}>
                Cargando contenido...
            </div>
        )
    }

    return (
    <div style={styles.container}>
        
        {/* Estado del artículo */}
        <div style={styles.estado}>
        <strong>{article?.estado ? article?.estado.toUpperCase() : 'DESCONOCIDO'}</strong> | Creado: { article?.fecha_creacion ? new Date(article.fecha_creacion).toLocaleDateString() : "Error al conseguir la fecha..." } { article?.fecha_modificacion ? '| Modificado:' + new Date(article.fecha_modificacion).toLocaleDateString() : ""}
        </div>

        {/* Navegación entre posts */}
        <div style={styles.navegacion}>
            <div style={styles.navegacionItem}>
                {postAnterior && (
                <Link href={`/inicio/blog/${postAnterior.slug}`}>
                    ← {postAnterior.titulo}
                </Link>
                )}
            </div>

            <div style={styles.navegacionItem}>
                <strong>{article?.titulo}</strong>
            </div>

            <div style={styles.navegacionItem}>
                {postSiguiente && (
                <Link href={`/inicio/blog/${postSiguiente.slug}`}>
                    {postSiguiente.titulo} →
                </Link>
                )}
            </div>
        </div>

        <hr />        

        {/* Imagen y Título */}
        <div style={styles.imagenTitulo}>
            {article?.imagen_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={article.imagen_url}
                    alt={article.titulo}
                    width={120}
                    height={120}
                    style={styles.imagen}
                />
            )}
            <h1 style={styles.titulo}>{article?.titulo}</h1>
        </div>

        {/* Autor y Fecha */}
        <div style={styles.autorFecha}>
            Por {article?.autor_nombre ? <strong>{article.autor_nombre}</strong> : 'Sin autor'} | Publicado: {article?.fecha_publicacion ? new Date(article.fecha_publicacion).toLocaleDateString() : 'Sin publicar'}
        </div>

        <hr />

        {/* Contenido del artículo */}
        <div style={styles.contenido}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {article?.contenido}
            </ReactMarkdown>
        </div>
    </div>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '16px',
        fontFamily: '"Helvetica Neue", sans-serif',
    },
    estado: {
        marginBottom: '1rem',
        color: '#888',
        fontFamily: '"Verdana", sans-serif',
        fontSize: '14px',
    },
    navegacion: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '0px',
        fontFamily: '"Verdana", sans-serif',
        color: '#222',
        fontSize: '14px',
        overflow: 'hidden',
    },
    navegacionItem: {
        flex: '1',
        padding: '0.75rem 1rem',
        wordBreak: 'break-word',
        whiteSpace: 'normal',
        textAlign: 'center',
    },
    tituloNavegacion: {
        textAlign: 'center',
        flex: '1',
        fontWeight: '700',
    },
    imagenTitulo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
    },
    titulo: {
        margin: 0,
        fontSize: '32px',
        fontWeight: '700',
        flex: '1',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '1rem',
    },
    imagen: {
        objectFit: 'cover',
        borderRadius: '8px',
        maxWidth: '120px',
        height: 'auto',
    },
    autorFecha: {
        marginBottom: '1rem',
        color: '#555',
        fontStyle: 'italic',
        fontSize: '14px',
        fontFamily: '"Verdana", sans-serif',
    },
    contenido: {
        marginTop: '2rem',
        backgroundColor: '#f0f0f0',
        padding: '1.5rem',
        borderRadius: '0px',
        color: '#111',
        fontSize: '16px',
    },
};
