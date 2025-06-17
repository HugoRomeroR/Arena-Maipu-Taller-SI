import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // Seguridad básica: evitar leer archivos fuera de la carpeta
    if (!/^[\w\-]+\.md$/.test(filename)) {
      return NextResponse.json({ error: 'Nombre de archivo inválido' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src/content', filename);
    const content = fs.readFileSync(filePath, 'utf8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Archivo no encontrado o error interno' },
      { status: 500 }
    );
  }
}