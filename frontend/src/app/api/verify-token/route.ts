import { NextResponse } from 'next/server';
import isEqual from 'lodash.isequal';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '@/app/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req: Request) {
  try {
    const { token, randomSeed } = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // Validación básica de semilla
    if (payload.randomSeed !== randomSeed) {
      return NextResponse.json({ valid: false, error: 'URL invalido' }, { status: 400 });
    }

    // Valida que la id esté presente en el payload
    const id = payload.publicData?.randomId;
    if (!id) {
      return NextResponse.json({ valid: false, error: 'Token mal formado' }, { status: 400 });
    }

    // Consulta a la BD por el token
    const result = await db.query(
      `SELECT public_data, private_data, expires_at FROM token_verificacion_email WHERE id = $1`,
      [id]
    );

    // Si no se encuentra el token, retorna error
    const row = result.rows[0];
    if (!row) {
      return NextResponse.json({ valid: false, error: 'Token no encontrado' }, { status: 404 });
    }

    // Validar que public_data coincida exactamente
    const storedPublicData = row.public_data;
    const storedPrivateData = row.private_data;
    const expiresAt = row.expires_at;

    // Comparar JSONs
    const matches = isEqual(payload.publicData, storedPublicData);
    const notExpired = new Date() < new Date(expiresAt);

    // Si no coinciden o el token está expirado, retorna error
    if (!matches) {
      return NextResponse.json({ valid: false, error: 'Datos no coinciden' }, { status: 400 });
    }

    if (!notExpired) {
      // Elimina la row si está expirado
      await db.query(
        `DELETE FROM token_verificacion_email WHERE id = $1`,
        [id]
      );
      return NextResponse.json({ valid: false, error: 'Token expirado' }, { status: 400 });
    }

    // Si es un registro, verifica si el email ya existe
    if (storedPrivateData.type === 'register') {
      // Si el email ya existe en la base de datos, retorna error
      const emailExists = await db.query(
        `SELECT 1 FROM usuario WHERE email = $1`,
        [storedPublicData.email]
      );
      // Si el username ya existe en la base de datos, retorna error
      const userNameExists = await db.query(
        `SELECT 1 FROM usuario WHERE nombre_unico = $1`,
        [storedPublicData.userName]
      );
      // Si el telefono ya existe en la base de datos, retorna error
      const phoneExists = await db.query(
        `SELECT 1 FROM usuario WHERE telefono = $1`,
        [storedPrivateData.phone]
      );
      // Si el rut ya existe en la base de datos, retorna error
      const rutExists = await db.query(
        `SELECT 1 FROM usuario WHERE rut_usuario = $1`,
        [storedPrivateData.rut]
      );

      if (emailExists.rows.length > 0) {
        // Elimina la row
        await db.query(
          `DELETE FROM token_verificacion_email WHERE id = $1`,
          [id]
        );
        return NextResponse.json({ valid: false, error: 'El email ya está registrado' }, { status: 400 });
      }
      if (userNameExists.rows.length > 0) {
        // Elimina la row
        await db.query(
          `DELETE FROM token_verificacion_email WHERE id = $1`,
          [id]
        );
        return NextResponse.json({ valid: false, error: 'El nombre de usuario ya está registrado' }, { status: 400 });
      }
      if (phoneExists.rows.length > 0) {
        // Elimina la row
        await db.query(
          `DELETE FROM token_verificacion_email WHERE id = $1`,
          [id]
        );
        return NextResponse.json({ valid: false, error: 'El teléfono ya está registrado' }, { status: 400 });
      }
      if (rutExists.rows.length > 0) {
        // Elimina la row
        await db.query(
          `DELETE FROM token_verificacion_email WHERE id = $1`,
          [id]
        );
        return NextResponse.json({ valid: false, error: 'El RUT ya está registrado' }, { status: 400 });
      }

      // Si todo es valido, agrega el payload publico y privado a la base de datos
      const hashedPassword = await bcrypt.hash(storedPrivateData.password, 10);
      await db.query(
        `INSERT INTO usuario (nombre_unico, nombre_publico, email, telefono, rut_usuario, contrasena, fecha_creacion, rol_usuario)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)`,
        [
          storedPublicData.userName,
          storedPublicData.displayName,
          storedPublicData.email,
          storedPrivateData.phone,
          storedPrivateData.rut,
          hashedPassword,
          'cliente'
        ]
      );
      // Elimina la row
      await db.query(
        `DELETE FROM token_verificacion_email WHERE id = $1`,
        [id]
      );

      // Si todo es válido
      return NextResponse.json({ valid: true, type: 'register' });
    }
    // Si es una recuperación, no se hace nada en la base de datos aun,
    // solo se verifica que el email exista
    else if (storedPrivateData.type === 'recover') {
      const emailExists = await db.query(
        `SELECT 1 FROM usuario WHERE email = $1`,
        [storedPublicData.email]
      );

      // Si el email no está registrado, retorna error
      if (emailExists.rows.length === 0) {
        return NextResponse.json({ valid: false, error: 'El email no está registrado' }, { status: 400 });
      }

      // Recupera el email y la contraseña del usuario
      const password = await db.query(
        `SELECT contrasena FROM usuario WHERE email = $1`,
        [storedPublicData.email]
      );
      // Elimina la row
      await db.query(
        `DELETE FROM token_verificacion_email WHERE id = $1`,
        [id]
      );

      // Si todo es válido
      return NextResponse.json({ valid: true, type: 'recover', email: storedPublicData.email, password: password });
    }

  } catch (err) {
    console.error('Error en verificación:', err);
    return NextResponse.json({ valid: false, error: 'Token invalido o expirado' }, { status: 400 });
  }
}
