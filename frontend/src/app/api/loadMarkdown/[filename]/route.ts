// src/app/api/loadMarkdown/[filename]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;

    if (!/^[\w\-]+\.md$/.test(filename)) {
      return NextResponse.json(
        { error: 'Nombre de archivo inválido' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'src/content', filename);
    const content = await fs.readFile(filePath, 'utf8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    return NextResponse.json(
      { error: 'Archivo no encontrado o error interno' },
      { status: 500 }
    );
  }
}
