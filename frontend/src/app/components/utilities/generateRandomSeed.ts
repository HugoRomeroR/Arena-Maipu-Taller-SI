import { randomBytes } from 'crypto';

// Devuelve una semilla aleatoria en formato base64url
// Por defecto, genera una semilla de 32 bytes
export default function generateRandomSeed(length = 32): string {
  return randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}