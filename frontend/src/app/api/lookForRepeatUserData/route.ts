// app/api/lookForRepeatUserData/route.ts
import { NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function POST(req: Request) {
  const data = await req.json();
  const client = await db.connect();

  try {
    if (data.email) {
      const res = await client.query('SELECT 1 FROM usuario WHERE email = $1 LIMIT 1', [data.email]);
      if ((res.rowCount ?? 0) > 0)
        return NextResponse.json({ message: `Ya existe una cuenta registrada con el correo ${data.email}`, messageType: 'email' });
    }

    if (data.userName) {
      const res = await client.query('SELECT 1 FROM usuario WHERE nombre_unico = $1 LIMIT 1', [data.userName]);
      if ((res.rowCount ?? 0) > 0)
        return NextResponse.json({ message: `Ya existe una cuenta registrada con el username ${data.userName}`, messageType: 'userName' });
    }

    if (data.phone) {
      const res = await client.query('SELECT 1 FROM usuario WHERE telefono = $1 LIMIT 1', [data.phone]);
      if ((res.rowCount ?? 0) > 0)
        return NextResponse.json({ message: `Ya existe una cuenta registrada con el teléfono ${data.phone}`, messageType: 'phone' });
    }

    if (data.rut) {
      const res = await client.query('SELECT 1 FROM usuario WHERE rut_usuario = $1 LIMIT 1', [data.rut]);
      if ((res.rowCount ?? 0) > 0)
        return NextResponse.json({ message: `Ya existe una cuenta registrada con el RUT ${data.rut}`, messageType: 'rut' });
    }

    return NextResponse.json({ message: 'ok', messageType: 'ok' });
  } catch (error) {
    console.error('Error validando datos:', error);
    return NextResponse.json({ message: 'Ocurrio un error al intentar validar los datos', messageType: 'default'  }, { status: 500 });
  } finally {
    client.release();
  }
}