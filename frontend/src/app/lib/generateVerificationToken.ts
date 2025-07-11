// lib/generateVerificationToken.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

interface PublicDataRegister {
  randomId: string,
  userName: string,
  displayName: string,
  email: string,
}

interface PublicDataRecover {
  randomId: string,
  email: string,
}

type PublicDataType = PublicDataRegister | PublicDataRecover;

// Crea un token que dura 24 horas que contiene data y una semilla aleatoria
// La semilla se puede usar para validaciones posteriores.
export function generateVerificationToken(publicData: PublicDataType, randomSeed: string) {
  const payload = {
    publicData,
    randomSeed,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  });

  return token;
}
