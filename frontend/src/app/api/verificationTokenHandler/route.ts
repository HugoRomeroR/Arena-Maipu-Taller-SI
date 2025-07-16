// app/api/devtest/route.ts
import { generateVerificationToken } from '@/app/lib/generateVerificationToken';
import generatePassword from '@/app/components/utilities/generatePassword';
import { sendVerificationEmail } from "@/app/lib/emailResend";
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import db from '@/app/lib/db';

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

// Devuelve un token de verificación temporal (24h) para el registro o recuperación de cuenta
// Y se encarga de crearlo con datos públicos y una semilla aleatoria
// Tambien guarda los datos privados en la base de datos
export async function POST(req: Request) {
  try {
    const { type, data, randomSeed } = (await req.json()) as {
      type: 'register' | 'recover';
      data: DataRegister | DataRecover;
      randomSeed: string;
    };
    let publicData;
    let privateData;
    let typeConfirmed;

    // Revisa todos los tipos de petición
    if (type !== 'register' && type !== 'recover') {
      return NextResponse.json({ status: 'error', error: 'El motivo de su petición no se encontró.' }, { status: 400 });
    }
    // Revisa que la semilla aleatoria exista
    if (!randomSeed) {
      return NextResponse.json({ status: 'error', error: 'Hubo un problema en la generación de su petición: Semilla no encontrada' }, { status: 400 });
    }
    // Revisa que los datos sean correctos para la petición de recuperación o registro
    if (type === 'recover') {
      const recoverData = data as DataRecover;
      if (!recoverData.email) {
        return NextResponse.json({ status: 'error', error: 'El correo electrónico es obligatorio para la recuperación.' }, { status: 400 });
      }
      else {
        typeConfirmed = 'recover';
        const randomId = randomUUID();
        const randomPassword = generatePassword(8);
        publicData = {
          randomId: randomId,
          email: recoverData.email,
        };
        privateData = {
          type: 'recover',
          password: randomPassword,
        };
      }
    }
    else if (type === 'register') {
      const registerData = data as DataRegister;
      if (!registerData.userName || !registerData.displayName || !registerData.email || !registerData.phone || !registerData.rut || !registerData.password) {
        return NextResponse.json({ status: 'error', error: 'Faltan datos obligatorios para el registro.' }, { status: 400 });
      }
      else {
        typeConfirmed = 'register';
        const randomId = randomUUID();
        publicData = {
          randomId: randomId,
          userName: registerData.userName,
          displayName: registerData.displayName,
          email: registerData.email,
        };
        privateData = {
          phone: registerData.phone,
          rut: registerData.rut,
          password: registerData.password,
          type: 'register',
        };
      }
    }
    if ((publicData === undefined || privateData === undefined)) {
      return NextResponse.json({ status: 'error', error: 'Hubo un problema en la generación de su petición: Datos no encontrados' }, { status: 500 });
    }
    else if (Object.keys(publicData).length === 0 || Object.keys(privateData).length === 0) {
      return NextResponse.json({ status: 'error', error: 'Faltan datos obligatorios para la petición.' }, { status: 400 });
    }
    else {
      const token = generateVerificationToken(publicData, randomSeed);
      // Se genero un token exitosamente
      try {
        await db.query(
          `INSERT INTO token_verificacion_email (id, public_data, private_data) 
          VALUES ($1, $2, $3)`,
          [publicData.randomId, publicData, privateData]
        );
        if (typeConfirmed === 'register') {
          await sendVerificationEmail(publicData.email, `${process.env.NEXT_PUBLIC_DOMAIN_URL}/verificar-email/${randomSeed}?token=${token}`, privateData.type, null);
        } else if (typeConfirmed === 'recover') {
          await sendVerificationEmail(publicData.email, `${process.env.NEXT_PUBLIC_DOMAIN_URL}/verificar-email/${randomSeed}?token=${token}`, privateData.type, privateData.password);
        }
        return NextResponse.json({ status: 'ok' });
      } catch {
        return NextResponse.json({ status: 'error', error: 'Error al guardar los datos.' }, { status: 400 });
      };
    }
  } catch {
    return NextResponse.json({ status: 'error', error: 'Hubo un problema en la generación de su petición: Error interno' }, { status: 500 });
  }
}