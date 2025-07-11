// lib/verificationTokenHandler.ts

import generateRandomSeed from "@/app/components/utilities/generateRandomSeed";

interface DataRegister {
  userName: string,
  displayName: string,
  email: string,
  phone: string,
  rut: string,
  password: string,
}

interface DataRecover {
  email: string,
}

type DataType = DataRegister | DataRecover;

export async function verificationTokenHandler(type: string, data: DataType): Promise<{status: string, message: string}> {
    const tokenRandomSeed = generateRandomSeed(32);
    try {
        const res = await fetch('/api/verificationTokenHandler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: type, data: data, randomSeed: tokenRandomSeed }),
        });

        const json = await res.json();

        if (!res.ok) {
            console.error('Error al generar el token:', json.error);
            return {status: 'error', message: 'Error interno al generar el token'};
        } else if (json.status === 'error') {
            console.error('Error al generar el token:', json.error);
            return {status: 'error', message: json.error};
        }
        
        return {status: json.status, message: 'Token generado exitosamente'};
    } catch (err) {
        console.error('Error en la petición:', err);
        return {status: 'error', message: 'Error interno al generar el token'};;
    }
}