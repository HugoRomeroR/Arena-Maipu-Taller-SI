// app/api/getArticles.js
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function POST(req: Request) {
  const data = await req.json();
  const limit = 10;
  const offset = (data.page - 1) * limit;

  try {
    // Consigue "limit" artículos a partir de "offset" en la base de datos
    const result = await db.query(
      `SELECT id_articulo, layout, titulo, imagen_url, slug, fecha_publicacion
      FROM articulo
      WHERE estado NOT IN ('archivado', 'borrador')
      ORDER BY id_articulo DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Calcula cantidad de artículos totales y páginas
    const countResult = await db.query('SELECT COUNT(*) FROM articulo');
    const totalPosts = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalPosts / limit);

    // Retorna los artículos y la cantidad de páginas
    return NextResponse.json({ posts: result.rows, totalPages: totalPages });
  } catch (error) {
    console.error('Error al consultar los artículos:', error);
    return NextResponse.json({ error: 'Ocurrio un error al consultar los artículos' }, { status: 500 });
  }
}