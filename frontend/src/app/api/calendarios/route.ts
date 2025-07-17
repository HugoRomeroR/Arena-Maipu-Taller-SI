import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request: Request) {
  const body = await request.json();

  const client = new Client({
    connectionString: process.env.DATABASE_PUBLIC_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        usuario TEXT,
        cancha TEXT,
        hora TEXT,
        fecha TEXT
      )
    `);

    await client.query(
      'INSERT INTO reservas (usuario, cancha, hora, fecha) VALUES ($1, $2, $3, $4)',
      [body.usuario, body.cancha, body.hora, body.fecha]
    );

    return NextResponse.json({ success: true }); // ✅ Siempre devolver JSON
  } catch (error) {
    console.error('Error al guardar reserva:', error);
    return NextResponse.json({ success: false, error: 'Error en el servidor' }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function GET() {
  const client = new Client({ connectionString: process.env.DATABASE_PUBLIC_URL, ssl: { rejectUnauthorized: false } });

  await client.connect();
  const result = await client.query('SELECT * FROM reservas');
  await client.end();

 return NextResponse.json({ reservas: result.rows });

}

 // ✅ JSON de reservas

