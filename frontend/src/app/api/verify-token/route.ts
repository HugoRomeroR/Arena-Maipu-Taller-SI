import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req: Request) {
  try {
    const { token, randomSeed } = await req.json();
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // La semilla aleatoria del URL y la del token guardado no coinciden.
    // El usuario no necesita saber esto, por lo que el error es generico.
    if (payload.randomSeed !== randomSeed) {
      return NextResponse.json({ valid: false, error: 'URL invalido' }, { status: 400 });
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    // Si ocurrio un error es probable que el token no exista.
    return NextResponse.json({ valid: false, error: 'Token invalido o expirado' }, { status: 400 });
  }
}
