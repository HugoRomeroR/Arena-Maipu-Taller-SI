import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fecha = searchParams.get('fecha');

  const client = new Client({
    connectionString: process.env.DATABASE_PUBLIC_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM reservas WHERE fecha = $1', [fecha]);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error en /api/calendarios:', error);
    return NextResponse.json([], { status: 500 });
  } finally {
    await client.end();
  }
}