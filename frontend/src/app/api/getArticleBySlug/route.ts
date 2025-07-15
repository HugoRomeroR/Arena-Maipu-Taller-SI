// app/api/getArticleById.js
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const result = await db.query(
      'SELECT * FROM articulo WHERE slug = $1',
      [data.slug]
    );

    // Error si no se encuentra
    if (result.rowCount === 0) {
        return NextResponse.json({ status: 'error' }, { status: 400 });
    }

    const article = result.rows[0]

    const autor_nombre = await db.query(
      'SELECT nombre_publico FROM usuario WHERE id_usuario = $1',
      [article.id_autor]
    );

    // Coloca el nombre del autor
    if (autor_nombre.rowCount === 0) {
        article.autor_nombre = "Error al encontrar al autor";
    }
    else {
        article.autor_nombre = autor_nombre.rows[0].nombre_publico;
    }

    // Elimina id_autor del objeto
    delete article.id_autor;

    let anterior = null;
    let siguiente = null;

    // Envia vecinos solamente si el articulo es publicado.
    if (article.estado === 'publicado') {
      // Obtener anterior y siguiente (ignorando borradores y archivados)
      const vecinos = await db.query(`
          SELECT 'anterior' AS posicion, id_articulo, slug, titulo
          FROM articulo
          WHERE id_articulo = (
              SELECT id_articulo 
              FROM articulo 
              WHERE id_articulo < $1 AND estado NOT IN ('borrador', 'archivado') 
              ORDER BY id_articulo DESC 
              LIMIT 1
          )
          
          UNION

          SELECT 'siguiente' AS posicion, id_articulo, slug, titulo
          FROM articulo
          WHERE id_articulo = (
              SELECT id_articulo 
              FROM articulo 
              WHERE id_articulo > $1 AND estado NOT IN ('borrador', 'archivado') 
              ORDER BY id_articulo ASC 
              LIMIT 1
          )
      `, [article.id_articulo]);

      for (const row of vecinos.rows) {
          if (row.posicion === 'anterior') {
              anterior = { id: row.id_articulo, slug: row.slug, titulo: row.titulo };
          } else if (row.posicion === 'siguiente') {
              siguiente = { id: row.id_articulo, slug: row.slug, titulo: row.titulo };
          }
      }
    }

    // Retorna los artículos y la cantidad de páginas
    return NextResponse.json({ status: 'ok', article: article, anterior: (anterior !== null) ? anterior : null, siguiente: (siguiente !== null) ? siguiente : null });
  } catch (error) {
    console.error('Error al consultar los artículos:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}