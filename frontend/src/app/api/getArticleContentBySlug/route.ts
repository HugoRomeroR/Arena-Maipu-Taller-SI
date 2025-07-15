// src/app/api/getArticleContentBySlug/route.ts
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const result = await db.query(
      'SELECT contenido FROM articulo WHERE slug = $1',
      [data.slug]
    );

    // Error si no se encuentra
    if (result.rowCount === 0) {
        return NextResponse.json({ status: 'error' }, { status: 400 });
    }

    const contenido = result.rows[0]

    // Retorna los artículos y la cantidad de páginas
    return NextResponse.json({ status: 'ok', contenido: contenido.contenido });
  } catch (error) {
    console.error('Error al buscar el archivo:', error);
    return NextResponse.json(
      { error: 'Archivo no encontrado o error interno' },
      { status: 500 }
    );
  }
}
