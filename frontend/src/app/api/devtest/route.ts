// app/api/devtest/route.ts
import { generateVerificationToken } from '@/app/lib/generateVerificationToken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, username, displayname, randomSeed } = await req.json();

    if (!email || !randomSeed) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }

    const token = generateVerificationToken({ email, username, displayname }, randomSeed);

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Error generando token' }, { status: 500 });
  }
}