import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_PUBLIC_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Canchas más reservadas
    const canchasQuery = await client.query(`
      SELECT cancha, COUNT(*) AS reservas
      FROM reservas
      GROUP BY cancha
      ORDER BY reservas DESC
      LIMIT 10
    `);

    // Clientes más frecuentes
    const clientesQuery = await client.query(`
      SELECT usuario AS nombre, COUNT(*) AS reservas
      FROM reservas
      GROUP BY usuario
      ORDER BY reservas DESC
      LIMIT 10
    `);

    // Totales
    const totalReservasQuery = await client.query(`SELECT COUNT(*) FROM reservas`);
    const totalUsuariosQuery = await client.query(`SELECT COUNT(DISTINCT usuario) FROM reservas`);

    return NextResponse.json({
      canchas: canchasQuery.rows,
      clientes: clientesQuery.rows,
      totales: {
        reservas: parseInt(totalReservasQuery.rows[0].count),
        usuarios: parseInt(totalUsuariosQuery.rows[0].count),
      },
    });
  } catch (error) {
    console.error('[ESTADISTICAS_ERROR]', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  } finally {
    await client.end();
  }
}
