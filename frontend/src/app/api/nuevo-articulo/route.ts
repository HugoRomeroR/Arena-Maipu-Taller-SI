// app/api/nuevo-articulo/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/lib/auth";
import db from '@/app/lib/db'; // Asegúrate de que esta ruta sea correcta

export async function POST(req: Request) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { title, background, content, slug, articleLayout, dateLayout } = data;

  try {
    await db.query(
      `INSERT INTO articulo (es_evento, estado, id_autor, titulo, imagen_url, contenido, slug, layout, fecha_creacion, fecha_publicacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [false, 'publicado', session.user.id, title, background, content, slug, articleLayout, dateLayout, dateLayout]
    );

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error al insertar el artículo:', error);
    return NextResponse.json({ error: 'No se pudo guardar el artículo' }, { status: 500 });
  }
}
