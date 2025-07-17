// app/api/getArticles.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/lib/auth";
import bcrypt from 'bcrypt';
import db from '@/app/lib/db';

type ColumnKey = 'username' | 'displayname' | 'telefono' | 'contrasena';

export async function POST(req: Request) {
  const data = await req.json();
  const session = await getServerSession(authOptions);
  let newValue = data.newData;

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  // Validar que 'columna' sea segura (evitar SQL injection)
  let columnName: string;
  const allowedColumns = ['username', 'displayname', 'telefono', 'contrasena'];
  if (!allowedColumns.includes(data.column)) {
    return NextResponse.json({ error: 'Columna no válida' }, { status: 400 });
  } else {
    const columnMap: Record<ColumnKey, string> = {
        username: 'nombre_unico',
        displayname: 'nombre_publico',
        telefono: 'telefono',
        contrasena: 'contrasena',
    };

    const columnKey = data.column as ColumnKey;

    columnName = columnMap[columnKey];

    if (columnName === 'contrasena') {
        newValue = await bcrypt.hash(newValue, 10);
    }
  }

  try {
    // Verificar si el usuario existe
    const userResult = await db.query(
        'SELECT id_usuario FROM usuario WHERE id_usuario = $1',
        [userId]
    );

    if (!userResult || userResult.rowCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Editar el valor enviado
    await db.query(
        `UPDATE usuario SET ${columnName} = $1 WHERE id_usuario = $2`,
        [newValue, userId]
    );

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error al editar los datos del usuario:', error);
    return NextResponse.json({ message: 'Ocurrió un error al editar los datos del usuario' }, { status: 500 });
  }
}