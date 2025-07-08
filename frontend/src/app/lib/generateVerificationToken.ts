// lib/jwt/generateVerificationToken.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Crea un token que dura 24 horas que contiene data y una semilla aleatoria
// La semilla se puede usar para validaciones posteriores.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateVerificationToken(data: any, randomSeed: string) {
  const payload = {
    ...data,
    randomSeed,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  });

  return token;
}
