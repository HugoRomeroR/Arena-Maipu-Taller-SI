// @/app/lib/articles.ts

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

export async function getArticleBySlug(slug: string | null): Promise<{status: string, article: Article | null, anterior: PostInfo | null, siguiente: PostInfo | null}> {
    if (slug === null) {
        return {status: 'error', article: null, anterior: null, siguiente: null};
    }
    
    try {
        const res = await fetch('/api/getArticleBySlug', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: slug }),
        });

        const json = await res.json();

        if (!res.ok) {
            console.error('Error al obtener datos del articulo:', json.error);
            return {status: 'error', article: null, anterior: null, siguiente: null};
        } else if (json.status === 'error') {
            console.error('Error al obtener datos del articulo:', json.error);
            return {status: 'error', article: null, anterior: null, siguiente: null};
        }
        
        return {status: json.status, article: json.article, anterior: json.anterior, siguiente: json.siguiente};
    } catch (err) {
        console.error('Error en la petición:', err);
        return {status: 'error', article: null, anterior: null, siguiente: null};
    }
}